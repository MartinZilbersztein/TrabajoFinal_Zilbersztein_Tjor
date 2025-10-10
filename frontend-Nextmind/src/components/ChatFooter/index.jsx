import { useContext } from "react";
import { FiSend } from "react-icons/fi";
import { HoleContext } from "../../contexts/HoleContext";
import "./ChatFooter.css";

export default function ChatFooter() {
  const { setMessages, input, setInput, loading, setLoading } = useContext(HoleContext);

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
          body: JSON.stringify({ message: userMessage.text, categoryId: 1 }),
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


   const handleKeyPress = (e) => {
     if (e.key === "Enter" && !e.shiftKey) {
       e.preventDefault();
       sendMessage();
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
                onClick={sendMessage}
                disabled={loading} // Igual aquí
                className={`chat-send ${loading ? "loading" : ""}`}
            >
                <FiSend size={22} />
            </button>
        </div>
    );
}
