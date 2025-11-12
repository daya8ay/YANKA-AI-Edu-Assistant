"use client";
import React, { useState } from "react";
import styles from "./avatar.module.css";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const AvatarChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I’m your Avatar Creation Assistant. Ask me about customizing your avatar!", sender: "bot" },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { text: input, sender: "user" as const };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTimeout(() => {
      const botResponse = {
        text: "AI avatar creation responses are coming next.",
        sender: "bot" as const,
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 800);
  };

  return (
    <>
      <button className={styles.chatButton} onClick={() => setIsOpen(!isOpen)}>💬</button>
      {isOpen && (
        <div className={styles.chatBox}>
          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} className={msg.sender === "bot" ? styles.botMessage : styles.userMessage}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about customizing your avatar..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AvatarChat;
