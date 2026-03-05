export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const GEMINI_KEY = process.env.GEMINI_API_KEY;

  // Health check — open /api/chat in browser to test
  if (req.method === "GET") {
    return res.status(200).json({
      status: "ok",
      keyConfigured: !!GEMINI_KEY,
      keyPrefix: GEMINI_KEY ? GEMINI_KEY.slice(0, 8) + "..." : "NOT SET",
    });
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!GEMINI_KEY) return res.status(500).json({ error: "GEMINI_API_KEY not set in Vercel environment variables" });

  try {
    const { messages, system, maxTokens, image, mediaType, prompt } = req.body;

    // Build Gemini contents array
    let contents = [];

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
        if (typeof msg.content === "string" && msg.content.trim()) {
          contents.push({ role, parts: [{ text: msg.content }] });
        }
      }
    }

    if (contents.length === 0) {
      return res.status(400).json({ error: "No messages or image provided" });
    }

    // Gemini requires alternating roles — merge consecutive same-role messages
    const merged = [];
    for (const c of contents) {
      if (merged.length > 0 && merged[merged.length - 1].role === c.role) {
        merged[merged.length - 1].parts.push(...c.parts);
      } else {
        merged.push({ ...c, parts: [...c.parts] });
      }
    }
    // Gemini requires first message to be "user"
    if (merged.length > 0 && merged[0].role !== "user") {
      merged.unshift({ role: "user", parts: [{ text: "Hello" }] });
    }

    const MODEL = "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

    const geminiRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_KEY,
      },
      body: JSON.stringify({
        contents: merged,
        systemInstruction: system ? { parts: [{ text: system }] } : undefined,
        generationConfig: {
          maxOutputTokens: maxTokens || 4000,
          temperature: 0.7,
        },
      }),
    });

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      console.error("Gemini error:", JSON.stringify(data));
      return res.status(geminiRes.status).json({
        error: data.error?.message || `Gemini API error ${geminiRes.status}`,
      });
    }

    const text =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";

    return res.status(200).json({ text });
  } catch (err) {
    console.error("Proxy error:", err.message);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
