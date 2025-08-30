const express = require('express');
const router = express.Router();
const { askGroqChat } = require('../groqClient');

router.post('/', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question?.trim()) {
      return res.status(400).json({ error: "Question cannot be empty" });
    }
    const answer = await askGroqChat(question);
    res.json({ answer });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
