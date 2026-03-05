export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) return res.status(500).json({ error: "GEMINI_API_KEY not configured" });

  try {
    const { messages, system, maxTokens, image, mediaType, prompt } = req.body;

    // Build Gemini contents array
    const contents = [];

    // Vision request (photo analysis)
    if (image) {
      contents.push({
        role: "user",
        parts: [
          { inlineData: { mimeType: mediaType, data: image } },
          { text: prompt || "Describe this image." },
        ],
      });
    }
    // Chat request
    else if (messages && messages.length > 0) {
      for (const msg of messages) {
        const role = msg.role === "assistant" ? "model" : "user";
        if (typeof msg.content === "string") {
          contents.push({ role, parts: [{ text: msg.content }] });
        }
      }
    }

    if (contents.length === 0) {
      return res.status(400).json({ error: "No messages or image provided" });
    }

    // Gemini request
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: system ? { parts: [{ text: system }] } : undefined,
          generationConfig: {
            maxOutputTokens: maxTokens || 1000,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.json().catch(() => ({}));
      console.error("Gemini API error:", err);
      return res.status(geminiRes.status).json({
        error: err.error?.message || `Gemini API error ${geminiRes.status}`,
      });
    }

    const data = await geminiRes.json();

    // Extract text from Gemini response
    const text =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") ||
      "";

    return res.status(200).json({ text });
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
