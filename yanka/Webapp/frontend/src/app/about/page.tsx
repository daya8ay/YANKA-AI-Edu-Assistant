"use client";

import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./page.module.css";

const translations = {
  en: {
    heroTitle: "About",
    heroHighlight: "Yanka AI",
    heroTagline: "AI-Powered Multilingual Learning, Training & Creator Ecosystem",
    heroMotto: "“Learn. Create. Research. Grow.”",
    heroSub: "Your AI Academic Partner for Life.",

    introTitle: "Empowering the Future of Learning Through AI",
    introText1:
      "Yanka AI is an all-in-one intelligent platform designed to revolutionize how the world learns, teaches, researches, and creates. Built with cutting-edge AI, Yanka AI combines voice-enabled tutoring, AI avatar video creation, academic research tools, professional training development, and a fully integrated knowledge marketplace.",
    introText2:
      "Yanka AI is more than an app — it is a 21st-century global learning ecosystem empowering students, researchers, educators, professionals, institutions, NGOs, governments, and lifelong learners worldwide.",

    promiseTitle: "Our Promise",
    promiseCards: [
      {
        title: "Quality",
        text: "Accurate, verified, and curriculum-aligned educational content.",
      },
      {
        title: "Integrity",
        text: "Privacy protection, ethical AI use, and academic honesty.",
      },
      {
        title: "Inclusion",
        text: "Supporting every learner, in every language and discipline.",
      },
      {
        title: "Innovation",
        text: "Continuously evolving AI designed around real human needs.",
      },
    ],

    missionTitle: "✨ Our Mission",
    missionText1:
      "To democratize high-quality education and training for every person on Earth, in every language, by combining human-centered pedagogy with advanced AI.",
    missionText2:
      "We transform knowledge into interactive, multilingual learning experiences powered by AI avatars, natural-language tutoring, and intelligent personalization.",

    visionTitle: "🚀 Our Vision",
    visionText1:
      "A world where anyone, regardless of age, location, or background, can learn, create, teach, and earn through a unified AI platform that adapts to each learner’s goals, culture, and language.",
    visionText2:
      "With the Training & Course Builder, Yanka AI evolves into a complete AI-powered education & training marketplace.",

    existTitle: "Why We Exist",
    existText1:
      "Education is evolving, yet access and personalization remain global challenges. Yanka AI bridges that gap — giving every learner the tools to think critically, learn independently, and create globally.",
    existText2:
      "Whether you’re writing your first essay or defending your PhD, Yanka AI is with you — every step of the way.",

    missionAlt: "YANKA Mission",
    visionAlt: "YANKA Vision",
  },

  fr: {
    heroTitle: "À propos de",
    heroHighlight: "Yanka AI",
    heroTagline: "Écosystème d’apprentissage, de formation et de création multilingue alimenté par l’IA",
    heroMotto: "« Apprendre. Créer. Rechercher. Grandir. »",
    heroSub: "Votre partenaire académique IA pour la vie.",

    introTitle: "Façonner l’avenir de l’apprentissage grâce à l’IA",
    introText1:
      "Yanka AI est une plateforme intelligente tout-en-un conçue pour révolutionner la manière dont le monde apprend, enseigne, recherche et crée. Construite avec une IA de pointe, Yanka AI combine tutorat vocal, création de vidéos avec avatars IA, outils de recherche académique, développement de formations professionnelles et marketplace de connaissances entièrement intégrée.",
    introText2:
      "Yanka AI est plus qu’une application — c’est un écosystème mondial d’apprentissage du XXIe siècle qui soutient les étudiants, chercheurs, éducateurs, professionnels, institutions, ONG, gouvernements et apprenants tout au long de la vie dans le monde entier.",

    promiseTitle: "Notre promesse",
    promiseCards: [
      {
        title: "Qualité",
        text: "Un contenu éducatif précis, vérifié et aligné sur les programmes.",
      },
      {
        title: "Intégrité",
        text: "Protection de la vie privée, usage éthique de l’IA et honnêteté académique.",
      },
      {
        title: "Inclusion",
        text: "Soutenir chaque apprenant, dans chaque langue et discipline.",
      },
      {
        title: "Innovation",
        text: "Une IA en constante évolution, conçue autour des besoins humains réels.",
      },
    ],

    missionTitle: "✨ Notre mission",
    missionText1:
      "Démocratiser une éducation et une formation de haute qualité pour chaque personne sur Terre, dans chaque langue, en associant une pédagogie centrée sur l’humain à une IA avancée.",
    missionText2:
      "Nous transformons le savoir en expériences d’apprentissage interactives et multilingues, alimentées par des avatars IA, du tutorat en langage naturel et une personnalisation intelligente.",

    visionTitle: "🚀 Notre vision",
    visionText1:
      "Un monde où chacun, quel que soit son âge, son lieu de vie ou son parcours, peut apprendre, créer, enseigner et gagner sa vie grâce à une plateforme IA unifiée qui s’adapte aux objectifs, à la culture et à la langue de chaque apprenant.",
    visionText2:
      "Avec le générateur de formations et de cours, Yanka AI évolue en une marketplace complète d’éducation et de formation alimentée par l’IA.",

    existTitle: "Pourquoi nous existons",
    existText1:
      "L’éducation évolue, mais l’accès et la personnalisation restent des défis mondiaux. Yanka AI comble cet écart — en donnant à chaque apprenant les outils pour penser de manière critique, apprendre de façon autonome et créer à l’échelle mondiale.",
    existText2:
      "Que vous rédigiez votre première dissertation ou prépariez la soutenance de votre doctorat, Yanka AI vous accompagne à chaque étape.",

    missionAlt: "Mission de YANKA",
    visionAlt: "Vision de YANKA",
  },
};

