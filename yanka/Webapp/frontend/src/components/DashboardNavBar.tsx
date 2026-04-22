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

  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];

  const handleLogout = async () => {
    await signOut();
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
      <header
        className={`${styles.navbar} ${isScrolled ? styles.scrollDown : ""}`}
      >
        <Link href="/dashboard" className={styles.logoContainer}>
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

        <nav>
          <ul>
            <li>
              <Link href="/courses">{t.courses}</Link>
            </li>
            <li>
              <Link href="/avatar_creation">{t.avatarCreation}</Link>
            </li>
            <li>
              <Link href="/video">{t.video}</Link>
            </li>
            <li>
              <Link href="/support">{t.support}</Link>
            </li>
            <li>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                {t.logout}
              </button>
            </li>
            <li>
              <Image
                src="/pics/globe.jpeg"
                alt={t.languageSelector}
                width={28}
                height={28}
                className={styles.globeIcon}
                onClick={() => setIsLanguageModalOpen(true)}
              />
            </li>
            <li>
              <Link href="/profile" className={styles.avatarLink}>
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