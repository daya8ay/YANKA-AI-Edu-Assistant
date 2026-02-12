"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
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
            Yanka unifies learning, research, and creativity into one intelligent 
            ecosystem built to empower students and educators worldwide.
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

        <div className={styles.heroVideoContainer}>
          <video
            className={styles.heroVideo}
            src="/video/intro.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </section>

{/* About Section */}
<section id="about" className={styles.about}>
  
  {/* Background Video */}
  <video
    className={styles.aboutVideo}
    src="/video/home.mp4"
    autoPlay
    loop
    muted
    playsInline
  />

  {/* Translucent Overlay */}
  <div className={styles.aboutOverlay}></div>

  {/* Content */}
  <div className={styles.aboutContent}>
    <h2>Building the Future of Learning</h2>
    <p>
      We are more than a tool, it&apos;s a lifelong academic companion. Our mission 
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
  </div>

</section>

{/* Features Section */}
<section id="features" className={styles.features}>
  <h2>What We Offer</h2>
  <p className={styles.subtitle}>
    Powerful AI tools for learning, teaching, research, and content creation all in one platform.
  </p>

  <div className={styles.featureGrid}>

    <div className={styles.featureCard}>
      <h3>AI Learning & Tutoring</h3>
      <p>
        Smart planners, curriculum-aligned tutors, instant homework help, and real-time multilingual interaction to enhance study and revision.
      </p>
    </div>

    <div className={styles.featureCard}>
      <h3>AI Content & Course Creation</h3>
      <p>
        Instantly turn text into videos with AI avatars, convert documents into multilingual explainers, and build courses to teach or monetize globally.
      </p>
    </div>

    <div className={styles.featureCard}>
      <h3>Academic Research Suite</h3>
      <p>
        Thesis Builder, literature review automation, academic writing support, and integrity protection for advanced research.
      </p>
    </div>

    <div className={styles.featureCard}>
      <h3>Teacher & Institution Tools</h3>
      <p>
        AI-generated lessons, smart analytics, global translation, and seamless LMS integration for efficient education management.
      </p>
    </div>

    </div>
    <Link href="/features">
  <button className={styles.exploreBtn}>
    Explore More →
  </button>
</Link>
</section>

{/* Academic Suite Section */}
<section className={styles.academicSuite} id="institutions">
  <div className={styles.suiteOverlay}></div>

  <div className={styles.suiteHeader}>
    <h2>Academic & School Suite</h2>
    <p>Your all-in-one AI ecosystem for learning, research & academic growth.</p>
  </div>

  <div className={styles.suiteScroll}>

    <div className={styles.suiteCard}>
      <h3>🏫 Smart Learning Hub</h3>
      <p>Study Planner • Subject Tutors • Homework Help • Summaries</p>
    </div>

    <div className={styles.suiteCard}>
      <h3>🎓 Research Suite</h3>
      <p>Thesis Builder • Lit Reviews • Academic Writing • Data Analysis</p>
    </div>

    <div className={styles.suiteCard}>
      <h3>🎤 AI Presentations</h3>
      <p>Defense Prep • Slide Decks • Avatar Videos • Multilingual Explainables</p>
    </div>

    <div className={styles.suiteCard}>
      <h3>🌐 Marketplace</h3>
      <p>Create, share & sell AI-powered courses in 100+ languages</p>
    </div>

    <div className={styles.suiteCard}>
      <h3>📊 Institutional Insights</h3>
      <p>Dashboards • Analytics • LMS Integration • White-Label Suites</p>
    </div>

    <div className={styles.suiteCard}>
      <h3>🔒 Integrity & Ethics</h3>
      <p>Plagiarism Shield • Citation Fixer • Secure Data • Compliance</p>
    </div>
  </div>
  
  <div className={styles.suiteCTA}>
  <button
    className={styles.suiteButton}
    onClick={() => window.location.href = "/solutions"}
  >
    Explore Who Yanka Serves
  </button>
