"use client";

import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./page.module.css";
import Image from "next/image";

const translations = {
  en: {
    heroTitle: "Yanka – AI-Powered Educational Assistant",
    heroSub:
      "An intelligent ecosystem for learning, research, content creation, and academic growth.",

    videoTitle: "AI Video Generation",
    videoText:
      "Instantly transform academic content into professional, high-quality educational videos. Convert notes, lectures, research papers, and presentations into structured visual explainers ready for global audiences.",

    avatarTitle: "Real-Time AI Avatar Creation",
    avatarText:
      "Design multilingual AI avatars for teaching, research defense, training sessions, and professional communication. Customize voice, language, appearance, and delivery style instantly.",

    trainingTitle: "AI-Designed Training Programs & Workshops",
    trainingText:
      "Build structured academic training programs, workshops, and institutional learning tracks powered by AI. Automatically generate curriculum outlines, lesson plans, assessments, and multilingual delivery modules.",

    academicTitle: "Advanced Academic Capabilities",

    coursesTitle: "Wide Range of Courses",
    coursesText:
      "Explore and create AI-powered courses across disciplines. Instantly translated into 100+ languages.",

    dataTitle: "AI Data Analysis & Visualization",
    dataText:
      "Perform quantitative and qualitative analysis with integrated AI tools and generate professional charts, dashboards, and exportable reports.",

    thesisTitle: "Thesis & Dissertation Builder",
    thesisText:
      "Structured academic frameworks for research design, literature review, citation management, and academic integrity validation.",
  },

  fr: {
    heroTitle: "Yanka – Assistant éducatif alimenté par l’IA",
    heroSub:
      "Un écosystème intelligent pour l’apprentissage, la recherche, la création de contenu et le développement académique.",

    videoTitle: "Génération vidéo par IA",
    videoText:
      "Transformez instantanément le contenu académique en vidéos éducatives professionnelles de haute qualité. Convertissez notes, cours, recherches et présentations en explications visuelles structurées prêtes pour un public mondial.",

    avatarTitle: "Création d’avatars IA en temps réel",
    avatarText:
      "Concevez des avatars IA multilingues pour l’enseignement, les soutenances de recherche, les formations et la communication professionnelle. Personnalisez la voix, la langue, l’apparence et le style instantanément.",

    trainingTitle: "Programmes de formation et ateliers conçus par IA",
    trainingText:
      "Créez des programmes académiques structurés, des ateliers et des parcours institutionnels alimentés par l’IA. Générez automatiquement des plans de cours, évaluations et modules multilingues.",

    academicTitle: "Capacités académiques avancées",

    coursesTitle: "Large gamme de cours",
    coursesText:
      "Explorez et créez des cours alimentés par l’IA dans plusieurs disciplines, traduits instantanément en plus de 100 langues.",

    dataTitle: "Analyse et visualisation de données IA",
    dataText:
      "Réalisez des analyses quantitatives et qualitatives avec des outils IA intégrés et générez des graphiques, tableaux de bord et rapports professionnels.",

    thesisTitle: "Créateur de thèse et dissertation",
    thesisText:
      "Cadres académiques structurés pour la conception de recherche, la revue de littérature, la gestion des citations et la validation de l’intégrité académique.",
  },
};

export default function FeaturesPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <>
      <NavBar />

      {/* HERO */}
      <section className={styles.hero}>
        <h1>{t.heroTitle}</h1>
        <p>{t.heroSub}</p>
      </section>

      {/* AI VIDEO */}
      <section id="video" className={styles.splitSection}>
        <div className={styles.mediaLeft}>
          <video src="/video/ai-video.mp4" autoPlay muted loop playsInline className={styles.video} />
        </div>
        <div className={styles.textRight}>
          <h2>{t.videoTitle}</h2>
          <p>{t.videoText}</p>
        </div>
      </section>

      {/* AVATAR */}
      <section id="avatar" className={`${styles.splitSection} ${styles.reverse}`}>
        <div className={styles.mediaLeft}>
          <video src="/video/avatar.mp4" autoPlay muted loop playsInline className={styles.video} />
        </div>
        <div className={styles.textRight}>
          <h2>{t.avatarTitle}</h2>
          <p>{t.avatarText}</p>
        </div>
      </section>

      {/* TRAINING */}
      <section id="training" className={styles.splitSection}>
        <div className={styles.mediaLeft}>
          <video src="/video/training.mp4" autoPlay muted loop playsInline className={styles.video} />
        </div>
        <div className={styles.textRight}>
          <h2>{t.trainingTitle}</h2>
          <p>{t.trainingText}</p>
        </div>
      </section>

      {/* CARDS */}
      <section id="courses" className={styles.cardSection}>
        <h2>{t.academicTitle}</h2>

        <div className={styles.cardGrid}>
          <div className={styles.hoverCard}>
            <div className={styles.cardImageWrapper}>
              <Image src="/pics/courses.jpeg" alt="Courses" fill className={styles.cardImage} />
              <div className={styles.overlay}>
                <h3>{t.coursesTitle}</h3>
                <p>{t.coursesText}</p>
              </div>
            </div>
          </div>

          <div id="data" className={styles.hoverCard}>
            <div className={styles.cardImageWrapper}>
              <Image src="/pics/data(1).jpeg" alt="Data" fill className={styles.cardImage} />
              <div className={styles.overlay}>
                <h3>{t.dataTitle}</h3>
                <p>{t.dataText}</p>
              </div>
            </div>
          </div>

          <div id="thesis" className={styles.hoverCard}>
            <div className={styles.cardImageWrapper}>
              <Image src="/pics/thesis.jpeg" alt="Thesis" fill className={styles.cardImage} />
              <div className={styles.overlay}>
                <h3>{t.thesisTitle}</h3>
                <p>{t.thesisText}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}