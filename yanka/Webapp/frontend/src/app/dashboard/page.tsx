"use client";

import React from "react";
import DashboardNavBar from "@/components/DashboardNavBar";
import Image from "next/image";
import Footer from "@/components/Footer"; // ✅ Import Footer component
import styles from "./page.module.css";

export default function Dashboard() {
  return (
    <>
      <DashboardNavBar />

      <main className={styles.dashboard}>
        {/* Welcome Section */}
        <section className={styles.hero}>
      <div className={styles.heroContent}>
    <div className={styles.textSection}>
      <h1>Study Dashboard</h1>
      <h2>
        Welcome Back, <span>Student 👋</span>
      </h2>
      <p>Let’s make today a step closer to your learning goals..</p>
    </div>

    <div className={styles.avatarContainer}>
      <Image
        src="/pics/user_avatar.jpeg"
        alt="User Avatar"
        width={180}  // Increased size
        height={140}
        className={styles.avatar}
      />
    </div>
  </div>
</section>


        {/* Stats Section */}
        <section className={styles.statsGrid}>
          <div className={styles.card}>
            <h3>My Subjects</h3>
            <p>5 courses</p>
          </div>
          <div className={styles.card}>
            <h3>Assignments</h3>
            <p>3 pending</p>
          </div>
          <div className={styles.card}>
            <h3>AI Tutor Chat</h3>
            <p>Get instant study help and explanations.</p>
          </div>
          <div className={styles.card}>
            <h3>Lecture Summaries</h3>
            <p>Auto-generated summaries for your recent lessons.</p>
          </div>
        </section>

        {/* Recommendations Section */}
<section className={styles.recommendations}>
  <h2>Continue Learning</h2>
  <div className={styles.courses}>
    <div className={styles.courseCard}>
      <Image
        src="/pics/ai-course.jpeg"
        alt="AI Course"
        width={320}
        height={160}
        className={styles.courseImage}
      />
      <h4>AI Research Methods</h4>
      <p>Learn to write better academic papers with AI support.</p>

      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div className={styles.progressLabel}>
          <span>Progress</span>
          <span>68%</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: "68%" }}></div>
        </div>
      </div>
    </div>

    <div className={styles.courseCard}>
      <Image
        src="/pics/presentation-course.jpeg"
        alt="Presentation Skills"
        width={320}
        height={160}
        className={styles.courseImage}
      />
      <h4>Presentation Mastery</h4>
      <p>Design impactful slides and boost your delivery confidence.</p>

      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div className={styles.progressLabel}>
          <span>Progress</span>
          <span>42%</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: "42%" }}></div>
        </div>
      </div>
    </div>
  </div>
</section>
      </main>
      {/* ✅ Footer at the bottom */}
      <Footer />
    </>
  );
}
