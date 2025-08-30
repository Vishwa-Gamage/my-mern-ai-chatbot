import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import './App.css';

function App() {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [codeInput, setCodeInput] = useState("");
  const [reviewOutput, setReviewOutput] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const [loadingReview, setLoadingReview] = useState(false);

  const chatContainerRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if(chatContainerRef.current){
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Chatbot handler
  const sendChat = async () => {
    if (!chatInput.trim()) return;
    setLoadingChat(true);
    try {
      const res = await axios.post("http://localhost:5000/api/chat", { question: chatInput });
      setChatMessages([
        ...chatMessages,
        { type: "user", text: chatInput },
        { type: "bot", text: res.data.answer },
      ]);
      setChatInput("");
    } catch (err) {
      console.error("Chatbot error:", err);
      alert("Chatbot request failed. Check backend.");
    } finally {
      setLoadingChat(false);
    }
  };

  // Code reviewer handler
  const sendReview = async () => {
    if (!codeInput.trim()) return;
    setLoadingReview(true);
    try {
      const res = await axios.post("http://localhost:5000/ai/get-review", { code: codeInput });
      setReviewOutput(res.data.review || "No review returned.");
    } catch (err) {
      console.error("Code review error:", err);
      alert("Code review request failed. Check backend.");
    } finally {
      setLoadingReview(false);
    }
  };

  // Handle code file upload
  const handleCodeFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setCodeInput(e.target.result); // place file content in textarea
    };
    reader.readAsText(file);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        AI Chat & Code Reviewer
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Chatbot Section */}
        <div className="section">
          <h2>Chatbot</h2>
          <div className="chat-container" ref={chatContainerRef}>
            {chatMessages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.type}`}>
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask a question..."
          />
          <button onClick={sendChat} disabled={loadingChat} className="chat-btn">
            {loadingChat ? "Sending..." : "Send"}
          </button>
        </div>

        {/* Code Reviewer Section */}
        <div className="section">
          <h2>Code Reviewer</h2>
          
          {/* Upload code file */}
          <input 
            type="file" 
            accept=".js,.py,.java,.c,.cpp,.ts,.jsx" 
            onChange={handleCodeFileUpload} 
            style={{ marginBottom: "10px" }}
          />

          {/* Code textarea */}
          <textarea
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            placeholder="Paste your code here..."
          />
          <button onClick={sendReview} disabled={loadingReview} className="code-btn">
            {loadingReview ? "Reviewing..." : "Get Review"}
          </button>
          {reviewOutput && (
            <div className="review-output">
              <Markdown>{reviewOutput}</Markdown>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        &copy; 2025 Vishwa Gamage | <a href="https://github.com/Vishwa-Gamage">GitHub</a> | <a href="https://linkedin.com/in/vishwa-gamage-968000227">LinkedIn</a>
      </footer>
    </div>
  );
}

export default App;
