"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./DashboardNavBar.module.css";

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const translations = {
  en: {
    chooseLanguage: "Choose a language",
    english: "English",
    french: "Français",
    courses: "Courses",
    avatarCreation: "Avatar Creation",
    video: "Video",
    videoSimulator: "Video Simulator",
    videoAnalytics: "Video Analytics",
    support: "Support",
    logout: "Logout",
    languageSelector: "Language Selector",
    userAvatar: "User Avatar",
    menu: "Menu",
  },
  fr: {
    chooseLanguage: "Choisissez une langue",
    english: "English",
    french: "Français",
    courses: "Cours",
    avatarCreation: "Création d’avatar",
    video: "Vidéo",
    videoSimulator: "Simulateur vidéo",
    videoAnalytics: "Analyse vidéo",
    support: "Support",
    logout: "Déconnexion",
    languageSelector: "Sélecteur de langue",
    userAvatar: "Avatar utilisateur",
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

const DashboardNavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
    router.push("/login");
  };

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
        <Link href="/dashboard" className={styles.logoContainer} onClick={closeMobileMenu}>
          <div className={styles.logoWrapper}>
            <Image
              src="/pics/Y_Logo.jpeg"
              alt="YANKA Logo"
              width={72}
              height={72}
              className={styles.logoImg}
              priority
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
            <li>
              <Link href="/courses" onClick={closeMobileMenu}>
                {t.courses}
              </Link>
            </li>
            <li>
              <Link href="/avatar_creation" onClick={closeMobileMenu}>
                {t.avatarCreation}
              </Link>
            </li>
            <li>
              <Link href="/video" onClick={closeMobileMenu}>
                {t.video}
              </Link>
            </li>
            <li>
              <Link href="/video_simulator" onClick={closeMobileMenu}>
                {t.videoSimulator}
              </Link>
            </li>
            <li>
              <Link href="/support" onClick={closeMobileMenu}>
                {t.support}
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                {t.logout}
              </button>
            </li>
            <li>
              <button
                type="button"
                className={styles.languageButton}
                onClick={() => {
                  setIsLanguageModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                aria-label={t.languageSelector}
              >
                <span className={language === "en" ? styles.activeLang : ""}>
                  EN
                </span>
                <span className={styles.divider}>|</span>
                <span className={language === "fr" ? styles.activeLang : ""}>
                  FR
                </span>
              </button>
            </li>
            <li>
              <Link href="/profile" className={styles.avatarLink} onClick={closeMobileMenu}>
                <Image
                  src="/pics/user_avatar.jpeg"
                  alt={t.userAvatar}
                  width={36}
                  height={36}
                  className={styles.userAvatar}
                />
              </Link>
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

export default DashboardNavBar;