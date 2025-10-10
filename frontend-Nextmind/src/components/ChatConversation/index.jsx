import { useContext } from "react";
import { motion } from "motion/react";
import { HoleContext } from "../../contexts/HoleContext";
import CategoryButtons from "../UI/CategoryButtons";
import "./ChatConversation.css";

export default function ChatConversation({ messagesEndRef }) {
  const { messages, loading } = useContext(HoleContext);
  
  return (
  <div className="chat-conversation">
    <div className="chat-body">
      <motion.div 
        key={0}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="chat-bubble bot"
      >
        {`¡Hola! Empecemos a investigar. Elegí una categoría para empezar:`}
        <CategoryButtons />
      </motion.div>
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