</div>
</section>

      {/* Pricing & Plans Section */}
      <section id="pricing" className={styles.pricing}>
        <h2>Choose Your Plan</h2>
        <p className={styles.subtitle}>
          Flexible plans designed for every learner, from students to institutions.
        </p>

        <div className={styles.pricingGrid}>
          {/* Plan 1 */}
          <div className={styles.planCard}>
            <Image 
              src="/pics/pic1.jpeg" 
              alt="Learn" 
              width={70} 
              height={70} 
              className={styles.planIcon}
            />
            <h3>Learn</h3>
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
              alt="Plus" 
              width={70} 
              height={70} 
              className={styles.planIcon}
            />
            <h3>Plus</h3>
            <p className={styles.price}>$9.99/mo</p>
            <ul>
              <li>Unlimited AI tutor sessions</li>
              <li>AI essay & assignment assistant</li>
              <li>Research & Thesis Builder (standard mode)</li>
              <li>AI avatars & video creation</li>
              <li>Advanced study analytics</li>
            </ul>
            <Link href="/signup" className={`${styles.btnGreen} ${styles.small}`}>
              Upgrade to Plus
            </Link>
          </div>

          {/* Plan 3 */}
          <div className={`${styles.planCard} ${styles.recommended}`}>
            <div className={styles.recommendedBadge}>Recommended</div>
            <Image 
              src="/pics/pic3.jpeg" 
              alt="Scholar" 
              width={70} 
              height={70} 
              className={styles.planIcon}
            />
            <h3>Scholar</h3>
            <p className={styles.price}>$24.99/mo</p>
            <ul>
              <li>All Plus features</li>
              <li>Full Academic & Research Suite</li>
              <li>Collaboration tools</li>
              <li>Priority support</li>
              <li>Document cloud backup</li>
            </ul>
            <Link href="/signup" className={`${styles.btnPurple} ${styles.small}`}>
              Upgrade to Scholar
            </Link>
          </div>

          {/* Plan 4 */}
          <div className={styles.planCard}>
            <Image 
              src="/pics/pic4.jpeg" 
              alt="Institution" 
              width={70} 
              height={70} 
              className={styles.planIcon}
            />
            <h3>Institution</h3>
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

{/* ---------- Marketplace Preview Section ---------- */}
<section className={styles.marketplacePreview} id="marketplace">
  <h2 className={styles.marketplaceTitle}>Marketplace</h2>

  <p className={styles.marketplaceDescription}>
    Explore a curated collection of skill-building courses from expert creators.
    Learn what matters, level up thoughtfully, and unlock your potential.
  </p>

  {/* Search Bar */}
  <div
    className={styles.searchWrapper}
    onClick={() => window.location.href = "/signup"}
  >
    <span className={styles.searchIcon}>🔍</span>
    <input
      type="text"
      placeholder="Search for courses"
      className={styles.searchInput}
      readOnly
    />
  </div>

  {/* Horizontal Scroll Wrapper */}
  <div className={styles.horizontalScroll}>
    {[
      { title: "AI for Everyone", teacher: "Schan Gya", price: "$30", img: "/pics/ai.jpeg" },
      { title: "Beginners Spanish", teacher: "Rujeta", price: "$20", img: "/pics/spanish.jpeg" },
      { title: "Data Science", teacher: "Rolan", price: "$30", img: "/pics/data.jpeg" },
      { title: "Project Management", teacher: "Sach", price: "$25", img: "/pics/pm.jpeg" },
      { title: "Digital Marketing", teacher: "Dami", price: "$35", img: "/pics/marketing.jpeg" },
      { title: "English Literature", teacher: "English", price: "$20", img: "/pics/english.jpeg" }
    ].map((course, index) => (
      <div
        key={index}
        className={styles.courseCard}
        onClick={() => window.location.href = "/signup"}
      >
        <img src={course.img} className={styles.courseImage} />
        <div className={styles.courseInfo}>
          <h3>{course.title}</h3>
          <p className={styles.teacher}>{course.teacher}</p>
          <p className={styles.price}>{course.price}</p>
        </div>
      </div>
    ))}
  </div>

  <button
    className={styles.viewAllBtn}
    onClick={() => window.location.href = "/signup"}
  >
    View All Courses →
  </button>
