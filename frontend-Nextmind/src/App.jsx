import { useState, useEffect, useRef } from "react";
import { HoleContext } from "./contexts/HoleContext";
import ChatHeader from "./components/ChatHeader";
import ChatWindow from "./components/ChatWindow";
import ChatFooter from "./components/ChatFooter";
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

  return (
    <div className="chat-app">
      <HoleContext.Provider value={{ holeId, setHoleId, messages, setMessages, input, setInput, loading, setLoading }}>
        <ChatHeader />
        <ChatWindow messagesEndRef={messagesEndRef} />
        <ChatFooter />
      </HoleContext.Provider>
    </div>
  );
}
