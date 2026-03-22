"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      {/* Top Section */}
      <div className={styles.footerTop}>

        {/* Brand + Mission */}
        <div className={styles.logoSection}>
          <Image
            src="/pics/white_logo.jpeg"
            alt="YANKA Logo"
            width={160}
            height={90}
            className={styles.logo}
          />

          <p className={styles.tagline}>
            AI that transforms how you learn—faster, smarter, limitless. Unlock your full potential with Yanka AI
          </p>

          {/* Social Icons */}
          <div className={styles.socialLinks}>
            <a href="https://www.instagram.com/yanka.ai_official" target="_blank" rel="noopener noreferrer">
              <Image src="/pics/insta.jpeg" alt="Instagram" width={28} height={28} />
            </a>

            <a href="https://www.facebook.com/yankaai" target="_blank" rel="noopener noreferrer">
              <Image src="/pics/fbcopy.jpeg" alt="Facebook" width={28} height={28} />
            </a>

            <a href="https://www.linkedin.com/company/yanka-ai" target="_blank" rel="noopener noreferrer">
              <Image src="/pics/linkedincopy.jpeg" alt="LinkedIn" width={28} height={28} />
            </a>
          </div>
        </div>

        <div className={styles.linkColumns}>

          {/* Features */}
          <div className={styles.column}>
            <Link href="/features" className={styles.columnTitleLink}>
              <h4>Features</h4>
            </Link>
            <ul>
              <li><Link href="/features#video">AI Video Generation</Link></li>
              <li><Link href="/features#avatar">Real-Time AI Avatars</Link></li>
              <li><Link href="/features#training">AI Training Programs</Link></li>
              <li><Link href="/features#courses">Wide Range of Courses</Link></li>
              <li><Link href="/features#data">AI Data Analysis & Visualization</Link></li>
              <li><Link href="/features#thesis">Thesis & Dissertation Builder</Link></li>
            </ul>
          </div>

          {/* Who We Serve */}
          <div className={styles.column}>
            <Link href="/solutions" className={styles.columnTitleLink}>
              <h4>Who We Serve</h4>
            </Link>
            <ul>
              <li><Link href="/solutions#students">Students</Link></li>
              <li><Link href="/solutions#researchers">Researchers</Link></li>
              <li><Link href="/solutions#teachers">Teachers & Institutions</Link></li>
              <li><Link href="/solutions#creators">Course Creators</Link></li>
              <li><Link href="/solutions#universities">Universities</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className={styles.column}>
            <h4>Resources</h4>
            <ul>
              <li><Link href="/#pricing">Pricing</Link></li>
              <li><Link href="#">Integration</Link></li>
              <li><Link href="#">Community & Blog</Link></li>
              <li><Link href="#">Academic Integrity</Link></li>
              <li><Link href="/support">Support Center</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className={styles.column}>
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/about#vision">Vision & Ethics</Link></li>
              <li><Link href="#">Partnerships</Link></li>
              <li><Link href="#">Affiliates</Link></li>
              <li><Link href="#">Careers</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Section */}
      <div className={styles.footerBottom}>
        <p>© 2025 YANKA — An Academic AI Platform by Kimuntu Power Inc.</p>
        <div className={styles.bottomLinks}>
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Terms of Service</Link>
          <Link href="#">Licensing</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;