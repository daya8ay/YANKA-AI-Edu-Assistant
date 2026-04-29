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
    creators: "Content & Course Creators",
    universities: "Universities",
    pricing: "Pricing",
    marketplace: "Marketplace",
    support: "Support",
    research: "Research",
    login: "Login",
    signup: "Sign Up",
    languageSelector: "Language Selector",
    menu: "Menu",
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
    menu: "Menu",
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <>
      <header className={`${styles.navbar} ${isScrolled ? styles.scrollDown : ""}`}>
        <Link href="/" className={styles.logoContainer} onClick={closeMobileMenu}>
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

        <button
          type="button"
          className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerActive : ""}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={t.menu}
          aria-expanded={isMobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`${styles.navMenu} ${isMobileMenuOpen ? styles.showMenu : ""}`}>
          <ul>
            <li className={styles.dropdown}>
              <button
                type="button"
                className={styles.dropdownTitle}
                onClick={() => toggleDropdown("about")}
              >
                {t.about}
                <span className={styles.dropdownArrow}>
                  {openDropdown === "about" ? "−" : "+"}
                </span>
              </button>

              <ul
                className={`${styles.dropdownMenu} ${
                  openDropdown === "about" ? styles.dropdownOpen : ""
                }`}
              >
                <li>
                  <Link href="/about#promise" onClick={closeMobileMenu}>
                    {t.promise}
                  </Link>
                </li>
                <li>
                  <Link href="/about#mission" onClick={closeMobileMenu}>
                    {t.mission}
                  </Link>
                </li>
                <li>
                  <Link href="/about#vision" onClick={closeMobileMenu}>
                    {t.vision}
                  </Link>
                </li>
              </ul>
            </li>

            <li className={styles.dropdown}>
              <button
                type="button"
                className={styles.dropdownTitle}
                onClick={() => toggleDropdown("features")}
              >
                {t.features}
                <span className={styles.dropdownArrow}>
                  {openDropdown === "features" ? "−" : "+"}
                </span>
              </button>

              <ul
                className={`${styles.dropdownMenu} ${
                  openDropdown === "features" ? styles.dropdownOpen : ""
                }`}
              >
                <li>
                  <Link href="/features#video" onClick={closeMobileMenu}>
                    {t.aiVideo}
                  </Link>
                </li>
                <li>
                  <Link href="/features#avatar" onClick={closeMobileMenu}>
                    {t.realTimeAI}
                  </Link>
                </li>
                <li>
                  <Link href="/features#training" onClick={closeMobileMenu}>
                    {t.training}
                  </Link>
                </li>
                <li>
                  <Link href="/features#courses" onClick={closeMobileMenu}>
                    {t.academic}
                  </Link>
                </li>
              </ul>
            </li>

            <li className={styles.dropdown}>
              <button
                type="button"
                className={styles.dropdownTitle}
                onClick={() => toggleDropdown("institutions")}
              >
                {t.institutions}
                <span className={styles.dropdownArrow}>
                  {openDropdown === "institutions" ? "−" : "+"}
                </span>
              </button>

              <ul
                className={`${styles.dropdownMenu} ${
                  openDropdown === "institutions" ? styles.dropdownOpen : ""
                }`}
              >
                <li>
                  <Link href="/solutions#students" onClick={closeMobileMenu}>
                    {t.students}
                  </Link>
                </li>
                <li>
                  <Link href="/solutions#researchers" onClick={closeMobileMenu}>
                    {t.researchers}
                  </Link>
                </li>
                <li>
                  <Link href="/solutions#teachers" onClick={closeMobileMenu}>
                    {t.teachers}
                  </Link>
                </li>
                <li>
                  <Link href="/solutions#creators" onClick={closeMobileMenu}>
                    {t.creators}
                  </Link>
                </li>
                <li>
                  <Link href="/solutions#universities" onClick={closeMobileMenu}>
                    {t.universities}
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link href="/#pricing" onClick={closeMobileMenu}>
                {t.pricing}
              </Link>
            </li>
            <li>
              <Link href="/#marketplace" onClick={closeMobileMenu}>
                {t.marketplace}
              </Link>
            </li>
            <li>
              <Link href="/research" onClick={closeMobileMenu}>
                {t.research}
              </Link>
            </li>
            <li>
              <Link href="/support" onClick={closeMobileMenu}>
                {t.support}
              </Link>
            </li>
            <li>
              <Link href="/login" className={styles.btnLogin} onClick={closeMobileMenu}>
                {t.login}
              </Link>
            </li>
            <li>
              <Link href="/signup" className={styles.btnSignup} onClick={closeMobileMenu}>
                {t.signup}
              </Link>
            </li>
            <li>
              <button
                type="button"
                className={styles.languageButton}
                onClick={() => {
                  setIsLanguageModalOpen(true);
                  setIsMobileMenuOpen(false);
                  setOpenDropdown(null);
                }}
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