'use client';
import React, { useState } from 'react';
import styles from './support.module.css';
import Link from 'next/link';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const SupportContent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hi! How can I help you?', sender: 'bot' },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');
  };

  return (
    <>
      <main className={styles.main}>
        <h2 className={styles.leftText}>How can we help?</h2>
        <input
          type="text"
          placeholder="Search how-tos and more"
          className={styles.searchBox}
        />
      </main>

      <div className={styles.suggestions}>
        <h3>New to Yanka?</h3>
      </div>

      <div className={styles.imageRow}>
        <div className={styles.imageItem}>
          <Link href="/#pricing">
            <img src="/pics/support-img1.jpg" alt="Image 1" />
          </Link>
          <p>Getting started with Yanka</p>
        </div>
        <div className={styles.imageItem}>
          <img src="/pics/support-img3.jpg" alt="Image 2" />
          <p>Video Tutorials</p>
        </div>
        <div className={styles.imageItem}>
          <img src="/pics/support-img2.webp" alt="Image 3" />
          <p>Navigating the Yanka interface</p>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button
        className={styles.chatButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className={styles.chatBox}>
          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={
                  msg.sender === 'bot'
                    ? styles.botMessage
                    : styles.userMessage
                }
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default SupportContent;
