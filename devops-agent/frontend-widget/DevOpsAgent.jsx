import { useState, useRef, useEffect } from "react";

const AGENT_URL = import.meta.env.VITE_AGENT_URL || "http://localhost:8000";

export default function DevOpsAgent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "agent", text: "Hi. I'm your DevOps copilot. Ask me about pods, pipelines, alerts, or health." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const sessionId = useRef(`session-${Date.now()}`);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput("");
    setMessages(m => [...m, { role: "user", text: question }]);
    setLoading(true);
    try {
      const res = await fetch(`${AGENT_URL}/api/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, session_id: sessionId.current }),
      });
      const data = await res.json();
      setMessages(m => [...m, { role: "agent", text: data.answer }]);
    } catch {
      setMessages(m => [...m, { role: "agent", text: "⚠️ Agent unreachable. Is the devops-agent service running?" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          width: 52, height: 52, borderRadius: "50%",
          background: "#6c5ce7", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(108,92,231,0.4)", color: "#fff", fontSize: 22,
        }}
        title="DevOps Agent"
      >
        {open ? "✕" : "⚙"}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: "fixed", bottom: 86, right: 24, zIndex: 9998,
          width: 380, height: 520, background: "#fff",
          borderRadius: 12, border: "1px solid #e0e0e0",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          fontFamily: "system-ui, sans-serif",
        }}>
          {/* Header */}
          <div style={{ background: "#6c5ce7", color: "#fff", padding: "12px 16px", fontWeight: 600, fontSize: 14 }}>
            ⚙ DevOps Copilot <span style={{ fontWeight: 400, opacity: 0.8, fontSize: 12 }}>· read-only mode</span>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "90%",
                background: m.role === "user" ? "#6c5ce7" : "#f1f0ff",
                color: m.role === "user" ? "#fff" : "#333",
                borderRadius: 8, padding: "8px 12px",
                fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-wrap",
              }}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: "flex-start", background: "#f1f0ff", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#888" }}>
                Checking platform…
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ display: "flex", borderTop: "1px solid #eee", padding: 8, gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask about pods, alerts, pipelines…"
              style={{
                flex: 1, border: "1px solid #ddd", borderRadius: 6,
                padding: "6px 10px", fontSize: 13, outline: "none",
              }}
            />
            <button
              onClick={send}
              disabled={loading}
              style={{
                background: "#6c5ce7", color: "#fff", border: "none",
                borderRadius: 6, padding: "6px 14px", cursor: "pointer",
                fontSize: 13, fontWeight: 600,
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}