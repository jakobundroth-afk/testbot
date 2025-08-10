export default async function handler(req, res) {
  const allowedOrigin = "https://lucas-trendy-site-90c902.webflow.io";

  // Setze die CORS-Header auf **jeden** Response
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle Preflight-Request
  if (req.method === "OPTIONS") {
    // 204 No Content oder 200 OK reicht
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await openaiRes.json();

    // Auch hier unbedingt den CORS-Header mitgeben
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    return res.status(200).json(data);
  } catch (error) {
    // Auch bei Fehler CORS-Header setzen
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    return res.status(500).json({ error: error.message });
  }
}
