import { useContext, useState } from "react";
import { FiSend } from "react-icons/fi";
import { HoleContext } from "../../contexts/HoleContext";
import "./ChatInput.css";

export default function ChatInput() {
  const { sendMessage, loading } = useContext(HoleContext);
  const [input, setInput] = useState("");

  const sendMessageHandler = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  }

   const handleKeyPress = (e) => {
     if (e.key === "Enter" && !e.shiftKey) {
       e.preventDefault();
       sendMessageHandler();
     }
   };

    return (
        <div className="chat-footer">
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
                onClick={sendMessageHandler}
                disabled={loading} // Igual aquí
                className={`chat-send ${loading ? "loading" : ""}`}
            >
                <FiSend size={22} />
            </button>
        </div>
    );
}
