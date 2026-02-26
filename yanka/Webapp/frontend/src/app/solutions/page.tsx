"use client";

import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export default function SolutionsPage() {
  return (
    <>
      <NavBar />

      {/* HERO */}
        <section className={styles.hero}>
        <div className={styles.heroInner}>
            <h1>Who Yanka Serves</h1>
            <p className={styles.heroSubtitle}>
            An AI-Powered Ecosystem for Learning, Research, and Academic Growth
            </p>
        </div>
                <div className={styles.heroDivider}></div>
        </section>


      {/* STUDENTS */}
      <section id="students" className={styles.solutionSection}>
        <div className={styles.imageLeft}>
          <img src="/pics/students.jpeg" alt="Students using AI tools" />
        </div>
        <div className={styles.contentRight}>
          <h2>Students</h2>
          <p>
            Yanka empowers students with intelligent study tools designed for
            modern academic success. From an AI-powered tutor that explains
            complex concepts instantly, to assignment assistance and research
            guidance, students receive 24/7 personalized support.
          </p>
          <p>
            Smart planners help manage deadlines, track progress, and improve
            productivity, while adaptive learning systems tailor content based
            on individual performance.
          </p>
        </div>
      </section>

      {/* RESEARCHERS */}
      <section id="researchers" className={styles.solutionSectionReverse}>
        <div className={styles.contentLeft}>
          <h2>Researchers</h2>
          <p>
            Yanka accelerates academic research with advanced thesis-building
            tools, literature review automation, and AI-driven writing
            enhancement. Researchers can organize citations, structure
            arguments, and refine manuscripts effortlessly.
          </p>
          <p>
            Built-in plagiarism detection and research validation tools ensure
            originality, accuracy, and compliance with global academic
            standards.
          </p>
        </div>
        <div className={styles.imageRight}>
          <img src="/pics/researcher.jpeg" alt="Research tools" />
        </div>
      </section>

      {/* TEACHERS & INSTITUTIONS */}
      <section id="teachers" className={styles.solutionSection}>
        <div className={styles.imageLeft}>
          <img src="/pics/teachers.jpeg" alt="Teachers using analytics" />
        </div>
        <div className={styles.contentRight}>
          <h2>Teachers & Institutions</h2>
          <p>
            Yanka enables educators to design interactive courses, generate
            lesson plans instantly, and personalize classroom content using AI.
            Integrated dashboards provide real-time student analytics and
            engagement insights.
          </p>
          <p>
            Seamless LMS integration ensures smooth adoption across schools,
            helping institutions modernize without disrupting existing systems.
          </p>
        </div>
      </section>

      {/* COURSE CREATORS */}
      <section id="creators" className={styles.solutionSectionReverse}>
        <div className={styles.contentLeft}>
          <h2>Course Creators</h2>
          <p>
            Yanka allows creators to build and monetize AI-powered courses
            globally. With avatar-based video generation and automated
            translation, courses can reach multilingual audiences instantly.
          </p>
          <p>
            Built-in analytics, monetization tools, and distribution channels
            help creators scale their educational businesses worldwide.
          </p>
        </div>
        <div className={styles.imageRight}>
          <img src="/pics/creators.jpeg" alt="Course creation platform" />
        </div>
      </section>

      {/* UNIVERSITIES */}
      <section id="universities" className={styles.solutionSection}>
        <div className={styles.imageLeft}>
          <img src="/pics/universities.jpeg" alt="University integration" />
        </div>
        <div className={styles.contentRight}>
          <h2>Universities</h2>
          <p>
            Universities can integrate Yanka’s full research and learning suite
            into their ecosystem. From enterprise-level AI deployment to
            research-grade analytics, institutions gain scalable and secure
            infrastructure.
          </p>
          <p>
            White-label capabilities, compliance-ready architecture, and
            centralized dashboards empower universities to deliver AI-enhanced
            education at scale.
          </p>
        </div>
      </section>

      {/* INSTITUTIONAL INTEGRATION VIDEO STRIP */}
      <section className={styles.videoStripSection}>
        <h2>Institutional Integration</h2>

        <div className={styles.videoStrip}>
          <video
            src="/video/home.mp4"
            autoPlay
            muted
            loop
          />
          <div className={styles.videoOverlay}>
            <h3>Enterprise-Grade Integration</h3>
            <p>
              Custom dashboards, secure data compliance (FERPA & GDPR),
              performance tracking, and white-label AI deployment for
              universities and institutions.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}