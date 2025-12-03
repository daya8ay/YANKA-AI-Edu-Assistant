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
          {/* Product */}
          <div className={styles.column}>
            <h4>Product</h4>
            <ul>
              <li><Link href="#">Interactive</Link></li>
              <li><Link href="#">Create AI Video</Link></li>
              <li><Link href="#">AI Script Assistant</Link></li>
              <li><Link href="#">Text to Video</Link></li>
              <li><Link href="#">Avatar Conversation</Link></li>
              <li><Link href="#">Conversation Text to Video</Link></li>
              <li><Link href="#">Courses</Link></li>
              <li><Link href="#">AI Study Companion</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className={styles.column}>
            <h4>Resources</h4>
            <ul>
              <li><Link href="#">Pricing</Link></li>
              <li><Link href="#">Community</Link></li>
              <li><Link href="#">Blog</Link></li>
              <li><Link href="#">Affiliates</Link></li>
              <li><Link href="#">Partnerships</Link></li>
              <li><Link href="#">Glossary</Link></li>
              <li><Link href="#">Support</Link></li>
            </ul>
          </div>

          {/* Industries */}
          <div className={styles.column}>
            <h4>Industries</h4>
            <ul>
              <li><Link href="#">Education & Training</Link></li>
              <li><Link href="#">Retail</Link></li>
              <li><Link href="#">Agriculture</Link></li>
              <li><Link href="#">Finance</Link></li>
              <li><Link href="#">Technology</Link></li>
              <li><Link href="#">Healthcare</Link></li>
              <li><Link href="#">Manufacturing</Link></li>
            </ul>
          </div>

          {/* Sectors */}
          <div className={styles.column}>
            <h4>Sectors</h4>
            <ul>
              <li><Link href="#">Students</Link></li>
              <li><Link href="#">Research</Link></li>
              <li><Link href="#">Education & Institutions</Link></li>
              <li><Link href="#">Professionals</Link></li>
              <li><Link href="#">Academic Ecosystem</Link></li>
              <li><Link href="#">NGO & Government</Link></li>
              <li><Link href="#">Everyone</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className={styles.footerBottom}>
        <p>© 2025 YANKA | Powered by Kimuntu Power Inc.</p>
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
