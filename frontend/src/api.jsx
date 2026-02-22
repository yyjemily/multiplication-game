import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

/*
export async function sendQuery(query, useContext=false) {
  const resp = await axios.post(`${API_BASE}/api/chat`, { query, use_context: useContext });
  return resp.data;
}

export async function addDoc(title, content) {
  const resp = await axios.post(`${API_BASE}/api/embeddings_add`, { title, content });
  return resp.data;
}
*/ 
