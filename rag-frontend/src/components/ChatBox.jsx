import { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function ChatBox({ documentId }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMessage = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/query`, {
        question,
        documentId,
      });

      const assistantMessage = {
        role: "assistant",
        content: response.data.answer,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleAsk();
  };

  return (
    <div className="chat">
      <div className="chat-log" aria-live="polite">
        {messages.length === 0 && !loading && (
          <div className="chat-empty">
            <span>[SESSION READY]</span>
            <span>Enter a query to inspect the indexed source.</span>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div className={`message message--${msg.role}`} key={idx}>
            <strong className="message__role">{msg.role === "user" ? "user@local:~$" : "insight_ai:~#"}</strong>
            <span className="message__content">{msg.content}</span>
          </div>
        ))}
        {loading && <p className="thinking">[PROCESSING] RETRIEVING CONTEXT</p>}
      </div>

      <div className="command-line">
        <label className="command-line__prompt" htmlFor="document-query">user@local:~$</label>
        <input
          id="document-query"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="ask something about your document..."
          disabled={loading}
          autoComplete="off"
        />
        <button className="terminal-button" onClick={handleAsk} disabled={loading || !question.trim()}>
          [ SEND ]
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
