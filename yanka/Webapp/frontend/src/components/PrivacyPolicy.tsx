"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./PrivacyPolicy.module.css";

const translations = {
  en: {
    home: "Home",
    breadcrumb: "Privacy Policy",
    badge: "Yanka AI Legal",
    title: "Privacy Policy",
    heroText:
      "At Yanka AI, we are committed to protecting your privacy and handling your data responsibly. This Privacy Policy explains what information we collect, how we use it, and the choices you have while using our platform.",
    effectiveDate: "Effective Date: February 23, 2026",
    lastUpdated: "Last Updated: February 23, 2026",
    version: "Version 2.0",

    onThisPage: "On this page",
    sidebarLinks: {
      commitment: "1. Our Commitment to Privacy",
      collection: "2. Information We Collect",
      usage: "3. How We Use Your Information",
      aiData: "4. AI, Avatars & Learning Data",
      sharing: "5. Data Sharing & Disclosure",
      transfers: "6. International Data Transfers",
      rights: "7. Your Rights",
      retention: "8. Data Retention",
      security: "9. Security Measures",
      children: "10. Children & Minors",
      contact: "11. Contact & Complaints",
      updates: "12. Policy Updates",
    },

    intro:
      "Yanka AI is committed to privacy by design, data minimization, and strong security practices. We do not sell personal data, and we do not use your private content to train external AI models without your explicit informed consent.",

    commitmentTitle: "1. Our Commitment to Privacy",
    commitmentP1:
      "At Yanka AI, privacy is a core value, not an afterthought. Our platform is built on three foundational principles:",
    commitmentBullets: [
      {
        strong: "Privacy by Design:",
        text: " privacy protections are built into every feature from the ground up.",
      },
      {
        strong: "Data Minimization:",
        text: " we collect only what is strictly necessary to provide our services.",
      },
      {
        strong: "Security First:",
        text: " industry-leading encryption and access controls protect all data.",
      },
    ],
    commitmentP2:
      "We will never sell your personal data. We will never use your private content to train external AI models without your explicit, informed consent.",

    collectionTitle: "2. Information We Collect",
    collection21: "2.1 Information You Provide",
    collection21Bullets: [
      "Name, email address, and username",
      "Account credentials and profile information",
      "Payment and billing information processed by secure third-party gateways",
      "Content you create or upload, such as courses, videos, scripts, documents, and research",
      "Communications with Yanka AI, including support tickets, feedback, and survey responses",
    ],
    collection22: "2.2 AI-Generated & Educational Content",
    collection22Bullets: [
      "Text prompts, scripts, and course outlines you provide",
      "AI-generated videos, avatars, voices, quizzes, and courses",
      "Academic content such as notes, drafts, thesis materials, and research data",
    ],
    collection22ImportantLabel: "Important:",
    collection22ImportantText:
      " You own all content you create on Yanka AI. We do not sell your personal or educational content to any third party.",
    collection23: "2.3 Automatically Collected Technical Data",
    collection23Bullets: [
      "Device type, browser type, and operating system",
      "IP address used for security, fraud prevention, and regional compliance",
      "Usage data such as session duration, accessed features, and navigation patterns",
      "Platform analytics like content views, quiz completion, and video engagement",
    ],
    collection24: "2.4 Cookies & Tracking Technologies",
    collection24P1: "We use cookies and similar technologies to:",
    collection24Bullets: [
      "Maintain secure login sessions",
      "Personalize content recommendations",
      "Analyze and optimize platform performance",
      "Enable marketplace and payment functionality",
    ],

    usageTitle: "3. How We Use Your Information",
    usageP1: "Yanka AI uses your information exclusively to:",
    usageBullets: [
      "Operate and deliver the Yanka AI platform and its services",
      "Power AI learning, avatar generation, and content creation tools",
      "Enable course publishing, marketplace sales, and creator monetization",
      "Process payments, subscriptions, and revenue distributions",
      "Improve educational quality, platform features, and AI accuracy",
      "Ensure platform security and prevent fraud or abuse",
      "Fulfill legal obligations and regulatory compliance requirements",
      "Communicate service updates, security notices, and support responses",
    ],
    usageP2:
      "We do not use your personal data to train external AI models without your explicit consent. We do not sell your data or share it for advertising purposes.",

    aiDataTitle: "4. AI, Avatars & Learning Data",
    aiDataBullets: [
      "AI outputs are generated based solely on your inputs and selected content",
      "AI avatars do not represent or impersonate real people without explicit authorization",
      "Voice cloning is strictly opt-in and can be revoked at any time",
      "AI does not make legal, medical, financial, or other high-stakes decisions on your behalf",
      "AI-generated content is marked with transparency metadata",
      "You retain responsibility for reviewing and validating AI-generated content before use",
    ],

    sharingTitle: "5. Data Sharing & Disclosure",
    sharing51: "5.1 Service Providers",
    sharing51P:
      "We may share limited, anonymized, or pseudonymized data with trusted third-party providers for cloud hosting, payment processing, analytics, and customer support.",
    sharing52: "5.2 Legal Requirements",
    sharing52P:
      "Yanka AI may disclose data only when legally required, such as in response to a court order, regulatory investigation, or enforcement of our Terms & Conditions.",
    sharing53: "5.3 Business Transfers",
    sharing53P:
      "In the event of a merger, acquisition, or restructuring, user data may be transferred with appropriate safeguards and user notification.",

    transfersTitle: "6. International Data Transfers",
    transfersP:
      "Yanka AI operates globally, and your data may be processed in different countries. All international data transfers are conducted with appropriate legal safeguards, including Standard Contractual Clauses where required and data processing agreements with sub-processors.",

    rightsTitle: "7. Your Rights",
    rights71: "7.1 GDPR Rights",
    rights71Bullets: [
      "Right to access",
      "Right to correction",
      "Right to erasure",
      "Right to restriction",
      "Right to portability",
      "Right to object",
      "Right to withdraw consent",
    ],
    rights72: "7.2 CCPA/CPRA Rights",
    rights72Bullets: [
      "Right to know what personal data is collected, used, and shared",
      "Right to delete",
      "Right to opt-out",
      "Right to non-discrimination",
      "Right to correct inaccurate personal information",
    ],
    rights73: "7.3 How to Exercise Your Rights",
    rights73P:
      "Submit privacy requests through your account privacy settings dashboard or by contacting the Yanka AI privacy team. Identity verification may be required.",

    retentionTitle: "8. Data Retention",
    retentionBullets: [
      "Active accounts: retained as long as needed to provide services",
      "Closed accounts: deleted or anonymized within 90 days of closure",
      "Financial records: retained for 7 years as required by law",
      "AI-generated content: deleted upon user request unless legally required",
      "Security logs: retained for 12 months for fraud prevention and audit purposes",
    ],

    securityTitle: "9. Security Measures",
    securityBullets: [
      "TLS 1.3 encryption for data in transit",
      "AES-256 encryption for data at rest",
      "Role-based access with multi-factor authentication",
      "Secure cloud infrastructure with strong compliance practices",
      "Regular security testing and privacy impact assessments",
    ],
    securityP:
      "No system is 100% secure, but Yanka AI takes strong measures to protect user information and will notify affected users of data breaches where required by law.",

    childrenTitle: "10. Children & Minors",
    childrenP:
      "Yanka AI is not intended for children under 13 without parental or institutional supervision. For institutional deployments involving minors, enhanced consent workflows, safety protections, and educational-use restrictions may apply.",

    contactTitle: "11. Contact & Complaints",
    contactP:
      "For privacy questions, complaints, or requests, users may contact the Yanka AI privacy team through designated support channels and account settings.",

    updatesTitle: "12. Policy Updates",
    updatesP:
      "We may update this Privacy Policy to reflect legal, technical, or platform changes. Material updates will be communicated through email, platform alerts, or updated notices on the website.",
  },

  fr: {
    home: "Accueil",
    breadcrumb: "Politique de confidentialité",
    badge: "Juridique Yanka AI",
    title: "Politique de confidentialité",
    heroText:
      "Chez Yanka AI, nous nous engageons à protéger votre vie privée et à gérer vos données de manière responsable. Cette politique de confidentialité explique quelles informations nous collectons, comment nous les utilisons et les choix dont vous disposez lorsque vous utilisez notre plateforme.",
    effectiveDate: "Date d’entrée en vigueur : 23 février 2026",
    lastUpdated: "Dernière mise à jour : 23 février 2026",
    version: "Version 2.0",

    onThisPage: "Sur cette page",
    sidebarLinks: {
      commitment: "1. Notre engagement en matière de confidentialité",
      collection: "2. Informations que nous collectons",
      usage: "3. Comment nous utilisons vos informations",
      aiData: "4. IA, avatars et données d’apprentissage",
      sharing: "5. Partage et divulgation des données",
      transfers: "6. Transferts internationaux de données",
      rights: "7. Vos droits",
      retention: "8. Conservation des données",
      security: "9. Mesures de sécurité",
      children: "10. Enfants et mineurs",
      contact: "11. Contact et réclamations",
      updates: "12. Mises à jour de la politique",
    },

    intro:
      "Yanka AI s’engage à appliquer les principes de protection de la vie privée dès la conception, de minimisation des données et de sécurité renforcée. Nous ne vendons pas les données personnelles et nous n’utilisons pas votre contenu privé pour entraîner des modèles d’IA externes sans votre consentement explicite et éclairé.",

    commitmentTitle: "1. Notre engagement en matière de confidentialité",
    commitmentP1:
      "Chez Yanka AI, la confidentialité est une valeur fondamentale, et non une réflexion secondaire. Notre plateforme repose sur trois principes fondateurs :",
    commitmentBullets: [
      {
        strong: "Confidentialité dès la conception :",
        text: " les protections de la vie privée sont intégrées à chaque fonctionnalité dès le départ.",
      },
      {
        strong: "Minimisation des données :",
        text: " nous collectons uniquement les données strictement nécessaires à la fourniture de nos services.",
      },
      {
        strong: "Sécurité avant tout :",
        text: " un chiffrement de pointe et des contrôles d’accès protègent toutes les données.",
      },
    ],
    commitmentP2:
      "Nous ne vendrons jamais vos données personnelles. Nous n’utiliserons jamais votre contenu privé pour entraîner des modèles d’IA externes sans votre consentement explicite et éclairé.",

    collectionTitle: "2. Informations que nous collectons",
    collection21: "2.1 Informations que vous fournissez",
    collection21Bullets: [
      "Nom, adresse e-mail et nom d’utilisateur",
      "Identifiants de compte et informations de profil",
      "Informations de paiement et de facturation traitées par des passerelles tierces sécurisées",
      "Contenu que vous créez ou téléversez, tel que des cours, vidéos, scripts, documents et travaux de recherche",
      "Communications avec Yanka AI, y compris les tickets d’assistance, les retours et les réponses aux enquêtes",
    ],
    collection22: "2.2 Contenu éducatif et généré par l’IA",
    collection22Bullets: [
      "Invites textuelles, scripts et plans de cours que vous fournissez",
      "Vidéos, avatars, voix, quiz et cours générés par l’IA",
      "Contenu académique tel que notes, brouillons, documents de thèse et données de recherche",
    ],
    collection22ImportantLabel: "Important :",
    collection22ImportantText:
      " Vous restez propriétaire de tout le contenu que vous créez sur Yanka AI. Nous ne vendons pas votre contenu personnel ou éducatif à des tiers.",
    collection23: "2.3 Données techniques collectées automatiquement",
    collection23Bullets: [
      "Type d’appareil, type de navigateur et système d’exploitation",
      "Adresse IP utilisée à des fins de sécurité, de prévention de la fraude et de conformité régionale",
      "Données d’utilisation telles que la durée des sessions, les fonctionnalités consultées et les habitudes de navigation",
      "Analyses de plateforme comme les vues de contenu, les quiz terminés et l’engagement vidéo",
    ],
    collection24: "2.4 Cookies et technologies de suivi",
    collection24P1:
      "Nous utilisons des cookies et des technologies similaires pour :",
    collection24Bullets: [
      "Maintenir des sessions de connexion sécurisées",
      "Personnaliser les recommandations de contenu",
      "Analyser et optimiser les performances de la plateforme",
      "Activer les fonctionnalités de marketplace et de paiement",
    ],

    usageTitle: "3. Comment nous utilisons vos informations",
    usageP1:
      "Yanka AI utilise vos informations exclusivement pour :",
    usageBullets: [
      "Exploiter et fournir la plateforme Yanka AI et ses services",
      "Alimenter les outils d’apprentissage par IA, de génération d’avatars et de création de contenu",
      "Permettre la publication de cours, les ventes sur la marketplace et la monétisation des créateurs",
      "Traiter les paiements, abonnements et distributions de revenus",
      "Améliorer la qualité éducative, les fonctionnalités de la plateforme et la précision de l’IA",
      "Garantir la sécurité de la plateforme et prévenir la fraude ou les abus",
      "Respecter les obligations légales et les exigences réglementaires",
      "Communiquer les mises à jour de service, les avis de sécurité et les réponses du support",
    ],
    usageP2:
      "Nous n’utilisons pas vos données personnelles pour entraîner des modèles d’IA externes sans votre consentement explicite. Nous ne vendons pas vos données et ne les partageons pas à des fins publicitaires.",

    aiDataTitle: "4. IA, avatars et données d’apprentissage",
    aiDataBullets: [
      "Les résultats de l’IA sont générés uniquement à partir de vos entrées et du contenu sélectionné",
      "Les avatars IA ne représentent ni n’imitent de vraies personnes sans autorisation explicite",
      "Le clonage vocal est strictement facultatif et peut être révoqué à tout moment",
      "L’IA ne prend pas à votre place de décisions juridiques, médicales, financières ou autres décisions à fort enjeu",
      "Le contenu généré par l’IA est marqué avec des métadonnées de transparence",
      "Vous restez responsable de la relecture et de la validation du contenu généré par l’IA avant son utilisation",
    ],

    sharingTitle: "5. Partage et divulgation des données",
    sharing51: "5.1 Prestataires de services",
    sharing51P:
      "Nous pouvons partager des données limitées, anonymisées ou pseudonymisées avec des prestataires tiers de confiance pour l’hébergement cloud, le traitement des paiements, l’analyse et le support client.",
    sharing52: "5.2 Exigences légales",
    sharing52P:
      "Yanka AI peut divulguer des données uniquement lorsque la loi l’exige, notamment en réponse à une décision de justice, une enquête réglementaire ou l’application de nos Conditions générales.",
    sharing53: "5.3 Transferts d’entreprise",
    sharing53P:
      "En cas de fusion, acquisition ou restructuration, les données des utilisateurs peuvent être transférées avec des garanties appropriées et une notification aux utilisateurs.",

    transfersTitle: "6. Transferts internationaux de données",
    transfersP:
      "Yanka AI opère à l’échelle mondiale et vos données peuvent être traitées dans différents pays. Tous les transferts internationaux de données sont réalisés avec des garanties juridiques appropriées, y compris les Clauses contractuelles types lorsque cela est requis, ainsi que des accords de traitement des données avec les sous-traitants.",

    rightsTitle: "7. Vos droits",
    rights71: "7.1 Droits RGPD",
    rights71Bullets: [
      "Droit d’accès",
      "Droit de rectification",
      "Droit à l’effacement",
      "Droit à la limitation",
      "Droit à la portabilité",
      "Droit d’opposition",
      "Droit de retirer votre consentement",
    ],
    rights72: "7.2 Droits CCPA/CPRA",
    rights72Bullets: [
      "Droit de savoir quelles données personnelles sont collectées, utilisées et partagées",
      "Droit à la suppression",
      "Droit de refus",
      "Droit à la non-discrimination",
      "Droit de corriger des informations personnelles inexactes",
    ],
    rights73: "7.3 Comment exercer vos droits",
    rights73P:
      "Soumettez vos demandes liées à la confidentialité via le tableau de bord des paramètres de confidentialité de votre compte ou en contactant l’équipe confidentialité de Yanka AI. Une vérification d’identité peut être requise.",

    retentionTitle: "8. Conservation des données",
    retentionBullets: [
      "Comptes actifs : conservés aussi longtemps que nécessaire pour fournir les services",
      "Comptes fermés : supprimés ou anonymisés dans les 90 jours suivant la fermeture",
      "Documents financiers : conservés pendant 7 ans conformément à la loi",
      "Contenu généré par l’IA : supprimé à la demande de l’utilisateur sauf obligation légale contraire",
      "Journaux de sécurité : conservés pendant 12 mois à des fins de prévention de la fraude et d’audit",
    ],

    securityTitle: "9. Mesures de sécurité",
    securityBullets: [
      "Chiffrement TLS 1.3 pour les données en transit",
      "Chiffrement AES-256 pour les données au repos",
      "Contrôle d’accès basé sur les rôles avec authentification multifacteur",
      "Infrastructure cloud sécurisée avec de solides pratiques de conformité",
      "Tests de sécurité réguliers et évaluations d’impact sur la vie privée",
    ],
    securityP:
      "Aucun système n’est sécurisé à 100 %, mais Yanka AI met en place des mesures fortes pour protéger les informations des utilisateurs et notifiera les personnes concernées en cas de violation des données lorsque la loi l’exige.",

    childrenTitle: "10. Enfants et mineurs",
    childrenP:
      "Yanka AI n’est pas destiné aux enfants de moins de 13 ans sans supervision parentale ou institutionnelle. Pour les déploiements institutionnels impliquant des mineurs, des flux de consentement renforcés, des protections de sécurité et des restrictions d’usage éducatif peuvent s’appliquer.",

    contactTitle: "11. Contact et réclamations",
    contactP:
      "Pour toute question, réclamation ou demande relative à la confidentialité, les utilisateurs peuvent contacter l’équipe confidentialité de Yanka AI via les canaux de support désignés et les paramètres de leur compte.",

    updatesTitle: "12. Mises à jour de la politique",
    updatesP:
      "Nous pouvons mettre à jour cette politique de confidentialité afin de refléter des changements juridiques, techniques ou liés à la plateforme. Les mises à jour importantes seront communiquées par e-mail, alertes sur la plateforme ou avis actualisés sur le site web.",
  },
};

