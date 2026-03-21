// ─── Rate Limiting ───────────────────────────────────────────────────────────
// In-memory store: { [ip]: { count, resetDate } }
// Resets daily. Survives across requests but clears on cold start (acceptable).
const rateLimitMap = new Map();
const DAILY_LIMIT = parseInt(process.env.DAILY_LIMIT || "10", 10);

function getRateLimit(ip) {
  const today = new Date().toDateString();
  let entry = rateLimitMap.get(ip);
  if (!entry || entry.resetDate !== today) {
    entry = { count: 0, resetDate: today };
    rateLimitMap.set(ip, entry);
  }
  // Clean old entries periodically (every 100 checks)
  if (rateLimitMap.size > 500) {
    for (const [key, val] of rateLimitMap) {
      if (val.resetDate !== today) rateLimitMap.delete(key);
    }
  }
  return entry;
}

export default async function handler(req, res) {
  // CORS — locked to production origin only
  const allowedOrigins = [
    "https://iron-protocol-ruby.vercel.app",
    "https://iron-protocol.vercel.app",
  ];
  const origin = req.headers.origin || "";
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");
  if (req.method === "OPTIONS") return res.status(200).end();

  const GEMINI_KEY = process.env.GEMINI_API_KEY;

  // Health check
  if (req.method === "GET") {
    return res.status(200).json({
      status: "ok",
      keyConfigured: !!GEMINI_KEY,
      dailyLimit: DAILY_LIMIT,
    });
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!GEMINI_KEY) return res.status(500).json({ error: "GEMINI_API_KEY not set" });

  // ─── Input size guard ────────────────────────────────────────────────────
  const bodyStr = JSON.stringify(req.body || {});
  if (bodyStr.length > 20000) {
    return res.status(413).json({ error: "Request too large. Please shorten your message." });
  }
  // Cap maxTokens to prevent runaway responses
  if (req.body?.maxTokens && req.body.maxTokens > 2000) {
    req.body.maxTokens = 2000;
  }

  // ─── Rate limit check ───────────────────────────────────────────────
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
  const limit = getRateLimit(ip);
  if (limit.count >= DAILY_LIMIT) {
    return res.status(429).json({
      error: `Daily limit reached (${DAILY_LIMIT} requests). Resets at midnight.`,
      remaining: 0,
    });
  }
  limit.count++;
  const remaining = DAILY_LIMIT - limit.count;
  res.setHeader("X-RateLimit-Remaining", remaining);

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
      limit.count--; // Don't count invalid requests
      return res.status(400).json({ error: "No messages or image provided" });
    }

    // Merge consecutive same-role messages
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

    const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-preview-04-17";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": GEMINI_KEY },
      body,
    });

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      limit.count--; // Don't count failed API calls
      console.error("Gemini error:", JSON.stringify(data));
      return res.status(geminiRes.status).json({
        error: data.error?.message || `Gemini API error ${geminiRes.status}`,
        remaining,
      });
    }

    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
    return res.status(200).json({ text, remaining });
  } catch (err) {
    limit.count--; // Don't count errors
    console.error("Proxy error:", err.message);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
