require('dotenv').config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function groqRequest(messages, max_tokens = 500, temperature = 0.7) {
  const response = await fetch(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages,
        max_tokens,
        temperature,
      }),
    }
  );

  const data = await response.json();
  console.log("✅ Groq API response:", JSON.stringify(data, null, 2));

  if (data.error) {
    throw new Error(data.error.message || "Groq API Error");
  }

  return data.choices?.[0]?.message?.content || "⚠️ No answer returned";
}

// 🔹 Chatbot (normal Q&A)
async function askGroqChat(question) {
  return await groqRequest(
    [{ role: "user", content: question }],
    500,
    0.7
  );
}

// 🔹 Code Reviewer (structured review)
async function askGroqReview(code) {
  return await groqRequest(
    [
      {
        role: "system",
        content: `You are a senior software engineer and code reviewer. 
                  Review the given code and respond with two sections:

                  1. **Review Report** – Cover:
                     - Code Quality
                     - Best Practices
                     - Security Concerns
                     - Performance
                     - Maintainability

                  2. **Improved Version** – Provide a fully improved version of the code
                     following modern best practices, with comments where helpful.

                  Format the response in Markdown.`
      },
      { role: "user", content: code }
    ],
    1500, // enough tokens for review + code
    0.3
  );
}


module.exports = { askGroqChat, askGroqReview };
