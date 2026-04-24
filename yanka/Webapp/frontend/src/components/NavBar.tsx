"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./NavBar.module.css";
import { useLanguage } from "@/context/LanguageContext";

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const translations = {
  en: {
    chooseLanguage: "Choose a language",
    english: "English",
    french: "Français",
    about: "About",
    promise: "Promise",
    mission: "Mission",
    vision: "Vision",
    features: "Features",
    aiVideo: "AI Video Generation",
    realTimeAI: "Real-Time AI Creation",
    training: "AI-Designed Training Program Workshops",
    academic: "Advanced Academic Capabilities",
    institutions: "Institutions",
    students: "Students",
    researchers: "Researchers",
    teachers: "Teachers & Institutions",
    creators: "Course Creators",
    universities: "Universities",
    pricing: "Pricing",
    marketplace: "Marketplace",
    support: "Support",
    research: "Research",
    login: "Login",
    signup: "Sign Up",
    languageSelector: "Language Selector",
  },
  fr: {
    chooseLanguage: "Choisissez une langue",
    english: "English",
    french: "Français",
    about: "À propos",
    promise: "Promesse",
    mission: "Mission",
    vision: "Vision",
    features: "Fonctionnalités",
    aiVideo: "Génération vidéo par IA",
    realTimeAI: "Création IA en temps réel",
    training: "Ateliers de formation conçus par IA",
    academic: "Capacités académiques avancées",
    institutions: "Institutions",
    students: "Étudiants",
    researchers: "Chercheurs",
    teachers: "Enseignants et institutions",
    creators: "Créateurs de cours",
    universities: "Universités",
    pricing: "Tarifs",
    marketplace: "Marketplace",
    support: "Support",
    research: "Recherche",
    login: "Connexion",
    signup: "S’inscrire",
    languageSelector: "Sélecteur de langue",
  },
};

const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  if (!isOpen) return null;

  const handleSelect = (lang: "en" | "fr") => {
    setLanguage(lang);
    onClose();
  };

  return (
    <div className={styles.languageModal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <span className={styles.closeBtn} onClick={onClose}>
          &times;
        </span>
        <h2>{t.chooseLanguage}</h2>
        <div className={styles.languageGrid}>
          <span onClick={() => handleSelect("en")}>{t.english}</span>
          <span onClick={() => handleSelect("fr")}>{t.french}</span>
        </div>
      </div>
    </div>
  );
};

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  const { language } = useLanguage();
  const t = translations[language];

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
              <Link href="/about" className={styles.dropdownTitle}>
                {t.about}
              </Link>
              <ul className={styles.dropdownMenu}>
                <li>
                  <Link href="/about#promise">{t.promise}</Link>
                </li>
                <li>
                  <Link href="/about#mission">{t.mission}</Link>
                </li>
                <li>
                  <Link href="/about#vision">{t.vision}</Link>
                </li>
              </ul>
            </li>

            <li className={styles.dropdown}>
              <Link href="/#features" className={styles.dropdownTitle}>
                {t.features}
              </Link>
              <ul className={styles.dropdownMenu}>
                <li>
                  <Link href="/features#video">{t.aiVideo}</Link>
                </li>
                <li>
                  <Link href="/features#avatar">{t.realTimeAI}</Link>
                </li>
                <li>
                  <Link href="/features#training">{t.training}</Link>
                </li>
                <li>
                  <Link href="/features#courses">{t.academic}</Link>
                </li>
              </ul>
            </li>

            <li className={styles.dropdown}>
              <Link href="/#institutions" className={styles.dropdownTitle}>
                {t.institutions}
              </Link>
              <ul className={styles.dropdownMenu}>
                <li>
                  <Link href="/solutions#students">{t.students}</Link>
                </li>
                <li>
                  <Link href="/solutions#researchers">{t.researchers}</Link>
                </li>
                <li>
                  <Link href="/solutions#teachers">{t.teachers}</Link>
                </li>
                <li>
                  <Link href="/solutions#creators">{t.creators}</Link>
                </li>
                <li>
                  <Link href="/solutions#universities">{t.universities}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link href="/#pricing">{t.pricing}</Link>
            </li>
            <li>
              <Link href="/#marketplace">{t.marketplace}</Link>
            </li>
            <li>
              <Link href="/support">{t.support}</Link>
            </li>
            <li>
              <Link href="/research">{t.research}</Link>
            </li>
            <li>
              <Link href="/login" className={styles.btnLogin}>
                {t.login}
              </Link>
            </li>
            <li>
              <Link href="/signup" className={styles.btnSignup}>
                {t.signup}
              </Link>
            </li>
            <li>
              <button
                type="button"
                className={styles.languageButton}
                onClick={() => setIsLanguageModalOpen(true)}
                aria-label={t.languageSelector}
              >
                EN <span className={styles.divider}>|</span> FR
              </button>
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