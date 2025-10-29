"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <NavBar />
      
      {/* Hero Section */}
      <section className={styles.hero} id="top">
        <div className={styles.heroContent}>
          <h1>
            Reimagining Education with <span>AI</span>
          </h1>
          <p>
            YANKA unifies learning, research, and creativity into one intelligent 
            ecosystem — built to empower students and educators worldwide.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/signup" className={styles.btnPrimary}>
              Get Started
            </Link>
            <Link href="#features" className={styles.btnSecondary}>
              Explore Features
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <Image
            src="/pics/AI_Avatar.jpeg"
            alt="AI Avatar"
            width={500}
            height={500}
            className={styles.heroAvatar}
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <h2>What YANKA Offers</h2>
        <p className={styles.subtitle}>
          From secondary school learning to advanced university research — all in one place.
        </p>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <h3>AI Study Companion</h3>
            <p>
              Personalized study plans, adaptive progress tracking, and smart reminders to stay ahead.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3>AI Subject Tutors</h3>
            <p>
              Interactive, curriculum-aligned tutoring for every subject — available anytime, anywhere.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3>Research Suite</h3>
            <p>
              Thesis Builder, Literature Review Assistant, and Plagiarism Shield for academic excellence.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3>AI Video & Summaries</h3>
            <p>
              Turn lectures and notes into concise summaries or AI-generated educational videos.
            </p>
          </div>
        </div>
      </section>

      {/* Academic Suite Section */}
      <section className={styles.academicSuite} id="institutions">
        <div className={styles.suiteOverlay}></div>
        
        <div className={styles.suiteHeader}>
          <h2>YANKA Academic & School Suite</h2>
          <p>
            Empowering the next generation of learners through adaptive, AI-powered education.
          </p>
        </div>

        <div className={styles.suiteGrid}>
          <div className={styles.suiteCard}>
            <h3>Smart Learning Tools</h3>
            <p>AI-driven assessments and personalized feedback for every student.</p>
          </div>

          <div className={styles.suiteCard}>
            <h3>Data Insights</h3>
            <p>Powerful analytics for teachers and administrators to improve outcomes.</p>
          </div>

          <div className={styles.suiteCard}>
            <h3>Collaboration Hub</h3>
            <p>Bridging communication between parents, students, and educators seamlessly.</p>
          </div>
        </div>
      </section>

      {/* Pricing & Plans Section */}
      <section id="pricing" className={styles.pricing}>
        <h2>Choose Your YANKA Plan</h2>
        <p className={styles.subtitle}>
          Flexible plans designed for every learner, from students to institutions.
        </p>

        <div className={styles.pricingGrid}>
          {/* Plan 1 */}
          <div className={styles.planCard}>
            <Image 
              src="/pics/pic1.jpeg" 
              alt="YANKA Learn" 
              width={70} 
              height={70} 
              className={styles.planIcon}
            />
            <h3>YANKA Learn</h3>
            <p className={styles.price}>Free</p>
            <ul>
              <li>AI chatbot access</li>
              <li>Unlimited AI video creation</li>
              <li>Study planner & progress tracker</li>
              <li>Limited daily questions</li>
              <li>Access to community Q&A</li>
            </ul>
            <Link href="/signup" className={`${styles.btnPrimary} ${styles.small}`}>
              Start Free
            </Link>
          </div>

          {/* Plan 2 */}
          <div className={`${styles.planCard} ${styles.highlight}`}>
            <Image 
              src="/pics/pic2.jpeg" 
              alt="YANKA Plus" 
              width={70} 
              height={70} 
              className={styles.planIcon}
            />
            <h3>YANKA Plus</h3>
            <p className={styles.price}>$9.99/mo</p>
            <ul>
              <li>Unlimited AI tutor sessions</li>
              <li>AI essay & assignment assistant</li>
              <li>Research & Thesis Builder (standard mode)</li>
              <li>AI avatars & video creation</li>
              <li>Advanced study analytics</li>
            </ul>
            <Link href="/signup" className={`${styles.btnGreen} ${styles.small}`}>
              Upgrade to YANKA Plus
            </Link>
          </div>

          {/* Plan 3 */}
          <div className={`${styles.planCard} ${styles.recommended}`}>
            <div className={styles.recommendedBadge}>Recommended</div>
            <Image 
              src="/pics/pic3.jpeg" 
              alt="YANKA Scholar" 
              width={70} 
              height={70} 
              className={styles.planIcon}
            />
            <h3>YANKA Scholar</h3>
            <p className={styles.price}>$24.99/mo</p>
            <ul>
              <li>All YANKA Plus features</li>
              <li>Full Academic & Research Suite</li>
              <li>Collaboration tools</li>
              <li>Priority support</li>
              <li>Document cloud backup</li>
            </ul>
            <Link href="/signup" className={`${styles.btnPurple} ${styles.small}`}>
              Upgrade to YANKA Scholar
            </Link>
          </div>

          {/* Plan 4 */}
          <div className={styles.planCard}>
            <Image 
              src="/pics/pic4.jpeg" 
              alt="YANKA Institution" 
              width={70} 
              height={70} 
              className={styles.planIcon}
            />
            <h3>YANKA Institution</h3>
            <p className={styles.price}>Starting at $2,499/mo</p>
            <ul>
              <li>Full academic + learning ecosystem</li>
              <li>Custom branding</li>
              <li>API & LMS integration</li>
              <li>Institutional analytics</li>
              <li>Admin control & compliance</li>
            </ul>
            <Link href="#contact" className={`${styles.btnSecondary} ${styles.small} ${styles.institution}`}>
              Request Institutional Demo
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={styles.about}>
        <h2>Building the Future of Learning</h2>
        <p>
          YANKA is more than a tool — it&apos;s a lifelong academic companion. Our mission 
          is to empower students and researchers everywhere with intelligent, ethical, 
          and inclusive AI solutions.
        </p>
        <a 
          href="https://docs.google.com/document/d/1c4hNj9rRmWOMxIMIKmEEnjyS6mzK2mot1TvQaPebMtc/edit?tab=t.0" 
          className={styles.btnPrimary}
          target="_blank"
          rel="noopener noreferrer"
        >
          Read More
        </a>
      </section>

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
