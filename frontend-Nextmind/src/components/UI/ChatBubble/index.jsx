import { motion } from "motion/react";
import "./ChatBubble.css";

export default function ChatBubble({ role, children }) {
    return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`chat-bubble ${role}`}
        >
          {children}
        </motion.div>
    );
}
