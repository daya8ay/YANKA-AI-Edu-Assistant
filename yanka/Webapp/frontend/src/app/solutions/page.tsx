"use client";

import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./page.module.css";
import Image from "next/image";

const translations = {
  en: {
    heroTitle: "Who Yanka AI Serves",
    heroSub:
      "An AI-Powered Ecosystem for Learning, Research, and Academic Growth",

    studentsTitle: "Students",
    studentsText1:
      "Yanka AI empowers students with intelligent study tools designed for modern academic success. From an AI-powered tutor that explains complex concepts instantly, to assignment assistance and research guidance, students receive 24/7 personalized support.",
    studentsText2:
      "Smart planners help manage deadlines, track progress, and improve productivity, while adaptive learning systems tailor content based on individual performance.",

    researchersTitle: "Researchers",
    researchersText1:
      "Yanka AI accelerates academic research with advanced thesis-building tools, literature review automation, and AI-driven writing enhancement. Researchers can organize citations, structure arguments, and refine manuscripts effortlessly.",
    researchersText2:
      "Built-in plagiarism detection and research validation tools ensure originality, accuracy, and compliance with global academic standards.",

    teachersTitle: "Teachers & Institutions",
    teachersText1:
      "Yanka AI enables educators to design interactive courses, generate lesson plans instantly, and personalize classroom content using AI. Integrated dashboards provide real-time student analytics and engagement insights.",
    teachersText2:
      "Seamless LMS integration ensures smooth adoption across schools, helping institutions modernize without disrupting existing systems.",

    creatorsTitle: "Course Creators",
    creatorsText1:
      "Yanka AI allows creators to build and monetize AI-powered courses globally. With avatar-based video generation and automated translation, courses can reach multilingual audiences instantly.",
    creatorsText2:
      "Built-in analytics, monetization tools, and distribution channels help creators scale their educational businesses worldwide.",

    universitiesTitle: "Universities",
    universitiesText1:
      "Universities can integrate Yanka AI’s full research and learning suite into their ecosystem. From enterprise-level AI deployment to research-grade analytics, institutions gain scalable and secure infrastructure.",
    universitiesText2:
      "White-label capabilities, compliance-ready architecture, and centralized dashboards empower universities to deliver AI-enhanced education at scale.",

    integrationTitle: "Institutional Integration",
    integrationSubtitle: "Enterprise-Grade Integration",
    integrationText:
      "Custom dashboards, secure data compliance (FERPA & GDPR), performance tracking, and white-label AI deployment for universities and institutions.",
  },

  fr: {
    heroTitle: "À qui s’adresse Yanka AI",
    heroSub:
      "Un écosystème alimenté par l’IA pour l’apprentissage, la recherche et la réussite académique",

    studentsTitle: "Étudiants",
    studentsText1:
      "Yanka AI offre aux étudiants des outils intelligents conçus pour la réussite académique moderne. Du tuteur IA expliquant instantanément les concepts complexes à l’assistance aux devoirs et à la recherche, les étudiants bénéficient d’un accompagnement personnalisé 24h/24.",
    studentsText2:
      "Les planificateurs intelligents aident à gérer les échéances, suivre les progrès et améliorer la productivité, tandis que les systèmes d’apprentissage adaptatif personnalisent le contenu selon les performances.",

    researchersTitle: "Chercheurs",
    researchersText1:
      "Yanka AI accélère la recherche académique grâce à des outils avancés de création de thèse, d’automatisation de revue de littérature et d’amélioration rédactionnelle par IA.",
    researchersText2:
      "Les outils intégrés de détection de plagiat et de validation garantissent l’originalité et la conformité aux standards académiques mondiaux.",

    teachersTitle: "Enseignants et institutions",
    teachersText1:
      "Yanka AI permet aux enseignants de créer des cours interactifs, générer des plans de leçon instantanément et personnaliser le contenu pédagogique grâce à l’IA.",
    teachersText2:
      "L’intégration LMS garantit une adoption fluide sans perturber les systèmes existants.",

    creatorsTitle: "Créateurs de cours",
    creatorsText1:
      "Yanka AI permet de créer et monétiser des cours IA à l’échelle mondiale. Grâce aux avatars et à la traduction automatique, les contenus atteignent instantanément un public multilingue.",
    creatorsText2:
      "Les outils d’analyse et de distribution permettent de développer une activité éducative à grande échelle.",

    universitiesTitle: "Universités",
    universitiesText1:
      "Les universités peuvent intégrer la suite complète de Yanka AI dans leur écosystème académique avec des solutions évolutives et sécurisées.",
    universitiesText2:
      "Les tableaux de bord centralisés et les architectures conformes permettent de déployer l’éducation IA à grande échelle.",

    integrationTitle: "Intégration institutionnelle",
    integrationSubtitle: "Intégration niveau entreprise",
    integrationText:
      "Tableaux de bord personnalisés, conformité des données, suivi des performances et déploiement IA en marque blanche.",
  },
};

export default function SolutionsPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <>
      <NavBar />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1>{t.heroTitle}</h1>
          <p className={styles.heroSubtitle}>{t.heroSub}</p>
        </div>
        <div className={styles.heroDivider}></div>
      </section>

      {/* STUDENTS */}
      <section id="students" className={styles.solutionSection}>
        <div className={styles.imageLeft}>
          <Image src="/pics/students.jpeg" alt="Students" width={600} height={400} />
        </div>
        <div className={styles.contentRight}>
          <h2>{t.studentsTitle}</h2>
          <p>{t.studentsText1}</p>
          <p>{t.studentsText2}</p>
        </div>
      </section>

      {/* RESEARCHERS */}
      <section id="researchers" className={styles.solutionSectionReverse}>
        <div className={styles.contentLeft}>
          <h2>{t.researchersTitle}</h2>
          <p>{t.researchersText1}</p>
          <p>{t.researchersText2}</p>
        </div>
        <div className={styles.imageRight}>
          <img src="/pics/researcher.jpeg" alt="Researchers" />
        </div>
      </section>

      {/* TEACHERS */}
      <section id="teachers" className={styles.solutionSection}>
        <div className={styles.imageLeft}>
          <img src="/pics/teachers.jpeg" alt="Teachers" />
        </div>
        <div className={styles.contentRight}>
          <h2>{t.teachersTitle}</h2>
          <p>{t.teachersText1}</p>
          <p>{t.teachersText2}</p>
        </div>
      </section>

      {/* CREATORS */}
      <section id="creators" className={styles.solutionSectionReverse}>
        <div className={styles.contentLeft}>
          <h2>{t.creatorsTitle}</h2>
          <p>{t.creatorsText1}</p>
          <p>{t.creatorsText2}</p>
        </div>
        <div className={styles.imageRight}>
          <img src="/pics/creators.jpeg" alt="Creators" />
        </div>
      </section>

      {/* UNIVERSITIES */}
      <section id="universities" className={styles.solutionSection}>
        <div className={styles.imageLeft}>
          <img src="/pics/universities.jpeg" alt="Universities" />
        </div>
        <div className={styles.contentRight}>
          <h2>{t.universitiesTitle}</h2>
          <p>{t.universitiesText1}</p>
          <p>{t.universitiesText2}</p>
        </div>
      </section>

      {/* INTEGRATION */}
      <section className={styles.videoStripSection}>
        <h2>{t.integrationTitle}</h2>

        <div className={styles.videoStrip}>
          <video src="/video/home.mp4" autoPlay muted loop />
          <div className={styles.videoOverlay}>
            <h3>{t.integrationSubtitle}</h3>
            <p>{t.integrationText}</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}