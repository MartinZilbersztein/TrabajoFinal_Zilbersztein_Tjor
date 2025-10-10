import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { HoleContext } from "../contexts/HoleContext";
import * as holeService from "../services/hole-service";
import ChatHeader from "../components/ChatHeader";
import ChatConversation from "../components/ChatConversation";
import ChatInput from "../components/ChatInput";
import PageNotFound from "./PageNotFound";
import "./HolePage.css";
import { set } from "zod";

export default function HolePage() {
  const { holeId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [notExists, setNotExists] = useState(false);


  // Hole managment

  const createHole = async () => {
    try {
      const hole = await holeService.createHole();
      setHoleId(hole.id);
    } catch (err) {
      console.error("Error al crear el chat:", err);
    }
  };

  const getHole = async (holeId) => {
    let hole = null;
    try {
      hole = await holeService.getHole(holeId);
      console.log(hole);
    } catch (err) {
      console.error("Error al obtener el chat:", err);
    }
    return hole;
  };

  const setHoleId = (id) => {
    window.history.replaceState(null, null, `/#/hole/${id}`);
  };


  // Crear/obtener chat automáticamente

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        if (holeId && holeId === "new") {
          await createHole();
        } else if (holeId) {
          const hole = await getHole(holeId);
          if (cancelled) return;
          if (hole) {
            setMessages(hole.messages || []);
          } else {
            setNotExists(true);
          }
        } else {
          setHoleId("new");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [holeId]);

  // Autoscroll

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (notExists) {
    return <PageNotFound />;
  }


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
            body: JSON.stringify({ message: userMessage.text, categoryId: categoryId ?? 1 }),
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

  return (
    <div className="chat-app">
      <HoleContext.Provider value={{
        holeId,
        setHoleId,
        messages,
        sendMessage,
        input,
        setInput,
        loading,
        setLoading
      }}>
        <ChatHeader />
        <ChatConversation messagesEndRef={messagesEndRef} />
        <ChatInput />
      </HoleContext.Provider>
    </div>
  );
}