export default function About() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <>
      <NavBar />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            {t.heroTitle} <span>{t.heroHighlight}</span>
          </h1>

          <p className={styles.heroTagline}>{t.heroTagline}</p>

          <p className={styles.heroMotto}>{t.heroMotto}</p>

          <p className={styles.heroSub}>{t.heroSub}</p>
        </div>
      </section>

      {/* INTRO */}
      <section className={styles.introSection}>
        <h2>{t.introTitle}</h2>
        <p>{t.introText1}</p>
        <p>{t.introText2}</p>
      </section>

      {/* PROMISE */}
      <section id="promise" className={styles.promiseSection}>
        <h2>{t.promiseTitle}</h2>

        <div className={styles.promiseGrid}>
          {t.promiseCards.map((card, index) => (
            <div key={index} className={styles.flipCard}>
              <div className={styles.flipCardInner}>
                <div className={styles.flipCardFront}>
                  <h3>{card.title}</h3>
                </div>
                <div className={styles.flipCardBack}>
                  <p>{card.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section id="mission" className={styles.splitSection}>
        <div className={styles.mediaSide}>
          <img
            src="/pics/about-mission.jpg"
            alt={t.missionAlt}
            className={styles.media}
          />
        </div>

        <div className={styles.textSide}>
          <h2>{t.missionTitle}</h2>
          <p>{t.missionText1}</p>
          <p>{t.missionText2}</p>
        </div>
      </section>

      {/* VISION */}
      <section id="vision" className={`${styles.splitSection} ${styles.reverse}`}>
        <div className={styles.mediaSide}>
          <img
            src="/pics/about-vision.jpg"
            alt={t.visionAlt}
            className={styles.media}
          />
        </div>

        <div className={styles.textSide}>
          <h2>{t.visionTitle}</h2>
          <p>{t.visionText1}</p>
          <p>{t.visionText2}</p>
        </div>
      </section>

      {/* WHY WE EXIST */}
      <section className={styles.existSection}>
        <div className={styles.contentWrapper}>
          <h2>{t.existTitle}</h2>
          <p>{t.existText1}</p>
          <p>{t.existText2}</p>
        </div>
      </section>

      <Footer />
    </>
  );
}