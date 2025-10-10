import { useContext } from "react";
import { motion } from "motion/react";
import { HoleContext } from "../../contexts/HoleContext";
import "./ChatWindow.css";

export default function ChatWindow({ messagesEndRef }) {
  const { messages, loading } = useContext(HoleContext);

  return (
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
  );
}
