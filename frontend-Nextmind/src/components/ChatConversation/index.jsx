import { useContext } from "react";
import formatMessage from "../../helpers/format-message-helper";
import { HoleContext } from "../../contexts/HoleContext";
import ChatBubble from "../UI/ChatBubble";
import CategoryButtons from "../UI/CategoryButtons";
import "./ChatConversation.css";
import { formatResult } from "../../helpers/fmh";

export default function ChatConversation({ messagesEndRef }) {
  const { messages, loading } = useContext(HoleContext);

  return (
  <div className="chat-conversation">
    <div className="chat-body">
      <ChatBubble role="assistant">
        {`¡Hola! Empecemos a investigar. Elegí una categoría para empezar:`}
        <CategoryButtons />
      </ChatBubble>

      {messages.map((m, i) => (
        <ChatBubble key={i} role={m.role}>
          {formatResult(m.content)}
        </ChatBubble>
      ))}

      {messages.length > 0 && loading && (
        <ChatBubble role="assistant">
          <span className="utility-text">Generando respuesta...</span>
        </ChatBubble>
      )}

      <div ref={messagesEndRef} />
    </div>
  </div>
  );
}
