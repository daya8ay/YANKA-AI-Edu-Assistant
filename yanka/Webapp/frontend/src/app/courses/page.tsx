"use client";

import React, { useState } from "react";
import Link from "next/link";
import DashboardNavBar from "@/components/DashboardNavBar";
import Footer from "@/components/Footer";
import styles from "./courses.module.css";

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
  const [activeFilter, setActiveFilter] = useState<"All" | "Courses" | "Training">("All");

  const courses: CourseItem[] = [
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
      type: "Course",
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
      type: "Course",
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
      type: "Course",
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
      type: "Training",
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
      type: "Training",
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
      type: "Course",
    },
  ];

  const filteredCourses =
    activeFilter === "All"
      ? courses
      : courses.filter((course) =>
          activeFilter === "Courses" ? course.type === "Course" : course.type === "Training"
        );

  return (
    <>
      <DashboardNavBar />

      <main className={styles.coursesMain}>
        <section className={styles.coursesHeader}>
          <h1>Explore Courses & Training Programs</h1>
          <p>
            Discover curated AI-powered learning experiences designed to match your
            academic, professional, and career goals.
          </p>

          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterBtn} ${activeFilter === "All" ? styles.activeFilter : ""}`}
              onClick={() => setActiveFilter("All")}
            >
              All
            </button>
            <button
              className={`${styles.filterBtn} ${activeFilter === "Courses" ? styles.activeFilter : ""}`}
              onClick={() => setActiveFilter("Courses")}
            >
              Courses
            </button>
            <button
              className={`${styles.filterBtn} ${activeFilter === "Training" ? styles.activeFilter : ""}`}
              onClick={() => setActiveFilter("Training")}
            >
              Training
            </button>
          </div>
        </section>

        <section className={styles.marketplacePreview}>
          <div className={styles.courseGrid}>
            {filteredCourses.map((course, index) => (
              <div
                key={index}
                className={styles.courseCard}
                onClick={() => (window.location.href = "/signup")}
              >
                <img src={course.img} alt={course.title} className={styles.courseImage} />

                <div className={styles.courseInfo}>
                  <div className={styles.courseContentTop}>
                    <div className={styles.topRow}>
                      <span className={styles.courseType}>{course.type}</span>
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
                    <Link href="/signup" className={styles.viewCourseBtn}>
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className={styles.viewAllBtn}
            onClick={() => (window.location.href = "/signup")}
          >
            View All Learning Options →
          </button>
        </section>

        <section className={styles.ctaSection}>
          <h2>Ready to Start Learning?</h2>
          <p>
            Join thousands of students advancing their education with Yanka&apos;s
            AI-powered platform.
          </p>
          <Link href="/signup" className={styles.ctaBtn}>
            Get Started Today
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}