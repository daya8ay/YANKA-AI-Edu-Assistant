"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./Footer.module.css";

const translations = {
  en: {
    tagline:
      "AI that transforms how you learn—faster, smarter, limitless. Unlock your full potential with Yanka AI",

    features: "Features",
    featureLinks: {
      video: "AI Video Generation",
      avatar: "Real-Time AI Avatars",
      training: "AI Training Programs",
      courses: "Wide Range of Courses",
      data: "AI Data Analysis & Visualization",
      thesis: "Thesis & Dissertation Builder",
    },

    serve: "Who We Serve",
    serveLinks: {
      students: "Students",
      researchers: "Researchers",
      teachers: "Teachers & Institutions",
      creators: "Course Creators",
      universities: "Universities",
    },

    resources: "Resources",
    resourceLinks: {
      pricing: "Pricing",
      integration: "Integration",
      community: "Community & Blog",
      integrity: "Academic Integrity",
      support: "Support Center",
    },

    company: "Company",
    companyLinks: {
      about: "About",
      vision: "Vision & Ethics",
      partnerships: "Partnerships",
      affiliates: "Affiliates",
      careers: "Careers",
    },

    copyright:
      "© 2025 Yanka — An Academic AI Platform by Kimuntu Power Inc.",

    privacy: "Privacy Policy",
    terms: "Terms and Conditions",
    licensing: "Licensing",
  },

  fr: {
    tagline:
      "Une IA qui transforme votre façon d’apprendre — plus rapide, plus intelligente, sans limites. Libérez votre plein potentiel avec Yanka AI",

    features: "Fonctionnalités",
    featureLinks: {
      video: "Génération vidéo par IA",
      avatar: "Avatars IA en temps réel",
      training: "Programmes de formation IA",
      courses: "Large gamme de cours",
      data: "Analyse et visualisation de données IA",
      thesis: "Créateur de thèse et dissertation",
    },

    serve: "Qui nous servons",
    serveLinks: {
      students: "Étudiants",
      researchers: "Chercheurs",
      teachers: "Enseignants et institutions",
      creators: "Créateurs de cours",
      universities: "Universités",
    },

    resources: "Ressources",
    resourceLinks: {
      pricing: "Tarifs",
      integration: "Intégration",
      community: "Communauté et blog",
      integrity: "Intégrité académique",
      support: "Centre de support",
    },

    company: "Entreprise",
    companyLinks: {
      about: "À propos",
      vision: "Vision et éthique",
      partnerships: "Partenariats",
      affiliates: "Affiliés",
      careers: "Carrières",
    },

    copyright:
      "© 2025 Yanka — Une plateforme académique IA par Kimuntu Power Inc.",

    privacy: "Politique de confidentialité",
    terms: "Conditions générales",
    licensing: "Licence",
  },
};

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

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

          <p className={styles.tagline}>{t.tagline}</p>

          {/* Social Icons */}
          <div className={styles.socialLinks}>
            <a
              href="https://www.instagram.com/yanka.ai_official"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/pics/insta.jpeg" alt="Instagram" width={28} height={28} />
            </a>

            <a
              href="https://www.facebook.com/yankaai?ref=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/pics/fbcopy.jpeg" alt="Facebook" width={28} height={28} />
            </a>

            <a
              href="https://www.linkedin.com/company/yanka-ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/pics/linkedincopy.jpeg"
                alt="LinkedIn"
                width={28}
                height={28}
              />
            </a>
          </div>
        </div>

        <div className={styles.linkColumns}>
          {/* Features */}
          <div className={styles.column}>
            <Link href="/features" className={styles.columnTitleLink}>
              <h4>{t.features}</h4>
            </Link>
            <ul>
              <li><Link href="/features#video">{t.featureLinks.video}</Link></li>
              <li><Link href="/features#avatar">{t.featureLinks.avatar}</Link></li>
              <li><Link href="/features#training">{t.featureLinks.training}</Link></li>
              <li><Link href="/features#courses">{t.featureLinks.courses}</Link></li>
              <li><Link href="/features#data">{t.featureLinks.data}</Link></li>
              <li><Link href="/features#thesis">{t.featureLinks.thesis}</Link></li>
            </ul>
          </div>

          {/* Who We Serve */}
          <div className={styles.column}>
            <Link href="/solutions" className={styles.columnTitleLink}>
              <h4>{t.serve}</h4>
            </Link>
            <ul>
              <li><Link href="/solutions#students">{t.serveLinks.students}</Link></li>
              <li><Link href="/solutions#researchers">{t.serveLinks.researchers}</Link></li>
              <li><Link href="/solutions#teachers">{t.serveLinks.teachers}</Link></li>
              <li><Link href="/solutions#creators">{t.serveLinks.creators}</Link></li>
              <li><Link href="/solutions#universities">{t.serveLinks.universities}</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className={styles.column}>
            <h4>{t.resources}</h4>
            <ul>
              <li><Link href="/#pricing">{t.resourceLinks.pricing}</Link></li>
              <li><Link href="#">{t.resourceLinks.integration}</Link></li>
              <li><Link href="#">{t.resourceLinks.community}</Link></li>
              <li><Link href="#">{t.resourceLinks.integrity}</Link></li>
              <li><Link href="/support">{t.resourceLinks.support}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className={styles.column}>
            <h4>{t.company}</h4>
            <ul>
              <li><Link href="/about">{t.companyLinks.about}</Link></li>
              <li><Link href="/about#vision">{t.companyLinks.vision}</Link></li>
              <li><Link href="#">{t.companyLinks.partnerships}</Link></li>
              <li><Link href="#">{t.companyLinks.affiliates}</Link></li>
              <li><Link href="#">{t.companyLinks.careers}</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className={styles.footerBottom}>
        <p>{t.copyright}</p>
        <div className={styles.bottomLinks}>
          <Link href="/privacy">{t.privacy}</Link>
          <Link href="/terms">{t.terms}</Link>
          <Link href="#">{t.licensing}</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;