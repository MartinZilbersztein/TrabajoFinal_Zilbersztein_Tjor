import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { HoleContext } from "../contexts/HoleContext";
import * as holeService from "../services/hole-service";
import ChatHeader from "../components/ChatHeader";
import ChatConversation from "../components/ChatConversation";
import ChatInput from "../components/ChatInput";
import PageNotFound from "./PageNotFound";
import "./HolePage.css";

export default function HolePage() {
  const { holeID } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notExists, setNotExists] = useState(false);
  const messagesEndRef = useRef(null);


  // Crear/obtener chat automáticamente

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (holeID && holeID === "new") {
          await createHole();
        } else if (holeID) {
          const hole = await getHole(holeID);
          if (hole) setMessages(hole.messages || []);
          else      setNotExists(true);
        } else {
          setHoleID("new");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [holeID]);


  // Autoscroll

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);


  // Hole managment

  const createHole = async () => {
    try {
      const hole = await holeService.createHole();
      setHoleID(hole.id);
    } catch (err) {
      console.error("Error al crear el chat:", err);
    }
  };

  const getHole = async (holeID) => {
    let hole = null;
    try {
      hole = await holeService.getHole(holeID);
    } catch (err) {
      console.error("Error al obtener el chat:", err);
    }
    return hole;
  };

  const setHoleID = (newHoleID) => {
    if (newHoleID !== 'new') {
      window.history.replaceState(null, null, `/#/hole/${newHoleID}`);
    }
  };

  const sendMessage = async (message) => {
    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const data = await holeService.sendMessage(holeID, message);
      const botMessage = { role: "assistant", content: data.message };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Error al obtener respuesta." },
      ]);
    } finally {
      setLoading(false);
    }
  };


  // Render

  if (notExists) {
    return <PageNotFound />;
  }

  return (
    <div className="hole-page">
      <HoleContext.Provider value={{
        holeID,
        setHoleID,
        messages,
        sendMessage,
        loading,
        setLoading
      }}>
        {/* <Sidebar /> */}
        <div className="chat-container">
          <ChatHeader />
          <ChatConversation messagesEndRef={messagesEndRef} />
          <ChatInput />
        </div>
      </HoleContext.Provider>
    </div>
  );
}
