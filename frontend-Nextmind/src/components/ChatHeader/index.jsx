import Rabbit from "../../assets/rabbit.png";
import "./ChatHeader.css";

export default function ChatHeader() {
  return (
    <header className="chat-header">
      <div className="logo">
        <img src={Rabbit} alt="RabbIA Logo" />
        <p>r&alpha;bbIA</p>
      </div>
    </header>
  );
}
