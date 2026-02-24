"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./NavBar.module.css";

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const languages = [
    "English", "العربية", "Deutsch", "Español", "Français", 
    "Bahasa Indonesia", "Italiano", "日本語", "한국어", "Nederlands",
    "Polski", "Português", "Română", "Русский", "ภาษาไทย",
    "Türkçe", "Tiếng Việt", "中文(繁體)", "中文(简体)"
  ];

  if (!isOpen) return null;

  return (
    <div className={styles.languageModal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <span className={styles.closeBtn} onClick={onClose}>&times;</span>
        <h2>Choose a language</h2>
        <div className={styles.languageGrid}>
          {languages.map((lang, index) => (
            <span key={index}>{lang}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll <= 0) {
        setIsScrolled(false);
      } else if (currentScroll > lastScroll) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <>
      <header className={`${styles.navbar} ${isScrolled ? styles.scrollDown : ""}`}>
        <Link href="/" className={styles.logoContainer}>
          <div className={styles.logoWrapper}>
            <Image 
              src="/pics/Y_Logo.jpeg" 
              alt="YANKA Logo" 
              width={42} 
              height={42} 
              className={styles.logoImg}
            />
          </div>
        </Link>

        <nav>
          <ul>
            <li className={styles.dropdown}>
              {/* Main click → About page */}
              <Link href="/about" className={styles.dropdownTitle}>
                About
              </Link>

              {/* Dropdown */}
              <ul className={styles.dropdownMenu}>
                <li>
                  <Link href="/about#promise">Our Promise</Link>
                </li>
                <li>
                  <Link href="/about#mission">Our Mission</Link>
                </li>
                <li>
                  <Link href="/about#vision">Our Vision</Link>
                </li>
              </ul>
            </li>
            <li className={styles.dropdown}>
              {/* Main Features Link → Homepage section */}
              <Link href="/#features" className={styles.dropdownTitle}>
                Features
              </Link>

              {/* Dropdown Menu */}
              <ul className={styles.dropdownMenu}>
                <li>
                  <Link href="/features#video">AI Video Generation</Link>
                </li>
                <li>
                  <Link href="/features#avatar">Real-Time AI Creation</Link>
                </li>
                <li>
                  <Link href="/features#training">AI-Designed Training Program Workshops</Link>
                </li>
                <li>
                  <Link href="/features#courses">Advanced Academic Capabilities</Link>
                </li>
              </ul>
            </li>
            <li className={styles.dropdown}>
              {/* Main click → homepage institutions section */}
              <Link href="/#institutions" className={styles.dropdownTitle}>
                Institutions
              </Link>

              {/* Dropdown */}
              <ul className={styles.dropdownMenu}>
                <li>
                  <Link href="/solutions#students">Students</Link>
                </li>
                <li>
                  <Link href="/solutions#researchers">Researchers</Link>
                </li>
                <li>
                  <Link href="/solutions#teachers">Teachers & Institutions</Link>
                </li>
                <li>
                  <Link href="/solutions#creators">Course Creators</Link>
                </li>
                <li>
                  <Link href="/solutions#universities">Universities</Link>
                </li>
              </ul>
            </li>
            <li><Link href="/#pricing">Pricing & Plans</Link></li>
            <li><Link href="/#marketplace">Marketplace</Link></li>
            <li><Link href="/support">Support</Link></li>
            <li><Link href="/login" className={styles.btnLogin}>Login</Link></li>
            <li><Link href="/signup" className={styles.btnSignup}>Sign Up</Link></li>
            <li>
              <Image 
                src="/pics/globe.jpeg" 
                alt="Language Selector" 
                width={28} 
                height={28} 
                className={styles.globeIcon}
                onClick={() => setIsLanguageModalOpen(true)}
              />
            </li>
          </ul>
        </nav>
      </header>

      <LanguageModal 
        isOpen={isLanguageModalOpen} 
        onClose={() => setIsLanguageModalOpen(false)} 
      />
    </>
  );
};

export default NavBar;
