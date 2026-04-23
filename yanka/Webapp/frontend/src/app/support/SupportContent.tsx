"use client";

import React, { useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import styles from "./support.module.css";
import Link from "next/link";
import { faqs } from "../faq/faqData";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const translations = {
  en: {
    welcomeMessage: "Hello! My name is Yanka AI. How can I help you today?",
    loginMessage: "Please login to use the chatbot functionality.",
    heading: "How can we help?",
    searchPlaceholder: "Search how-tos and more",
    noResults: "No results found for",
    gettingStarted: "Getting started",
    mission: "Our Mission",
    capabilities: "Capabilities",
    faqTitle: "Frequently Asked Questions",
    viewMore: "View More",
    faq1Title: "What is Yanka AI?",
    faq1Text:
      "Yanka is an AI-powered, multilingual learning, training, and creator ecosystem designed to help people learn, teach, create content, and monetize knowledge. It combines AI tutoring, academic research tools, AI avatars, voice and video generation, course creation, and a global marketplace in one platform.",
    faq2Title: "Do I need to create an account to use Yanka AI?",
    faq2Text:
      "You can explore the Marketplace and public content without an account. To learn, create content, publish courses, or earn money, you must sign up or sign in",
    faq3Intro: "Yanka AI is built for:",
    faq3Items: [
      "Students (secondary school to university)",
      "Researchers & academics",
      "Teachers & educational institutions",
      "Professionals & companies",
      "Content creators & trainers",
      "NGOs & governments",
      "Lifelong learners worldwide",
    ],
    guest: "Guest",
    botName: "Yanka AI",
    typeMessage: "Type a message...",
    send: "Send",
  },
  fr: {
    welcomeMessage: "Bonjour ! Je m’appelle Yanka AI. Comment puis-je vous aider aujourd’hui ?",
    loginMessage: "Veuillez vous connecter pour utiliser la fonctionnalité de chatbot.",
    heading: "Comment pouvons-nous vous aider ?",
    searchPlaceholder: "Rechercher des guides et plus",
    noResults: "Aucun résultat trouvé pour",
    gettingStarted: "Bien démarrer",
    mission: "Notre mission",
    capabilities: "Capacités",
    faqTitle: "Questions fréquentes",
    viewMore: "Voir plus",
    faq1Title: "Qu’est-ce que Yanka AI ?",
    faq1Text:
      "Yanka est un écosystème multilingue d’apprentissage, de formation et de création alimenté par l’IA, conçu pour aider les personnes à apprendre, enseigner, créer du contenu et monétiser leurs connaissances. Il combine tutorat IA, outils de recherche académique, avatars IA, génération vocale et vidéo, création de cours et marketplace mondiale sur une seule plateforme.",
    faq2Title: "Dois-je créer un compte pour utiliser Yanka AI ?",
    faq2Text:
      "Vous pouvez explorer la marketplace et le contenu public sans compte. Pour apprendre, créer du contenu, publier des cours ou gagner de l’argent, vous devez vous inscrire ou vous connecter.",
    faq3Intro: "Yanka AI est conçu pour :",
    faq3Items: [
      "Les étudiants (du secondaire à l’université)",
      "Les chercheurs et universitaires",
      "Les enseignants et établissements éducatifs",
      "Les professionnels et entreprises",
      "Les créateurs de contenu et formateurs",
      "Les ONG et gouvernements",
      "Les apprenants tout au long de la vie dans le monde entier",
    ],
    guest: "Invité",
    botName: "Yanka AI",
    typeMessage: "Écrivez un message...",
    send: "Envoyer",
  },
};

const SupportContent: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      text: t.welcomeMessage,
      sender: "bot",
    },
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" as const };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: input }),
      });

      if (res.status === 401) {
        setMessages((prev) => [
          ...prev,
          {
            text: t.loginMessage,
            sender: "bot",
          },
        ]);
        return;
      }

      const data = await res.json();

      setMessages((prev) => [...prev, { text: data.response, sender: "bot" }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: t.loginMessage,
          sender: "bot",
        },
      ]);
    }
  };

  const getSectionId = (faqIndex: number): string => {
    if (faqIndex < 5) return "section1";
    if (faqIndex < 8) return "section2";
    if (faqIndex < 10) return "section3";
    if (faqIndex < 12) return "section4";
    if (faqIndex < 15) return "section5";
    if (faqIndex < 17) return "section6";
    if (faqIndex < 20) return "section7";
    if (faqIndex < 22) return "section8";
    if (faqIndex < 24) return "section9";
    return "section10";
  };

  return (
    <>
      <main className={styles.main}>
        <h2 className={styles.leftText}>{t.heading}</h2>
        <div style={{ position: "relative", width: "1000px" }}>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className={styles.searchBox}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery.trim() &&
            (() => {
              const q = searchQuery.toLowerCase();

              const results = faqs
                .map((faq, i) => ({ faq, i }))
                .filter(
                  ({ faq }) =>
                    faq.question.toLowerCase().includes(q) ||
                    faq.answer.toLowerCase().includes(q)
                );

              return (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "white",
                    border: "1px solid #ddd",
                    borderRadius: "0 0 8px 8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    zIndex: 999,
                    maxHeight: "320px",
                    overflowY: "auto",
                  }}
                >
                  {results.length === 0 ? (
                    <div
                      style={{
                        padding: "14px 16px",
                        color: "#888",
                        fontSize: "14px",
                      }}
                    >
                      {t.noResults} &quot;{searchQuery}&quot;
                    </div>
                  ) : (
                    results.map(({ faq, i }) => (
                      <Link
                        key={i}
                        href={`/faq?open=${i}#${getSectionId(i)}`}
                        onClick={() => setSearchQuery("")}
                        style={{
                          display: "block",
                          padding: "12px 16px",
                          borderBottom: "1px solid #f0f0f0",
                          color: "#002b6d",
                          textDecoration: "none",
                          fontSize: "14px",
                          fontWeight: 500,
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#f5f8ff")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "white")
                        }
                      >
                        {faq.question}
                      </Link>
                    ))
                  )}
                </div>
              );
            })()}
        </div>
      </main>

      <div className={styles.imageRow}>
        <div className={styles.imageItem}>
          <Link href="/#marketplace">
            <Image src="/pics/support-img1.jpg" alt="Image 1" width={400} height={250} />
          </Link>
          <p>{t.gettingStarted}</p>
        </div>
        <div className={styles.imageItem}>
          <Link href="/about#mission">
            <Image src="/pics/support-img3.jpg" alt="Image 2" width={400} height={250} />
          </Link>
          <p>{t.mission}</p>
        </div>
        <div className={styles.imageItem}>
          <Link href="/#features">
            <Image src="/pics/support-img2.webp" alt="Image 3" width={400} height={250} />
          </Link>
          <p>{t.capabilities}</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className={styles.faqSection}>
        <h3 className={styles.faqTitle}>{t.faqTitle}</h3>
        <div className={styles.faqCarousel}>
          <div className={styles.faqTrack} id="faqTrack">
            <div className={styles.faqBox}>
              <span></span>
              <div className={styles.faqContent}>
                <h2>{t.faq1Title}</h2>
                <p>{t.faq1Text}</p>
              </div>
            </div>

            <div className={styles.faqBox}>
              <span></span>
              <div className={styles.faqContent}>
                <h2>{t.faq2Title}</h2>
                <p>{t.faq2Text}</p>
              </div>
            </div>

            <div className={styles.faqBox}>
              <span></span>
              <div className={styles.faqContent}>
                <p>{t.faq3Intro}</p>
                <ul className={styles.faqList}>
                  {t.faq3Items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.arrowBtnWrapper}>
            <Link href="/faq" className={styles.arrowBtn}>
              &#8594;
            </Link>
            <span className={styles.viewMore}>{t.viewMore}</span>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button className={styles.chatButton} onClick={() => setIsOpen(!isOpen)}>
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
                  msg.sender === "bot" ? styles.botMessage : styles.userMessage
                }
              >
                <img
                  src={
                    msg.sender === "bot"
                      ? "pics/chat_bot.png"
                      : "pics/guest_user.png"
                  }
                  alt={msg.sender === "bot" ? t.botName : t.guest}
                  className={styles.avatar}
                />
                <div
                  className={
                    msg.sender === "bot"
                      ? styles.messageContent
                      : styles.userMessageContent
                  }
                >
                  <span className={styles.senderName}>
                    {msg.sender === "bot" ? t.botName : t.guest}
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
              placeholder={t.typeMessage}
            />
            <button onClick={handleSend}>{t.send}</button>
          </div>
        </div>
      )}
    </>
  );
};

export default SupportContent;