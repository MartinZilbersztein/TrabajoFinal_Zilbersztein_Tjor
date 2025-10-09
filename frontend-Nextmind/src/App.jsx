import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiSend } from "react-icons/fi";
import "../src/App.css";

export default function App() {
  const [holeId, setHoleId] = useState(null);
  const [messages, setMessages] = useState([
    { role: "bot", text: "¡Hola! Soy tu ChatBot. ¿En qué puedo ayudarte hoy?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Crear un chat automáticamente
  useEffect(() => {
    const createHole = async () => {
      try {
        const response = await fetch("http://localhost:3000/holes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoryId: 1 }),
        });
        const data = await response.json();
        setHoleId(data.id);
      } catch (err) {
        console.error("Error al crear el chat:", err);
      }
    };

    createHole();
  }, []);

  // Autoscroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

 const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage = { role: "user", text: input };
  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setLoading(true);

  try {
    const response = await fetch(`http://localhost:3000/holes/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage.text, categoryId: 1 }),
    });

    if (!response.ok) throw new Error("Error en la respuesta del servidor");

    const data = await response.json();
    const botMessage = { role: "bot", text: data.message };
    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    console.error(error);
    setMessages((prev) => [
      ...prev,
      { role: "bot", text: "❌ Error al obtener respuesta." },
    ]);
  } finally {
    setLoading(false);
  }
};
 

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-app">
      <header className="chat-header">💬 ChatBot</header>

      <div className="chat-window">
        <div className="chat-body">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`chat-bubble ${m.role}`}
            >
              {m.text}
            </motion.div>
          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="chat-bubble bot"
            >
              Generando respuesta...
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <footer className="chat-footer">
        <textarea
          className="chat-input"
          placeholder="Escribí un mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={1}
          disabled={loading} // Solo deshabilitamos mientras llega la respuesta
        />
        <button
          onClick={sendMessage}
          disabled={loading} // Igual aquí
          className={`chat-send ${loading ? "loading" : ""}`}
        >
          <FiSend size={22} />
        </button>
      </footer>
    </div>
  );
}
