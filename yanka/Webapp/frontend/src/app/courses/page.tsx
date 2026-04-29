"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import DashboardNavBar from "@/components/DashboardNavBar";
import Footer from "@/components/Footer";
import styles from "./courses.module.css";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

type CourseType = "Course" | "Training";

interface CourseItem {
  title: string;
  teacher: string;
  summary: string;
  price: string;
  img: string;
  tag: string;
  rating: string;
  reviews: string;
  type: CourseType;
}

export default function Courses() {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<"All" | "Courses" | "Training">("All");
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const translations = {
    en: {
      pageTitle: "Explore Courses & Training Programs",
      pageSubtitle:
        "Discover curated AI-powered learning experiences designed to match your academic, professional, and career goals.",
      all: "All",
      courses: "Courses",
      training: "Training",
      viewDetails: "View Details",
      viewAll: "View All Learning Options →",
      ctaTitle: "Ready to Start Learning?",
      ctaText:
        "Join thousands of students advancing their education with Yanka's AI-powered platform.",
      ctaButton: "Get Started Today",
      courseTypeCourse: "Course",
      courseTypeTraining: "Training",
      previous: "‹",
      next: "›",
      coursesData: [
        {
          title: "AI for Everyone",
          teacher: "Dr. Schan Gya",
          summary:
            "A beginner-friendly introduction to artificial intelligence, machine learning, and how AI is shaping industries today.",
          price: "$30.99",
          img: "/pics/ai.jpeg",
          tag: "Bestseller",
          rating: "4.8",
          reviews: "2,145 ratings",
          type: "Course" as CourseType,
        },
        {
          title: "Beginners Spanish",
          teacher: "Prof. Rujeta Morales",
          summary:
            "Build confidence in everyday Spanish through practical vocabulary, speaking exercises, and real-world conversations.",
          price: "$20.99",
          img: "/pics/spanish.jpeg",
          tag: "Popular",
          rating: "4.6",
          reviews: "1,084 ratings",
          type: "Course" as CourseType,
        },
        {
          title: "Data Science",
          teacher: "Dr. Rolan Peters",
          summary:
            "Learn data analysis, visualization, statistics, and predictive modeling using modern tools and practical datasets.",
          price: "$30.99",
          img: "/pics/data.jpeg",
          tag: "Top Rated",
          rating: "4.7",
          reviews: "1,732 ratings",
          type: "Course" as CourseType,
        },
        {
          title: "Project Management Training",
          teacher: "Prof. Sach Mehra",
          summary:
            "Master planning, stakeholder communication, agile workflows, and execution strategies for successful projects.",
          price: "$25.99",
          img: "/pics/pm.jpeg",
          tag: "Bestseller",
          rating: "4.5",
          reviews: "963 ratings",
          type: "Training" as CourseType,
        },
        {
          title: "Digital Marketing Bootcamp",
          teacher: "Dami Cole",
          summary:
            "Understand branding, social media strategy, SEO, content planning, and campaign performance measurement.",
          price: "$35.99",
          img: "/pics/marketing.jpeg",
          tag: "Trending",
          rating: "4.7",
          reviews: "1,268 ratings",
          type: "Training" as CourseType,
        },
        {
          title: "English Literature",
          teacher: "Prof. Elena Brooks",
          summary:
            "Dive into classic and modern literary works while strengthening analysis, writing, and interpretation skills.",
          price: "$20.99",
          img: "/pics/english.jpeg",
          tag: "Recommended",
          rating: "4.4",
          reviews: "812 ratings",
          type: "Course" as CourseType,
        },
      ],
    },
    fr: {
      pageTitle: "Explorez les cours et programmes de formation",
      pageSubtitle:
        "Découvrez des expériences d’apprentissage sélectionnées et alimentées par l’IA, conçues pour correspondre à vos objectifs académiques, professionnels et de carrière.",
      all: "Tous",
      courses: "Cours",
      training: "Formation",
      viewDetails: "Voir les détails",
      viewAll: "Voir toutes les options d’apprentissage →",
      ctaTitle: "Prêt à commencer à apprendre ?",
      ctaText:
        "Rejoignez des milliers d’étudiants qui font progresser leur éducation grâce à la plateforme alimentée par l’IA de Yanka.",
      ctaButton: "Commencer aujourd’hui",
      courseTypeCourse: "Cours",
      courseTypeTraining: "Formation",
      previous: "‹",
      next: "›",
      coursesData: [
        {
          title: "L’IA pour tous",
          teacher: "Dr. Schan Gya",
          summary:
            "Une introduction accessible à l’intelligence artificielle, à l’apprentissage automatique et à la manière dont l’IA transforme les industries aujourd’hui.",
          price: "$30.99",
          img: "/pics/ai.jpeg",
          tag: "Meilleure vente",
          rating: "4.8",
          reviews: "2,145 avis",
          type: "Course" as CourseType,
        },
        {
          title: "Espagnol débutant",
          teacher: "Prof. Rujeta Morales",
          summary:
            "Prenez confiance en espagnol au quotidien grâce à un vocabulaire pratique, des exercices d’expression orale et des conversations du monde réel.",
          price: "$20.99",
          img: "/pics/spanish.jpeg",
          tag: "Populaire",
          rating: "4.6",
          reviews: "1,084 avis",
          type: "Course" as CourseType,
        },
        {
          title: "Science des données",
          teacher: "Dr. Rolan Peters",
          summary:
            "Apprenez l’analyse de données, la visualisation, les statistiques et la modélisation prédictive à l’aide d’outils modernes et de jeux de données pratiques.",
          price: "$30.99",
          img: "/pics/data.jpeg",
          tag: "Très bien noté",
          rating: "4.7",
          reviews: "1,732 avis",
          type: "Course" as CourseType,
        },
        {
          title: "Formation en gestion de projet",
          teacher: "Prof. Sach Mehra",
          summary:
            "Maîtrisez la planification, la communication avec les parties prenantes, les flux de travail agiles et les stratégies d’exécution pour des projets réussis.",
          price: "$25.99",
          img: "/pics/pm.jpeg",
          tag: "Meilleure vente",
          rating: "4.5",
          reviews: "963 avis",
          type: "Training" as CourseType,
        },
        {
          title: "Bootcamp de marketing digital",
          teacher: "Dami Cole",
          summary:
            "Comprenez l’image de marque, la stratégie des réseaux sociaux, le SEO, la planification de contenu et la mesure des performances des campagnes.",
          price: "$35.99",
          img: "/pics/marketing.jpeg",
          tag: "Tendance",
          rating: "4.7",
          reviews: "1,268 avis",
          type: "Training" as CourseType,
        },
        {
          title: "Littérature anglaise",
          teacher: "Prof. Elena Brooks",
          summary:
            "Explorez les œuvres littéraires classiques et modernes tout en renforçant vos compétences d’analyse, de rédaction et d’interprétation.",
          price: "$20.99",
          img: "/pics/english.jpeg",
          tag: "Recommandé",
          rating: "4.4",
          reviews: "812 avis",
          type: "Course" as CourseType,
        },
      ],
    },
  };

  const t = translations[language];
  const courses: CourseItem[] = t.coursesData;

  const filteredCourses =
    activeFilter === "All"
      ? courses
      : courses.filter((course) =>
          activeFilter === "Courses" ? course.type === "Course" : course.type === "Training"
        );

  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;

    carouselRef.current.scrollBy({
      left: direction === "left" ? -380 : 380,
      behavior: "smooth",
    });
  };

  return (
    <>
      <DashboardNavBar />

      <main className={styles.coursesMain}>
        <section className={styles.coursesHeader}>
          <h1>{t.pageTitle}</h1>
          <p>{t.pageSubtitle}</p>

          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterBtn} ${activeFilter === "All" ? styles.activeFilter : ""}`}
              onClick={() => setActiveFilter("All")}
            >
              {t.all}
            </button>
            <button
              className={`${styles.filterBtn} ${activeFilter === "Courses" ? styles.activeFilter : ""}`}
              onClick={() => setActiveFilter("Courses")}
            >
              {t.courses}
            </button>
            <button
              className={`${styles.filterBtn} ${activeFilter === "Training" ? styles.activeFilter : ""}`}
              onClick={() => setActiveFilter("Training")}
            >
              {t.training}
            </button>
          </div>
        </section>

        <section className={styles.marketplacePreview}>
          <div className={styles.carouselWrapper}>
            <button
              type="button"
              className={`${styles.carouselBtn} ${styles.leftBtn}`}
              onClick={() => scrollCarousel("left")}
              aria-label="Previous courses"
            >
              {t.previous}
            </button>

            <div className={styles.courseCarousel} ref={carouselRef}>
              {filteredCourses.map((course, index) => (
                <div
                  key={index}
                  className={styles.courseCard}
                  onClick={() => (window.location.href = "/signup")}
                >
                  <div className={styles.imageWrapper}>
                    <Image
                      src={course.img}
                      alt={course.title}
                      className={styles.courseImage}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  <div className={styles.courseInfo}>
                    <div className={styles.courseContentTop}>
                      <div className={styles.topRow}>
                        <span className={styles.courseType}>
                          {course.type === "Course" ? t.courseTypeCourse : t.courseTypeTraining}
                        </span>
                      </div>

                      <h3>{course.title}</h3>
                      <p className={styles.teacher}>{course.teacher}</p>
                      <p className={styles.courseSummary}>{course.summary}</p>

                      <div className={styles.courseMeta}>
                        <span className={styles.courseTag}>{course.tag}</span>
                        <span className={styles.ratingBox}>⭐ {course.rating}</span>
                        <span className={styles.reviewBox}>{course.reviews}</span>
                      </div>
                    </div>

                    <div className={styles.priceRow}>
                      <p className={styles.price}>{course.price}</p>
                      <Link
                        href="/signup"
                        className={styles.viewCourseBtn}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t.viewDetails}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className={`${styles.carouselBtn} ${styles.rightBtn}`}
              onClick={() => scrollCarousel("right")}
              aria-label="Next courses"
            >
              {t.next}
            </button>
          </div>

          <button className={styles.viewAllBtn}>
            {t.viewAll}
          </button>
        </section>

        <section className={styles.ctaSection}>
          <h2>{t.ctaTitle}</h2>
          <p>{t.ctaText}</p>
          <Link href="/signup" className={styles.ctaBtn}>
            {t.ctaButton}
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}