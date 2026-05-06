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
    dashboard: "Dashboard",
    about: "About",
    promise: "Promise",
    mission: "Mission",
    vision: "Vision",
    research: "Research",
    courses: "Marketplace",
    avatarCreation: "Avatar Creation",
    video: "Video Generation",
    videoSimulator: "Video Simulator",
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
    dashboard: "Tableau de bord",
    about: "À propos",
    promise: "Promesse",
    mission: "Mission",
    vision: "Vision",
    research: "Recherche",
    courses: "Marché",
    avatarCreation: "Création d’avatar",
    video: "Génération de vidéos",
    videoSimulator: "Simulateur vidéo",
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleLogout = async () => {
    await signOut();
    closeMobileMenu();
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
              width={110}
              height={90}
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
              <Link href="/dashboard" onClick={closeMobileMenu}>
                {t.dashboard}
              </Link>
            </li>

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
                <li>
                  <Link href="/research" onClick={closeMobileMenu}>
                    {t.research}
                  </Link>
                </li>
              </ul>
            </li>

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

            {/* <li>
              <Link href="/video_simulator" onClick={closeMobileMenu}>
                {t.videoSimulator}
              </Link>
            </li> */}

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
                  closeMobileMenu();
                }}
                aria-label={t.languageSelector}
              >
                <span className={language === "en" ? styles.activeLang : ""}>EN</span>
                <span className={styles.divider}>|</span>
                <span className={language === "fr" ? styles.activeLang : ""}>FR</span>
              </button>
            </li>

            <li>
              <Link href="/profile" className={styles.avatarLink} onClick={closeMobileMenu}>
                <Image
                  src="/pics/user_avatar.jpeg"
                  alt={t.userAvatar}
                  width={42}
                  height={42}
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