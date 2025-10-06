import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSend } from "react-icons/fi";
import "../src/App.css";

export default function App() {
  // Mensaje inicial del bot
  const [categories, setCategories] = useState([]);
  const [messages, setMessages] = useState([
    { role: "bot", text: "¡Hola! Soy tu ChatBot. ¿En qué puedo ayudarte hoy?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(()=>{
    const fetchCategories = async () => {
      const response = await fetch("http://localhost:3000/hole/categories");
      const newCategories = await response.json();
      setCategories(newCategories);
    }

    fetchCategories();
  }, []);

  // Autoscroll al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/hole/generate/123", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });

      if (!response.ok) throw new Error("Error en la respuesta del servidor");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulated = "";

      // Añadimos un mensaje vacío del bot para ir completando
      setMessages((prev) => [...prev, { role: "bot", text: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk
          .split("\n")
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.replace(/^data:\s*/, ""));

        for (const line of lines) {
          if (line === "[DONE]") break;
          accumulated += line;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].text = accumulated;
            return updated;
          });
        }
      }
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
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className={`chat-send ${loading ? "loading" : ""}`}
        >
          <FiSend size={22} />
        </button>
      </footer>
    </div>
  );
}
