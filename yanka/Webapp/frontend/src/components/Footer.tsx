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
        </div>

        <div className={styles.linkColumns}>

          {/* Platform */}
            <div className={styles.column}>
              <h4>Platform</h4>
              <ul>
                <li>
                  <Link href="/features#video">AI Video Generation</Link>
                </li>
                <li>
                  <Link href="/features#avatar">Real-Time AI Avatars</Link>
                </li>
                <li>
                  <Link href="/features#training">AI Training Programs</Link>
                </li>
                <li>
                  <Link href="/features#courses">Wide Range of Courses</Link>
                </li>
                <li>
                  <Link href="/features#data">AI Data Analysis & Visualization</Link>
                </li>
                <li>
                  <Link href="/features#thesis">Thesis & Dissertation Builder</Link>
                </li>
              </ul>
            </div>

          {/* Solutions */}
          <div className={styles.column}>
            <h4>Solutions</h4>
            <ul>
              <li><Link href="#">Students & Learners</Link></li>
              <li><Link href="#">Researchers & Scholars</Link></li>
              <li><Link href="#">Educators & Faculty</Link></li>
              <li><Link href="#">Institutions & Universities</Link></li>
              <li><Link href="#">Course Creators</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className={styles.column}>
            <h4>Resources</h4>
            <ul>
              <li><Link href="#">Pricing & Plans</Link></li>
              <li><Link href="#">Documentation</Link></li>
              <li><Link href="#">Community & Blog</Link></li>
              <li><Link href="#">Academic Integrity</Link></li>
              <li><Link href="#">Support Center</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className={styles.column}>
            <h4>Company</h4>
            <ul>
              <li><Link href="#">About YANKA</Link></li>
              <li><Link href="#">Vision & Ethics</Link></li>
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