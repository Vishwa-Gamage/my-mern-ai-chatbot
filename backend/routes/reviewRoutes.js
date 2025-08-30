const express = require('express');
const router = express.Router();
const { askGroqReview } = require('../groqClient');

router.post('/', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code?.trim()) {
      return res.status(400).json({ error: "Code cannot be empty" });
    }
    const review = await askGroqReview(code);
    res.json({ review });
  } catch (err) {
    console.error("Review error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
