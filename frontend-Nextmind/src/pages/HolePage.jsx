import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { HoleContext } from "../contexts/HoleContext";
import * as holeService from "../services/hole-service";
import ChatHeader from "../components/ChatHeader";
import ChatConversation from "../components/ChatConversation";
import ChatInput from "../components/ChatInput";
import PageNotFound from "./PageNotFound";
import "./HolePage.css";

export default function HolePage() {
  const { holeID } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notExists, setNotExists] = useState(false);
  const messagesEndRef = useRef(null);
  const creatingPromiseRef = useRef(null);
  const resolvedHoleIdRef = useRef(null);


  // Crear/obtener chat automáticamente

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (holeID && holeID === "new") {
          await ensureHoleId();
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


  useEffect(() => {
    const input = searchParams.get("input");
    if (messages.length !== 0 && input) {
      sendMessage(input);
    }
    setSearchParams({});
  }, [messages, searchParams]);


  // Autoscroll

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);


  // Hole managment

  const createHole = async () => {
    const hole = await holeService.createHole();
    if (hole && hole.id) return hole.id;
    return null;
  };

  const ensureHoleId = async () => {
    // If already resolved during this session, return it
    if (resolvedHoleIdRef.current) return resolvedHoleIdRef.current;
    // If URL carries a concrete id, cache and return it
    if (holeID && holeID !== 'new') {
      resolvedHoleIdRef.current = holeID;
      return holeID;
    }
    // Single-flight: if creating is in progress, await the same promise
    if (creatingPromiseRef.current) return creatingPromiseRef.current;
    // Start creation
    creatingPromiseRef.current = (async () => {
      const id = await createHole();
      if (id) {
        resolvedHoleIdRef.current = id;
        setHoleID(id);
        creatingPromiseRef.current = null;
        return id;
      }
      creatingPromiseRef.current = null;
      return null;
    })();
    return creatingPromiseRef.current;
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
    // Only update the URL if we have a valid holeID and it's different from the current one
    if (newHoleID && newHoleID !== 'new' && newHoleID !== holeID) {
      navigate(`/hole/${newHoleID}`, { replace: true });
    }
  };

  const sendMessage = async (input) => {
    // Don't send empty messages
    if (!input || !input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // Always ensure we have a concrete hole id (single-flight creation)
      const currentHoleID = await ensureHoleId();
      
      if (!currentHoleID) {
        throw new Error("No se pudo crear o obtener el chat");
      }

      const data = await holeService.sendMessage(currentHoleID, input);
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

  // Provide context to child components
  const contextValue = {
    holeID,
    setHoleID,
    messages,
    sendMessage,
    loading,
    setLoading
  };


  // Render

  if (notExists) {
    return <PageNotFound />;
  }

  return (
    <div className="hole-page">
      <HoleContext.Provider value={contextValue}>
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
