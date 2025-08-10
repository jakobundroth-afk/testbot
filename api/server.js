const express = require('express');
const axios = require('axios');
const cors = require('cors'); // CORS-Paket hinzufügen
const app = express();
const port = 3000;

// CORS aktivieren und Webflow-Domain erlauben
app.use(cors({
  origin: 'https://lucas-trendy-site-90c902.webflow.io' // Ersetze mit deiner Webflow-Domain
}));

app.use(express.json());

// Ersetze mit deinem OpenAI API-Schlüssel
const OPENAI_API_KEY = 'YOUR_API_KEY';

// API-Endpunkt für Chatbot-Anfragen
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }],
        max_tokens: 150,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const botReply = response.data.choices[0].message.content.trim();
    res.json({ reply: botReply });
  } catch (error) {
    console.error('Fehler:', error.response ? error.response.data : error.message);
    res.status(500).json({ reply: 'Serverfehler. Bitte versuche es erneut.' });
  }
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