const PrivacyPolicy: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className={styles.privacyPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGlow}></div>

        <div className={styles.heroContent}>
          <div className={styles.breadcrumb}>
            <Link href="/">{t.home}</Link> / {t.breadcrumb}
          </div>

          <span className={styles.badge}>{t.badge}</span>

          <h1>{t.title}</h1>

          <p className={styles.heroText}>{t.heroText}</p>

          <div className={styles.metaRow}>
            <span>{t.effectiveDate}</span>
            <span>{t.lastUpdated}</span>
            <span>{t.version}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.contentSection}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <h3>{t.onThisPage}</h3>
            <ul>
              <li><a href="#commitment">{t.sidebarLinks.commitment}</a></li>
              <li><a href="#collection">{t.sidebarLinks.collection}</a></li>
              <li><a href="#usage">{t.sidebarLinks.usage}</a></li>
              <li><a href="#ai-data">{t.sidebarLinks.aiData}</a></li>
              <li><a href="#sharing">{t.sidebarLinks.sharing}</a></li>
              <li><a href="#transfers">{t.sidebarLinks.transfers}</a></li>
              <li><a href="#rights">{t.sidebarLinks.rights}</a></li>
              <li><a href="#retention">{t.sidebarLinks.retention}</a></li>
              <li><a href="#security">{t.sidebarLinks.security}</a></li>
              <li><a href="#children">{t.sidebarLinks.children}</a></li>
              <li><a href="#contact">{t.sidebarLinks.contact}</a></li>
              <li><a href="#updates">{t.sidebarLinks.updates}</a></li>
            </ul>
          </div>
        </aside>

        {/* Content */}
        <div className={styles.mainContent}>
          <div className={styles.introCard}>
            <p>{t.intro}</p>
          </div>

          <div className={styles.card} id="commitment">
            <h2>{t.commitmentTitle}</h2>
            <p>{t.commitmentP1}</p>
            <ul>
              {t.commitmentBullets.map((item, index) => (
                <li key={index}>
                  <strong>{item.strong}</strong>
                  {item.text}
                </li>
              ))}
            </ul>
            <p>{t.commitmentP2}</p>
          </div>

          <div className={styles.card} id="collection">
            <h2>{t.collectionTitle}</h2>

            <h3>{t.collection21}</h3>
            <ul>
              {t.collection21Bullets.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3>{t.collection22}</h3>
            <ul>
              {t.collection22Bullets.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p>
              <strong>{t.collection22ImportantLabel}</strong>
              {t.collection22ImportantText}
            </p>

            <h3>{t.collection23}</h3>
            <ul>
              {t.collection23Bullets.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3>{t.collection24}</h3>
            <p>{t.collection24P1}</p>
            <ul>
              {t.collection24Bullets.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.card} id="usage">
            <h2>{t.usageTitle}</h2>
            <p>{t.usageP1}</p>
            <ul>
              {t.usageBullets.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p>{t.usageP2}</p>
          </div>

          <div className={styles.card} id="ai-data">
            <h2>{t.aiDataTitle}</h2>
            <ul>
              {t.aiDataBullets.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.card} id="sharing">
            <h2>{t.sharingTitle}</h2>

            <h3>{t.sharing51}</h3>
            <p>{t.sharing51P}</p>

            <h3>{t.sharing52}</h3>
            <p>{t.sharing52P}</p>

            <h3>{t.sharing53}</h3>
            <p>{t.sharing53P}</p>
          </div>

          <div className={styles.card} id="transfers">
            <h2>{t.transfersTitle}</h2>
            <p>{t.transfersP}</p>
          </div>

          <div className={styles.card} id="rights">
            <h2>{t.rightsTitle}</h2>

            <h3>{t.rights71}</h3>
            <ul>
              {t.rights71Bullets.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3>{t.rights72}</h3>
            <ul>
              {t.rights72Bullets.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3>{t.rights73}</h3>
            <p>{t.rights73P}</p>
          </div>

          <div className={styles.card} id="retention">
            <h2>{t.retentionTitle}</h2>
            <ul>
              {t.retentionBullets.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.card} id="security">
            <h2>{t.securityTitle}</h2>
            <ul>
              {t.securityBullets.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p>{t.securityP}</p>
          </div>

          <div className={styles.card} id="children">
            <h2>{t.childrenTitle}</h2>
            <p>{t.childrenP}</p>
          </div>

          <div className={styles.card} id="contact">
            <h2>{t.contactTitle}</h2>
            <p>{t.contactP}</p>
          </div>

          <div className={styles.card} id="updates">
            <h2>{t.updatesTitle}</h2>
            <p>{t.updatesP}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;