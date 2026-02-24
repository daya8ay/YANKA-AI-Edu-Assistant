"use client";

import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export default function About() {
  return (
    <>
      <NavBar />

     {/* HERO */}
<section className={styles.hero}>
  <div className={styles.heroContent}>
    <h1>
      About <span>YANKA</span>
    </h1>

    <p className={styles.heroTagline}>
      AI-Powered Multilingual Learning, Training & Creator Ecosystem
    </p>

    <p className={styles.heroMotto}>
      “Learn. Create. Research. Grow.”
    </p>

    <p className={styles.heroSub}>
      Your AI Academic Partner for Life.
    </p>
  </div>
</section>

      {/* INTRO */}
      <section className={styles.introSection}>
        <h2>Empowering the Future of Learning Through AI</h2>
        <p>
          YANKA is an all-in-one intelligent platform designed to revolutionize 
          how the world learns, teaches, researches, and creates. Built with 
          cutting-edge AI, YANKA combines voice-enabled tutoring, AI avatar 
          video creation, academic research tools, professional training 
          development, and a fully integrated knowledge marketplace.
        </p>
        <p>
          YANKA is more than an app — it is a 21st-century global learning 
          ecosystem empowering students, researchers, educators, professionals, 
          institutions, NGOs, governments, and lifelong learners worldwide.
        </p>
      </section>

            {/* PROMISE */}
<section id="promise" className={styles.promiseSection}>
  <h2>Our Promise</h2>

  <div className={styles.promiseGrid}>
    
    <div className={styles.flipCard}>
      <div className={styles.flipCardInner}>
        <div className={styles.flipCardFront}>
          <h3>Quality</h3>
        </div>
        <div className={styles.flipCardBack}>
          <p>
            Accurate, verified, and curriculum-aligned educational content.
          </p>
        </div>
      </div>
    </div>

    <div className={styles.flipCard}>
      <div className={styles.flipCardInner}>
        <div className={styles.flipCardFront}>
          <h3>Integrity</h3>
        </div>
        <div className={styles.flipCardBack}>
          <p>
            Privacy protection, ethical AI use, and academic honesty.
          </p>
        </div>
      </div>
    </div>

    <div className={styles.flipCard}>
      <div className={styles.flipCardInner}>
        <div className={styles.flipCardFront}>
          <h3>Inclusion</h3>
        </div>
        <div className={styles.flipCardBack}>
          <p>
            Supporting every learner, in every language and discipline.
          </p>
        </div>
      </div>
    </div>

    <div className={styles.flipCard}>
      <div className={styles.flipCardInner}>
        <div className={styles.flipCardFront}>
          <h3>Innovation</h3>
        </div>
        <div className={styles.flipCardBack}>
          <p>
            Continuously evolving AI designed around real human needs.
          </p>
        </div>
      </div>
    </div>

  </div>
</section>

      {/* MISSION */}
      <section id="mission" className={styles.splitSection}>
        <div className={styles.mediaSide}>
          <img
            src="/pics/about-mission.jpg"
            alt="YANKA Mission"
            className={styles.media}
          />
        </div>

        <div className={styles.textSide}>
          <h2>✨ Our Mission</h2>
          <p>
            To democratize high-quality education and training for every person 
            on Earth, in every language, by combining human-centered pedagogy 
            with advanced AI.
          </p>
          <p>
            We transform knowledge into interactive, multilingual learning 
            experiences powered by AI avatars, natural-language tutoring, and 
            intelligent personalization.
          </p>
        </div>
      </section>

      {/* VISION */}
      <section id="vision" className={`${styles.splitSection} ${styles.reverse}`}>
        <div className={styles.mediaSide}>
          <img
            src="/pics/about-vision.jpg"
            alt="YANKA Vision"
            className={styles.media}
          />
        </div>

        <div className={styles.textSide}>
          <h2>🚀 Our Vision</h2>
          <p>
            A world where anyone, regardless of age, location, or background, 
            can learn, create, teach, and earn through a unified AI platform 
            that adapts to each learner’s goals, culture, and language.
          </p>
          <p>
            With the Training & Course Builder, YANKA evolves into a complete 
            AI-powered education & training marketplace.
          </p>
        </div>
      </section>

{/* WHY WE EXIST */}
<section className={styles.existSection}>
  <div className={styles.contentWrapper}>
    <h2>Why We Exist</h2>
    <p>
      Education is evolving, yet access and personalization remain global 
      challenges. YANKA bridges that gap — giving every learner the tools 
      to think critically, learn independently, and create globally.
    </p>
    <p>
      Whether you’re writing your first essay or defending your PhD, 
      YANKA is with you — every step of the way.
    </p>
  </div>
</section>

      <Footer />
    </>
  );
}