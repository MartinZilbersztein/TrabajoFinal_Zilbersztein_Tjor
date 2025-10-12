import { useContext } from "react";
import { HoleContext } from "../../contexts/HoleContext";
import ChatBubble from "../UI/ChatBubble";
import CategoryButtons from "../UI/CategoryButtons";
import MarkdownWithWikilinks from "../UI/MarkdownWithWikilinks/MarkdownWithWikilinks";
import "./ChatConversation.css";

export default function ChatConversation({ messagesEndRef }) {
  const { messages, loading } = useContext(HoleContext);

  function resolveLink(ref) {
    const existing = new Set(["Home", "Project/Plan"]);
    const to = /^https?:\/\//.test(ref) ? ref : `/notes/${encodeURIComponent(ref)}`;
    const status = existing.has(ref) ? "ok" : "missing";
    return {to, status};
  }

  return (
  <div className="chat-conversation">
    <div className="chat-body">
      <ChatBubble role="assistant">
        {`¡Hola! Empecemos a investigar. Elegí una categoría para empezar:`}
        <CategoryButtons />
      </ChatBubble>

      {messages.map((m, i) => (
        <ChatBubble key={i} role={m.role}>
          {/* formatResult(m.content) */}
          <MarkdownWithWikilinks source={m.content} resolveLink={resolveLink} onNavigate={(to)=>console.log("nav",to)} />
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
