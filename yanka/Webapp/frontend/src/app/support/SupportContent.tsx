'use client';
import React, { useState } from 'react';
import styles from './support.module.css';
import Link from 'next/link';
import { fetchAuthSession } from 'aws-amplify/auth';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const SupportContent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hello! My name is YANKA. How can I help you today?', sender: 'bot' },
  ]);

const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = { text: input, sender: "user" as const };
  setMessages((prev) => [...prev, userMessage]);
  setInput("");

  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { text: data.response, sender: "bot" }]);
  } catch (error) {
    setMessages((prev) => [...prev, { text: "Sorry, something went wrong.", sender: "bot" }]);
  }
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
        <h3>New?</h3>
      </div>

      <div className={styles.imageRow}>
        <div className={styles.imageItem}>
          <Link href="/#pricing">
            <img src="/pics/support-img1.jpg" alt="Image 1" />
          </Link>
          <p>Getting started</p>
        </div>
        <div className={styles.imageItem}>
          <img src="/pics/support-img3.jpg" alt="Image 2" />
          <p>Video Tutorials</p>
        </div>
        <div className={styles.imageItem}>
          <img src="/pics/support-img2.webp" alt="Image 3" />
          <p>Navigating the interface</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className={styles.faqSection}>
        <h3 className={styles.faqTitle}>Frequently Asked Questions</h3>
        <div className={styles.faqCarousel}>
          {/* <button className={styles.arrowBtn} onClick={() => {
            const el = document.getElementById('faqTrack');
            if (el) el.scrollBy({ left: -320, behavior: 'smooth' });
          }}>&#8592;</button> */}

          <div className={styles.faqTrack} id="faqTrack">
            <div className={styles.faqBox}>
              <span></span>
              <div className={styles.faqContent}>
                <h2>What is YANKA?</h2>
                <p>YANKA is an AI-powered, multilingual learning, training, and creator
                  ecosystem designed to help people learn, teach, create content, and
                  monetize knowledge. It combines AI tutoring, academic research tools,
                  AI avatars, voice and video generation, course creation, and a global
                  marketplace in one platform.
                </p>
              </div>
            </div>

            <div className={styles.faqBox}>
              <span></span>
              <div className={styles.faqContent}>
                <h2>Do I need to create an account to use YANKA?</h2>
                <p>
                  You can explore the Marketplace and public content without an account.
                  To learn, create content, publish courses, or earn money, you must sign up or sign in
                </p>
              </div>
            </div>

            <div className={styles.faqBox}>
              <span></span>
              <div className={styles.faqContent}>
                <h2>How do I get started?</h2>
                <p>
                  YANKA is built for:<br />
                  - Students (secondary school to university)<br />
                  - Researchers & academics <br />
                  - Teachers & educational institutions <br />
                  - Professionals & companies <br />
                  - Content creators & trainers <br />
                  - NGOs & governments<br />
                  - Lifelong learners worldwide<br />
                </p>
              </div>
            </div>
          </div>

          <div className={styles.arrowBtnWrapper}>
            <Link href="/faq" className={styles.arrowBtn}>&#8594;</Link>
            <span className={styles.viewMore}>View More</span>
          </div>
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
                <img
                  src={msg.sender === 'bot' ? 'pics/chat_bot.png' : 'pics/guest_user.png'}
                  alt={msg.sender === 'bot' ? 'YANKA' : 'Guest'}
                  className={styles.avatar}
                />
                <div className={styles.messageContent}>
                  <span className={styles.senderName}>
                    {msg.sender === 'bot' ? 'YANKA' : 'Guest'}
                  </span>
                  <p>{msg.text}</p>
                </div>
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
