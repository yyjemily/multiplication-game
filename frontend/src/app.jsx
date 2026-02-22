/* 

import React, { useState, useEffect, useRef } from "react";
import { sendQuery, addDoc } from "./api";

export default function App(){
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem("chat_history") || "[]"); }
    catch { return []; }
  });
  const [loading, setLoading] = useState(false);
  const useContextRef = useRef(false);

  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(messages));
  }, [messages]);

  const submit = async (e) => {
    e && e.preventDefault();
    if(!input.trim()) return;
    const q = input.trim();
    const userMsg = { id: Date.now(), role: "user", text: q };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendQuery(q, useContextRef.current);
      if(res.error){
        setMessages(m => [...m, { id: Date.now()+1, role: "assistant", text: "Error: " + res.error }]);
      } else {
        // simplistic streaming UX: show typing ellipses then content
        await new Promise(r => setTimeout(r, 300)); // micro delay for UX
        setMessages(m => [...m, { id: Date.now()+2, role: "assistant", text: res.answer }]);
      }
    } catch(err){
      setMessages(m => [...m, { id: Date.now()+3, role: "assistant", text: "Request failed." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoc = async () => {
    const title = prompt("Doc title?");
    const content = prompt("Doc content?");
    if(title && content){
      await addDoc(title, content);
      alert("Document added to embeddings store");
    }
  };

  const clear = () => { setMessages([]); localStorage.removeItem("chat_history"); };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>AI Chat</h1>
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => useContextRef.current = !useContextRef.current}>
          Toggle use_context: {useContextRef.current ? "ON" : "OFF"}
        </button>
        <button onClick={handleAddDoc} style={{ marginLeft: 8 }}>Add Doc (for context)</button>
        <button onClick={clear} style={{ marginLeft: 8 }}>Clear</button>
      </div>

      <div style={{ border: "1px solid #ddd", padding: 12, minHeight: 300, marginBottom: 12 }}>
        {messages.map(m => (
          <div key={m.id} style={{ margin: "10px 0" }}>
            <strong style={{ color: m.role === "user" ? "#111" : "#0066cc" }}>
              {m.role === "user" ? "You" : "AI"}
            </strong>
            <div style={{ whiteSpace: "pre-wrap", marginTop: 6 }}>{m.text}</div>
          </div>
        ))}
        {loading && <div style={{ color: "#666" }}>AI is typing...</div>}
      </div>

      <form onSubmit={submit} style={{ display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} style={{ flex: 1, padding: 8 }} placeholder="Ask something..." />
        <button type="submit" disabled={loading} style={{ padding: "8px 16px" }}>Send</button>
      </form>
    </div>
  );
}

*/