export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const GEMINI_KEY = process.env.GEMINI_API_KEY;

  // Health check
  if (req.method === "GET") {
    return res.status(200).json({
      status: "ok",
      keyConfigured: !!GEMINI_KEY,
      keyPrefix: GEMINI_KEY ? GEMINI_KEY.slice(0, 8) + "..." : "NOT SET",
    });
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!GEMINI_KEY) return res.status(500).json({ error: "GEMINI_API_KEY not set" });

  try {
    const { messages, system, maxTokens, image, mediaType, prompt } = req.body;

    let contents = [];

    if (image) {
      contents.push({
        role: "user",
        parts: [
          { inlineData: { mimeType: mediaType, data: image } },
          { text: prompt || "Describe this image." },
        ],
      });
    } else if (messages && messages.length > 0) {
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

    // Merge consecutive same-role messages (Gemini requirement)
    const merged = [];
    for (const c of contents) {
      if (merged.length > 0 && merged[merged.length - 1].role === c.role) {
        merged[merged.length - 1].parts.push(...c.parts);
      } else {
        merged.push({ ...c, parts: [...c.parts] });
      }
    }
    if (merged.length > 0 && merged[0].role !== "user") {
      merged.unshift({ role: "user", parts: [{ text: "Hello" }] });
    }

    const body = JSON.stringify({
      contents: merged,
      systemInstruction: system ? { parts: [{ text: system }] } : undefined,
      generationConfig: {
        maxOutputTokens: maxTokens || 4000,
        temperature: 0.7,
      },
    });

    // Try with primary model, retry once on rate limit, then fallback to lighter model
    const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"];

    for (let attempt = 0; attempt < MODELS.length; attempt++) {
      const model = MODELS[attempt];
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

      const geminiRes = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": GEMINI_KEY },
        body,
      });

      const data = await geminiRes.json();

      // Rate limited — try fallback model immediately instead of waiting
      if (geminiRes.status === 429 && attempt < MODELS.length - 1) {
        console.log(`Rate limited on ${model}, trying ${MODELS[attempt + 1]}...`);
        continue;
      }

      if (!geminiRes.ok) {
        console.error("Gemini error:", JSON.stringify(data));
        return res.status(geminiRes.status).json({
          error: data.error?.message || `Gemini API error ${geminiRes.status}`,
        });
      }

      const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
      return res.status(200).json({ text });
    }

    return res.status(429).json({ error: "Rate limit exceeded. Please wait a moment and try again." });
  } catch (err) {
    console.error("Proxy error:", err.message);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
