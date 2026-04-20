"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";
import DashboardNavBar from "@/components/DashboardNavBar";
import Image from "next/image";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export default function Dashboard() {
  const { authStatus, user } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();

  const translations = {
    en: {
      studentFallback: "Student",
      dashboardTitle: "Study Dashboard",
      welcomeBack: "Welcome Back,",
      welcomeText: "Let's make today a step closer to your learning goals.",
      mySubjects: "My Subjects",
      mySubjectsValue: "5 courses",
      assignments: "Assignments",
      assignmentsValue: "3 pending",
      aiTutor: "AI Tutor Chat",
      aiTutorValue: "Get instant study help and explanations.",
      lectureSummaries: "Lecture Summaries",
      lectureSummariesValue: "Auto-generated summaries for your recent lessons.",
      continueLearning: "Continue Learning",
      course1Title: "AI Research Methods",
      course1Text: "Learn to write better academic papers with AI support.",
      course2Title: "Presentation Mastery",
      course2Text: "Design impactful slides and boost your delivery confidence.",
      progress: "Progress",
      userAvatar: "User Avatar",
      aiCourse: "AI Course",
      presentationSkills: "Presentation Skills",
    },
    fr: {
      studentFallback: "Étudiant",
      dashboardTitle: "Tableau de bord d'étude",
      welcomeBack: "Bon retour,",
      welcomeText: "Faisons d’aujourd’hui une étape de plus vers vos objectifs d’apprentissage.",
      mySubjects: "Mes matières",
      mySubjectsValue: "5 cours",
      assignments: "Devoirs",
      assignmentsValue: "3 en attente",
      aiTutor: "Chat avec tuteur IA",
      aiTutorValue: "Obtenez une aide et des explications instantanées.",
      lectureSummaries: "Résumés de cours",
      lectureSummariesValue: "Résumés générés automatiquement pour vos leçons récentes.",
      continueLearning: "Continuer à apprendre",
      course1Title: "Méthodes de recherche en IA",
      course1Text: "Apprenez à rédiger de meilleurs articles académiques avec l’aide de l’IA.",
      course2Title: "Maîtrise de la présentation",
      course2Text: "Concevez des diapositives percutantes et améliorez votre aisance à l’oral.",
      progress: "Progression",
      userAvatar: "Avatar utilisateur",
      aiCourse: "Cours d’IA",
      presentationSkills: "Compétences de présentation",
    },
  };

  const t = translations[language];

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login");
    }
  }, [authStatus, router]);

  if (authStatus !== "authenticated") {
    return null;
  }

  const displayName =
    user?.signInDetails?.loginId?.split("@")[0] ?? t.studentFallback;

  return (
    <>
      <DashboardNavBar />

      <main className={styles.dashboard}>
        {/* Welcome Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.textSection}>
              <h1>{t.dashboardTitle}</h1>
              <h2>
                {t.welcomeBack} <span>{displayName} 👋</span>
              </h2>
              <p>{t.welcomeText}</p>
            </div>

            <div className={styles.avatarContainer}>
              <Image
                src="/pics/user_avatar.jpeg"
                alt={t.userAvatar}
                width={180}
                height={140}
                className={styles.avatar}
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.statsGrid}>
          <div className={styles.card}>
            <h3>{t.mySubjects}</h3>
            <p>{t.mySubjectsValue}</p>
          </div>
          <div className={styles.card}>
            <h3>{t.assignments}</h3>
            <p>{t.assignmentsValue}</p>
          </div>
          <div className={styles.card}>
            <h3>{t.aiTutor}</h3>
            <p>{t.aiTutorValue}</p>
          </div>
          <div className={styles.card}>
            <h3>{t.lectureSummaries}</h3>
            <p>{t.lectureSummariesValue}</p>
          </div>
        </section>

        {/* Recommendations Section */}
        <section className={styles.recommendations}>
          <h2>{t.continueLearning}</h2>
          <div className={styles.courses}>
            <div className={styles.courseCard}>
              <Image
                src="/pics/ai-course.jpeg"
                alt={t.aiCourse}
                width={320}
                height={160}
                className={styles.courseImage}
              />
              <h4>{t.course1Title}</h4>
              <p>{t.course1Text}</p>

              <div className={styles.progressContainer}>
                <div className={styles.progressLabel}>
                  <span>{t.progress}</span>
                  <span>68%</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: "68%" }}
                  ></div>
                </div>
              </div>
            </div>

            <div className={styles.courseCard}>
              <Image
                src="/pics/presentation-course.jpeg"
                alt={t.presentationSkills}
                width={320}
                height={160}
                className={styles.courseImage}
              />
              <h4>{t.course2Title}</h4>
              <p>{t.course2Text}</p>

              <div className={styles.progressContainer}>
                <div className={styles.progressLabel}>
                  <span>{t.progress}</span>
                  <span>42%</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: "42%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}