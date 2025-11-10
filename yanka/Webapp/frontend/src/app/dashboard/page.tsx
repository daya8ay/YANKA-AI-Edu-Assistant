"use client";

import React from "react";
import DashboardNavBar from "@/components/DashboardNavBar";
import styles from "./page.module.css";

export default function Dashboard() {
  return (
    <>
      <DashboardNavBar />

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Welcome Back to <span>YANKA</span></h1>
          <p>Your AI-powered learning and research hub.</p>
        </div>
      </section>

      <section className={styles.sections}>
        <div className={styles.card}>
          <h3>AI Study Tools</h3>
          <p>Access your personalized study planner, tutor sessions, and more.</p>
        </div>
        <div className={styles.card}>
          <h3>Research Suite</h3>
          <p>Build your next paper with AI-assisted thesis and literature tools.</p>
        </div>
        <div className={styles.card}>
          <h3>Course Insights</h3>
          <p>Track your progress and visualize performance with real-time analytics.</p>
        </div>
      </section>
    </>
  );
}
