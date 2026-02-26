"use client";

import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";
import Image from "next/image";

export default function FeaturesPage() {
  return (
    <>
      <NavBar />

      {/* HERO */}
      <section className={styles.hero}>
        <h1>YANKA – AI-Powered Educational Assistant</h1>
        <p>
          An intelligent ecosystem for learning, research, content creation,
          and academic growth.
        </p>
      </section>

      {/* 1️⃣ AI VIDEO GENERATION */}
      <section id="video" className={styles.splitSection}>
        <div className={styles.mediaLeft}>
          <video
            src="/video/ai-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            className={styles.video}
          />
        </div>
        <div className={styles.textRight}>
          <h2>AI Video Generation</h2>
          <p>
            Instantly transform academic content into professional,
            high-quality educational videos. Convert notes, lectures,
            research papers, and presentations into structured visual
            explainers ready for global audiences.
          </p>
        </div>
      </section>

      {/* 2️⃣ AI AVATAR */}
      <section id="avatar" className={`${styles.splitSection} ${styles.reverse}`}>
        <div className={styles.mediaLeft}>
          <video
            src="/video/avatar.mp4"
            autoPlay
            muted
            loop
            playsInline
            className={styles.video}
          />
        </div>
        <div className={styles.textRight}>
          <h2>Real-Time AI Avatar Creation</h2>
          <p>
            Design multilingual AI avatars for teaching, research defense,
            training sessions, and professional communication. Customize
            voice, language, appearance, and delivery style instantly.
          </p>
        </div>
      </section>

      {/* 3️⃣ TRAINING PROGRAMS */}
      <section id="training" className={styles.splitSection}>
        <div className={styles.mediaLeft}>
          <video
            src="/video/training.mp4"
            autoPlay
            muted
            loop
            playsInline
            className={styles.video}
          />
        </div>
        <div className={styles.textRight}>
          <h2>AI-Designed Training Programs & Workshops</h2>
          <p>
            Build structured academic training programs, workshops, and
            institutional learning tracks powered by AI. Automatically
            generate curriculum outlines, lesson plans, assessments,
            and multilingual delivery modules.
          </p>
        </div>
      </section>

      {/* CARD SECTION */}
      <section id="courses" className={styles.cardSection}>
        <h2>Advanced Academic Capabilities</h2>

        <div className={styles.cardGrid}>

          {/* COURSES */}
          <div className={styles.hoverCard}>
            <div className={styles.cardImageWrapper}>
              <Image
                src="/pics/courses.jpeg"
                alt="Courses"
                fill
                className={styles.cardImage}
              />
              <div className={styles.overlay}>
                <h3>Wide Range of Courses</h3>
                <p>
                  Explore and create AI-powered courses across disciplines.
                  Instantly translated into 100+ languages.
                </p>
              </div>
            </div>
          </div>

          {/* DATA */}
          <div id="data" className={styles.hoverCard}>
            <div className={styles.cardImageWrapper}>
              <Image
                src="/pics/data(1).jpeg"
                alt="Data Analysis"
                fill
                className={styles.cardImage}
              />
              <div className={styles.overlay}>
                <h3>AI Data Analysis & Visualization</h3>
                <p>
                  Perform quantitative and qualitative analysis with
                  integrated AI tools and generate professional charts,
                  dashboards, and exportable reports.
                </p>
              </div>
            </div>
          </div>

          {/* THESIS */}
          <div id="thesis" className={styles.hoverCard}>
            <div className={styles.cardImageWrapper}>
              <Image
                src="/pics/thesis.jpeg"
                alt="Thesis Builder"
                fill
                className={styles.cardImage}
              />
              <div className={styles.overlay}>
                <h3>Thesis & Dissertation Builder</h3>
                <p>
                  Structured academic frameworks for research design,
                  literature review, citation management, and academic
                  integrity validation.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}