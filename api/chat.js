export default async function handler(req, res) {
  // Erlaube nur Anfragen von deiner Webflow-Domain (sicherer)
  const allowedOrigin = "https://lucas-trendy-site-90c902.webflow.io";

  // Setze CORS Header für alle Anfragen
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle OPTIONS (Preflight) Anfragen, die der Browser vor POST schickt
  if (req.method === "OPTIONS") {
    // Preflight Antwort: einfach 200 OK zurückgeben
    return res.status(200).end();
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
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