</section>

{/* Blog / Insights Section */}
<section className={styles.blogs} id="blogs">
  <h2>From Our Learners</h2>
  <p className={styles.subtitle}>
    Thoughts, insights, and stories from our learners and educators.
  </p>

  <div className={styles.blogCarousel}>
    {[
      {
        user: "Emma Johnson",
        handle: "@emma_learning",
        text: "YANKA helped me summarize 40 pages of research into key insights in minutes. Game changer for thesis writing!",
        time: "2h ago",
      },
      {
        user: "Liam Carter",
        handle: "@liam_studies",
        text: "The AI tutor adjusts perfectly to my pace — it feels like a personal mentor guiding me through complex topics.",
        time: "5h ago",
      },
      {
        user: "Sophia Lee",
        handle: "@sophia_reads",
        text: "The new video lesson feature is amazing! It made my presentations more interactive and fun.",
        time: "1d ago",
      },
      {
        user: "Ethan Wright",
        handle: "@ethan_creates",
        text: "Created my first AI-assisted research draft today using YANKA. It’s efficient, intuitive, and powerful!",
        time: "3d ago",
      },
      {
        user: "Olivia Brown",
        handle: "@olivia_inspires",
        text: "Education should be intelligent, accessible, and inclusive — that’s exactly what YANKA is building.",
        time: "1w ago",
      },
    ].map((post, i) => (
      <div key={i} className={styles.blogCard}>
        <div className={styles.blogHeader}>
          <div className={styles.avatar}></div>
          <div>
            <h4>{post.user}</h4>
            <p>{post.handle}</p>
          </div>
        </div>
        <p className={styles.blogText}>{post.text}</p>
        <span className={styles.blogTime}>{post.time}</span>
      </div>
    ))}
  </div>

    <Link href="/signup">
    <button className={styles.registerBtn}>Register Now</button>
  </Link>
</section>

{/* Sponsors Section */}
<section className={styles.sponsorSection}>
  <h2>Our Partners</h2>

  <div className={styles.sponsorSlider}>
    <div className={styles.sponsorTrack}>
      {[
        "/pics/logo_1.jpeg",
        "/pics/logo_2.jpeg",
        "/pics/logo_3.jpeg",
        "/pics/logo_4.jpeg",
      ].map((logo, i) => (
        <div key={i} className={styles.sponsorLogo}>
          <img src={logo} alt={`Sponsor ${i}`} />
        </div>
      ))}

      {/* Duplicate for seamless infinite loop */}
      {[
        "/pics/logo_1.jpeg",
        "/pics/logo_2.jpeg",
        "/pics/logo_3.jpeg",
        "/pics/logo_4.jpeg",
      ].map((logo, i) => (
        <div key={i + 4} className={styles.sponsorLogo}>
          <img src={logo} alt={`Sponsor duplicate ${i}`} />
        </div>
      ))}
    </div>
  </div>
</section>

{/* Contact Section */}
<section id="contact" className={styles.contactSection}>
  <h2>Contact Us</h2>
  <p className={styles.subtitle}>
    Have questions? We're here to help you learn, grow, and succeed.
  </p>

  <div className={styles.contactCenter}>
    <form className={styles.contactForm}>
      <div className={styles.formGroup}>
        <label>Name</label>
        <input type="text" placeholder="Enter your name" required />
      </div>

      <div className={styles.formGroup}>
        <label>Email</label>
        <input type="email" placeholder="Enter your email" required />
      </div>

      <div className={styles.formGroup}>
        <label>Phone</label>
        <input type="tel" placeholder="Enter your phone number" />
      </div>

      <div className={styles.formGroup}>
        <label>Message</label>
        <textarea placeholder="Write your message..." rows={4}></textarea>
      </div>

      <button type="submit" className={styles.btnPrimary}>
        Submit
      </button>
    </form>
  </div>
</section>

      {/* Footer */}
      <Footer />
    </>
  );
}
