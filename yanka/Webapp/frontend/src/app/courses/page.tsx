"use client";

import React from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import styles from "./courses.module.css";

export default function Courses() {
  const courses = [
    {
      title: "AI & Machine Learning",
      description: "Master algorithms, data processing, and neural networks with hands-on projects.",
      category: "Technology"
    },
    {
      title: "Data Science & Analytics",
      description: "Turn data into insights with Python, R, and visualization tools used by industry experts.",
      category: "Technology"
    },
    {
      title: "Web & App Development",
      description: "Build modern applications from scratch using React, Flutter, or full-stack technologies.",
      category: "Technology"
    },
    {
      title: "Academic Research & Writing",
      description: "Enhance your academic writing, thesis structure, and research methodology with AI tools.",
      category: "Academic"
    },
    {
      title: "Mathematics & Statistics",
      description: "From calculus to probability theory, master mathematical concepts with AI-guided learning.",
      category: "Academic"
    },
    {
      title: "Languages & Communication",
      description: "Learn new languages and improve your communication skills with personalized tutoring.",
      category: "Languages"
    }
  ];

  return (
    <>
      <NavBar />
      
      <main className={styles.coursesMain}>
        <section className={styles.coursesHeader}>
          <h1>Explore Courses & Learning Paths</h1>
          <p>Discover curated AI-powered courses tailored to your goals and pace.</p>
        </section>

        <section className={styles.coursesContent}>
          <div className={styles.courseGrid}>
            {courses.map((course, index) => (
              <div key={index} className={styles.courseCard}>
                <div className={styles.courseCategory}>{course.category}</div>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <Link href="#" className={styles.viewCourseBtn}>
                  View Course
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.ctaSection}>
          <h2>Ready to Start Learning?</h2>
          <p>Join thousands of students advancing their education with YANKA&apos;s AI-powered platform.</p>
          <Link href="/signup" className={styles.ctaBtn}>
            Get Started Today
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>© 2025 YANKA | Powered by Kimuntu Power Inc.</p>
          <div className={styles.footerLinks}>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
            <Link href="#">Licensing</Link>
          </div>
        </div>
      </footer>
    </>
  );
}

