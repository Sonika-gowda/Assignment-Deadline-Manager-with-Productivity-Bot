const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

// OpenAI setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

// POST /api/bot/ask
router.post('/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ answer: 'Question is required.' });

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo', // or gpt-4 if you have access
      messages: [
        { role: 'system', content: 'You are a helpful assistant for assignment management and productivity.' },
        { role: 'user', content: question }
      ],
      max_tokens: 150
    });

    const answer = completion.data.choices[0].message.content;
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: 'Could not get an answer. Please try again later.' });
  }
});

module.exports = router;
