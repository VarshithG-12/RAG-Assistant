import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);

  const backendUrl = "http://127.0.0.1:8000";

  const askQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");
    setSources([]);

    try {
      const res = await axios.post(`${backendUrl}/ask`, {
        question: question,
      });

      setAnswer(res.data.answer);
      setSources(res.data.sources || []);
    } catch (err) {
      setAnswer("❌ Error connecting to backend.");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
        maxWidth: "900px",
        margin: "auto",
      }}
    >
      <h1 style={{ textAlign: "center" }}>📄 Mini RAG Assistant</h1>

      <textarea
        rows="5"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask something from your documents..."
        style={{
          width: "100%",
          padding: "15px",
          fontSize: "16px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          outline: "none",
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            askQuestion();
          }
        }}
      />

      <button
        onClick={askQuestion}
        disabled={loading}
        style={{
          marginTop: "15px",
          padding: "12px 25px",
          fontSize: "16px",
          cursor: loading ? "not-allowed" : "pointer",
          borderRadius: "10px",
          border: "none",
          backgroundColor: loading ? "#888" : "#007bff",
          color: "white",
          fontWeight: "bold",
        }}
      >
        {loading ? "Thinking..." : "Ask"}
      </button>

      <div style={{ marginTop: "30px" }}>
        {loading && <p>⏳ Thinking...</p>}

        {answer && (
          <div
            style={{
              marginTop: "20px",
              background: "#f2f2f2",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #ddd",
            }}
          >
            <h2>Answer:</h2>
            <p style={{ fontSize: "16px", lineHeight: "1.6" }}>{answer}</p>
          </div>
        )}

        {sources.length > 0 && (
          <div
            style={{
              marginTop: "25px",
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #ddd",
            }}
          >
            <h3>Sources:</h3>
            <ul style={{ paddingLeft: "20px" }}>
              {sources.map((src, idx) => (
                <li key={idx} style={{ marginBottom: "15px" }}>
                  <b>{src.source}</b> (chunk {src.chunk_id})
                  <br />
                  <span style={{ color: "#444" }}>
                    <i>{src.preview}</i>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
