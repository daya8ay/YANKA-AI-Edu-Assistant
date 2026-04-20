"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./page.module.css";

const translations = {
  en: {
    heroTitle: "Reimagining Education with",
    heroSub:
      "Yanka AI unifies learning, research, and creativity into one intelligent ecosystem built to empower students and educators worldwide.",
    getStarted: "Get Started",
    exploreFeatures: "Explore Features",

    aboutTitle: "Building the Future of Learning",
    aboutText:
      "We are more than a tool, it's a lifelong academic companion. Our mission is to empower students and researchers everywhere with intelligent, ethical, and inclusive AI solutions.",
    readMore: "Read More",

    featuresTitle: "What We Offer",
    featureCards: [
      {
        title: "AI Video Generation",
        description:
          "Turn notes, lectures, and research into structured educational videos instantly.",
      },
      {
        title: "Real-Time AI Avatar Creation",
        description:
          "Create multilingual AI avatars with customizable voice and delivery.",
      },
      {
        title: "AI-Designed Training Programs & Workshops",
        description:
          "Generate complete training programs, lesson plans, and assessments with AI.",
      },
      {
        title: "Advanced Academic Capabilities",
        description:
          "Research tools, thesis support, data analysis, and academic integrity protection.",
      },
    ],
    exploreMore: "Explore More →",

    suiteTitle: "Academic & School Suite",
    suiteSub:
      "Your all-in-one AI ecosystem for learning, research & academic growth.",
    suiteCards: [
      {
        title: "🏫 Smart Learning Hub",
        text: "Study Planner • Subject Tutors • Homework Help • Summaries",
      },
      {
        title: "🎓 Research Suite",
        text: "Thesis Builder • Lit Reviews • Academic Writing • Data Analysis",
      },
      {
        title: "🎤 AI Presentations",
        text: "Defense Prep • Slide Decks • Avatar Videos • Multilingual Explainables",
      },
      {
        title: "🌐 Marketplace",
        text: "Create, share & sell AI-powered courses in 100+ languages",
      },
      {
        title: "📊 Institutional Insights",
        text: "Dashboards • Analytics • LMS Integration • White-Label Suites",
      },
      {
        title: "🔒 Integrity & Ethics",
        text: "Plagiarism Shield • Citation Fixer • Secure Data • Compliance",
      },
    ],
    suiteButton: "Explore Who Yanka AI Serves",

    pricingTitle: "Choose Your Plan",
    pricingSub:
      "Flexible plans designed for every learner, from students to institutions.",
    plans: {
      learn: {
        title: "Learn",
        price: "Free",
        features: [
          "AI chatbot access",
          "Unlimited AI video creation",
          "Study planner & progress tracker",
          "Limited daily questions",
          "Access to community Q&A",
        ],
        cta: "Start Free",
      },
      plus: {
        title: "Plus",
        price: "$9.99/mo",
        features: [
          "Unlimited AI tutor sessions",
          "AI essay & assignment assistant",
          "Research & Thesis Builder (standard mode)",
          "AI avatars & video creation",
          "Advanced study analytics",
        ],
        cta: "Upgrade to Plus",
      },
      scholar: {
        title: "Scholar",
        price: "$24.99/mo",
        badge: "Recommended",
        features: [
          "All Plus features",
          "Full Academic & Research Suite",
          "Collaboration tools",
          "Priority support",
          "Document cloud backup",
        ],
        cta: "Upgrade to Scholar",
      },
      institution: {
        title: "Institution",
        price: "Starting at $2,499/mo",
        features: [
          "Full academic + learning ecosystem",
          "Custom branding",
          "API & LMS integration",
          "Institutional analytics",
          "Admin control & compliance",
        ],
        cta: "Request Institutional Demo",
      },
    },

    marketplaceTitle: "Marketplace",
    marketplaceDesc:
      "Explore a curated collection of skill-building courses from expert creators. Learn what matters, level up thoughtfully, and unlock your potential.",
    searchPlaceholder: "Search for courses",
    viewAllCourses: "View All Courses →",
    courses: [
      {
        title: "AI for Everyone",
        teacher: "Dr. Schan Gya",
        summary:
          "A beginner-friendly introduction to artificial intelligence, machine learning, and how AI is shaping industries today.",
        price: "$30.99",
        img: "/pics/ai.jpeg",
        tag: "Bestseller",
        rating: "4.8",
        reviews: "2,145 ratings",
      },
      {
        title: "Beginners Spanish",
        teacher: "Prof. Rujeta Morales",
        summary:
          "Build confidence in everyday Spanish through practical vocabulary, speaking exercises, and real-world conversations.",
        price: "$20.99",
        img: "/pics/spanish.jpeg",
        tag: "Popular",
        rating: "4.6",
        reviews: "1,084 ratings",
      },
      {
        title: "Data Science",
        teacher: "Dr. Rolan Peters",
        summary:
          "Learn data analysis, visualization, statistics, and predictive modeling using modern tools and practical datasets.",
        price: "$30.99",
        img: "/pics/data.jpeg",
        tag: "Top Rated",
        rating: "4.7",
        reviews: "1,732 ratings",
      },
      {
        title: "Project Management",
        teacher: "Prof. Sach Mehra",
        summary:
          "Master planning, stakeholder communication, agile workflows, and execution strategies for successful projects.",
        price: "$25.99",
        img: "/pics/pm.jpeg",
        tag: "Bestseller",
        rating: "4.5",
        reviews: "963 ratings",
      },
      {
        title: "Digital Marketing",
        teacher: "Dami Cole",
        summary:
          "Understand branding, social media strategy, SEO, content planning, and campaign performance measurement.",
        price: "$35.99",
        img: "/pics/marketing.jpeg",
        tag: "Trending",
        rating: "4.7",
        reviews: "1,268 ratings",
      },
      {
        title: "English Literature",
        teacher: "Prof. Elena Brooks",
        summary:
          "Dive into classic and modern literary works while strengthening analysis, writing, and interpretation skills.",
        price: "$20.99",
        img: "/pics/english.jpeg",
        tag: "Recommended",
        rating: "4.4",
        reviews: "812 ratings",
      },
    ],

    learnersTitle: "From Our Learners",
    learnersSub:
      "Thoughts, insights, and stories from our learners and educators.",
    posts: [
      {
        user: "Emma Johnson",
        handle: "@emma_learning",
        text: "Yanka AI helped me summarize 40 pages of research into key insights in minutes. Game changer for thesis writing!",
        time: "2h ago",
      },
      {
        user: "Liam Carter",
        handle: "@liam_studies",
        text: "The AI tutor adjusts perfectly to my pace — it feels like a personal mentor guiding me through complex topics.",
        time: "5h ago",
      },
      {
        user: "Sophia Lee",
        handle: "@sophia_reads",
        text: "The new video lesson feature is amazing! It made my presentations more interactive and fun.",
        time: "1d ago",
      },
      {
        user: "Ethan Wright",
        handle: "@ethan_creates",
        text: "Created my first AI-assisted research draft today using Yanka AI. It’s efficient, intuitive, and powerful!",
        time: "3d ago",
      },
      {
        user: "Olivia Brown",
        handle: "@olivia_inspires",
        text: "Education should be intelligent, accessible, and inclusive — that’s exactly what Yanka AI is building.",
        time: "1w ago",
      },
    ],
    registerNow: "Register Now",

    partnersTitle: "Our Partners",

    contactTitle: "Contact Us",
    contactSub:
      "Have questions? We're here to help you learn, grow, and succeed.",
    name: "Name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    namePlaceholder: "Enter your name",
    emailPlaceholder: "Enter your email",
    phonePlaceholder: "Enter your phone number",
    messagePlaceholder: "Write your message...",
    submit: "Submit",
  },

  fr: {
    heroTitle: "Réinventer l'éducation avec",
    heroSub:
      "Yanka AI unifie l’apprentissage, la recherche et la créativité dans un écosystème intelligent conçu pour autonomiser les étudiants et les éducateurs du monde entier.",
    getStarted: "Commencer",
    exploreFeatures: "Explorer les fonctionnalités",

    aboutTitle: "Construire l'avenir de l'apprentissage",
    aboutText:
      "Nous sommes plus qu’un outil, c’est un compagnon académique à vie. Notre mission est d’aider les étudiants et les chercheurs partout grâce à des solutions d’IA intelligentes, éthiques et inclusives.",
    readMore: "En savoir plus",

    featuresTitle: "Ce que nous offrons",
    featureCards: [
      {
        title: "Génération vidéo par IA",
        description:
          "Transformez instantanément vos notes, cours et recherches en vidéos éducatives structurées.",
      },
      {
        title: "Création d’avatars IA en temps réel",
        description:
          "Créez des avatars IA multilingues avec une voix et une présentation personnalisables.",
      },
      {
        title: "Programmes de formation et ateliers conçus par IA",
        description:
          "Générez des programmes de formation complets, des plans de cours et des évaluations avec l’IA.",
      },
      {
        title: "Capacités académiques avancées",
        description:
          "Outils de recherche, accompagnement de thèse, analyse de données et protection de l’intégrité académique.",
      },
    ],
    exploreMore: "Explorer plus →",

    suiteTitle: "Suite académique et scolaire",
    suiteSub:
      "Votre écosystème IA tout-en-un pour l’apprentissage, la recherche et la réussite académique.",
    suiteCards: [
      {
        title: "🏫 Centre d’apprentissage intelligent",
        text: "Planificateur d’études • Tuteurs par matière • Aide aux devoirs • Résumés",
      },
      {
        title: "🎓 Suite de recherche",
        text: "Créateur de thèse • Revues de littérature • Rédaction académique • Analyse de données",
      },
      {
        title: "🎤 Présentations IA",
        text: "Préparation aux soutenances • Diaporamas • Vidéos avec avatars • Explications multilingues",
      },
      {
        title: "🌐 Marketplace",
        text: "Créez, partagez et vendez des cours alimentés par l’IA dans plus de 100 langues",
      },
      {
        title: "📊 Analyses institutionnelles",
        text: "Tableaux de bord • Analyses • Intégration LMS • Suites en marque blanche",
      },
      {
        title: "🔒 Intégrité et éthique",
        text: "Protection anti-plagiat • Correcteur de citations • Données sécurisées • Conformité",
      },
    ],
    suiteButton: "Découvrir à qui s’adresse Yanka AI",

    pricingTitle: "Choisissez votre plan",
    pricingSub:
      "Des plans flexibles conçus pour chaque apprenant, des étudiants aux institutions.",
    plans: {
      learn: {
        title: "Apprendre",
        price: "Gratuit",
        features: [
          "Accès au chatbot IA",
          "Création illimitée de vidéos IA",
          "Planificateur d’études et suivi de progression",
          "Nombre limité de questions par jour",
          "Accès à la communauté Q&R",
        ],
        cta: "Commencer gratuitement",
      },
      plus: {
        title: "Plus",
        price: "$9.99/mo",
        features: [
          "Sessions illimitées avec tuteur IA",
          "Assistant IA pour essais et devoirs",
          "Recherche et créateur de thèse (mode standard)",
          "Avatars IA et création vidéo",
          "Analyses d’étude avancées",
        ],
        cta: "Passer à Plus",
      },
      scholar: {
        title: "Scholar",
        price: "$24.99/mo",
        badge: "Recommandé",
        features: [
          "Toutes les fonctionnalités Plus",
          "Suite académique et de recherche complète",
          "Outils de collaboration",
          "Support prioritaire",
          "Sauvegarde cloud des documents",
        ],
        cta: "Passer à Scholar",
      },
      institution: {
        title: "Institution",
        price: "À partir de $2,499/mo",
        features: [
          "Écosystème complet d’apprentissage et académique",
          "Personnalisation de marque",
          "Intégration API et LMS",
          "Analyses institutionnelles",
          "Contrôle administrateur et conformité",
        ],
        cta: "Demander une démo institutionnelle",
      },
    },

    marketplaceTitle: "Marketplace",
    marketplaceDesc:
      "Découvrez une sélection soignée de cours développant des compétences, créés par des experts. Apprenez ce qui compte et développez votre potentiel.",
    searchPlaceholder: "Rechercher des cours",
    viewAllCourses: "Voir tous les cours →",
    courses: [
      {
        title: "L’IA pour tous",
        teacher: "Dr. Schan Gya",
        summary:
          "Une introduction accessible à l’intelligence artificielle, à l’apprentissage automatique et à l’impact de l’IA sur les industries actuelles.",
        price: "$30.99",
        img: "/pics/ai.jpeg",
        tag: "Best-seller",
        rating: "4.8",
        reviews: "2,145 avis",
      },
      {
        title: "Espagnol débutant",
        teacher: "Prof. Rujeta Morales",
        summary:
          "Développez votre confiance en espagnol au quotidien grâce au vocabulaire pratique, aux exercices oraux et aux conversations réelles.",
        price: "$20.99",
        img: "/pics/spanish.jpeg",
        tag: "Populaire",
        rating: "4.6",
        reviews: "1,084 avis",
      },
      {
        title: "Science des données",
        teacher: "Dr. Rolan Peters",
        summary:
          "Apprenez l’analyse de données, la visualisation, les statistiques et la modélisation prédictive avec des outils modernes et des jeux de données pratiques.",
        price: "$30.99",
        img: "/pics/data.jpeg",
        tag: "Très bien noté",
        rating: "4.7",
        reviews: "1,732 avis",
      },
      {
        title: "Gestion de projet",
        teacher: "Prof. Sach Mehra",
        summary:
          "Maîtrisez la planification, la communication avec les parties prenantes, les méthodes agiles et les stratégies d’exécution.",
        price: "$25.99",
        img: "/pics/pm.jpeg",
        tag: "Best-seller",
        rating: "4.5",
        reviews: "963 avis",
      },
      {
        title: "Marketing digital",
        teacher: "Dami Cole",
        summary:
          "Comprenez l’image de marque, la stratégie réseaux sociaux, le SEO, la planification de contenu et la mesure de performance des campagnes.",
        price: "$35.99",
        img: "/pics/marketing.jpeg",
        tag: "Tendance",
        rating: "4.7",
        reviews: "1,268 avis",
      },
      {
        title: "Littérature anglaise",
        teacher: "Prof. Elena Brooks",
        summary:
          "Explorez des œuvres classiques et modernes tout en renforçant vos compétences d’analyse, d’écriture et d’interprétation.",
        price: "$20.99",
        img: "/pics/english.jpeg",
        tag: "Recommandé",
        rating: "4.4",
        reviews: "812 avis",
      },
    ],

    learnersTitle: "Par nos apprenants",
    learnersSub:
      "Réflexions, idées et témoignages de nos apprenants et éducateurs.",
    posts: [
      {
        user: "Emma Johnson",
        handle: "@emma_learning",
        text: "Yanka AI m’a aidée à résumer 40 pages de recherche en quelques minutes. Un vrai changement pour la rédaction de thèse !",
        time: "il y a 2 h",
      },
      {
        user: "Liam Carter",
        handle: "@liam_studies",
        text: "Le tuteur IA s’adapte parfaitement à mon rythme — on dirait un mentor personnel qui me guide dans des sujets complexes.",
        time: "il y a 5 h",
      },
      {
        user: "Sophia Lee",
        handle: "@sophia_reads",
        text: "La nouvelle fonctionnalité de vidéo pédagogique est incroyable ! Elle a rendu mes présentations plus interactives et engageantes.",
        time: "il y a 1 j",
      },
      {
        user: "Ethan Wright",
        handle: "@ethan_creates",
        text: "J’ai créé aujourd’hui mon premier brouillon de recherche assisté par IA avec Yanka AI. C’est efficace, intuitif et puissant !",
        time: "il y a 3 j",
      },
      {
        user: "Olivia Brown",
        handle: "@olivia_inspires",
        text: "L’éducation doit être intelligente, accessible et inclusive — c’est exactement ce que construit Yanka AI.",
        time: "il y a 1 sem.",
      },
    ],
    registerNow: "S’inscrire maintenant",

    partnersTitle: "Nos partenaires",

    contactTitle: "Contactez-nous",
    contactSub:
      "Vous avez des questions ? Nous sommes là pour vous aider à apprendre, progresser et réussir.",
    name: "Nom",
    email: "E-mail",
    phone: "Téléphone",
    message: "Message",
    namePlaceholder: "Entrez votre nom",
    emailPlaceholder: "Entrez votre e-mail",
    phonePlaceholder: "Entrez votre numéro de téléphone",
    messagePlaceholder: "Écrivez votre message...",
    submit: "Envoyer",
  },
};

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <>
      <NavBar />

      {/* Hero Section */}
      <section className={styles.hero} id="top">
        <div className={styles.heroContent}>
          <h1>
            {t.heroTitle} <span>AI</span>
          </h1>
          <p>{t.heroSub}</p>
          <div className={styles.heroButtons}>
            <Link href="/signup" className={styles.btnPrimary}>
              {t.getStarted}
            </Link>
            <Link href="#features" className={styles.btnSecondary}>
              {t.exploreFeatures}
            </Link>
          </div>
        </div>

        <div className={styles.heroVideoContainer}>
          <video
            className={styles.heroVideo}
            src="/video/intro.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={styles.about}>
        <video
          className={styles.aboutVideo}
          src="/video/home.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        <div className={styles.aboutOverlay}></div>

        <div className={styles.aboutContent}>
          <h2>{t.aboutTitle}</h2>
          <p>{t.aboutText}</p>
          <Link href="/about" className={styles.btnPrimary}>
            {t.readMore}
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <h2>{t.featuresTitle}</h2>

        <div className={styles.featureGrid}>
          {t.featureCards.map((feature, index) => (
            <div key={index} className={styles.flipCard}>
              <div className={styles.flipCardInner}>
                <div className={styles.flipCardFront}>
                  <h3>{feature.title}</h3>
                </div>
                <div className={styles.flipCardBack}>
                  <p>{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link href="/features">
          <button className={styles.exploreBtn}>{t.exploreMore}</button>
        </Link>
      </section>

      {/* Academic Suite Section */}
      <section className={styles.academicSuite} id="institutions">
        <div className={styles.suiteOverlay}></div>

        <div className={styles.suiteHeader}>
          <h2>{t.suiteTitle}</h2>
          <p>{t.suiteSub}</p>
        </div>

        <div className={styles.suiteScroll}>
          {t.suiteCards.map((card, index) => (
            <div key={index} className={styles.suiteCard}>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          ))}
        </div>

        <div className={styles.suiteCTA}>
          <button
            className={styles.suiteButton}
            onClick={() => (window.location.href = "/solutions")}
          >
            {t.suiteButton}
          </button>
        </div>
      </section>

      {/* Pricing & Plans Section */}
      <section id="pricing" className={styles.pricing}>
        <h2>{t.pricingTitle}</h2>
        <p className={styles.subtitle}>{t.pricingSub}</p>

        <div className={styles.pricingGrid}>
          <div className={styles.planCard}>
            <Image
              src="/pics/pic1.jpeg"
              alt={t.plans.learn.title}
              width={70}
              height={70}
              className={styles.planIcon}
            />
            <h3>{t.plans.learn.title}</h3>
            <p className={styles.price}>{t.plans.learn.price}</p>
            <ul>
              {t.plans.learn.features.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <Link href="/signup" className={`${styles.btnPrimary} ${styles.small}`}>
              {t.plans.learn.cta}
            </Link>
          </div>

          <div className={`${styles.planCard} ${styles.highlight}`}>
            <Image
              src="/pics/pic2.jpeg"
              alt={t.plans.plus.title}
              width={70}
              height={70}
              className={styles.planIcon}
            />
            <h3>{t.plans.plus.title}</h3>
            <p className={styles.price}>{t.plans.plus.price}</p>
            <ul>
              {t.plans.plus.features.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <Link href="/signup" className={`${styles.btnGreen} ${styles.small}`}>
              {t.plans.plus.cta}
            </Link>
          </div>

          <div className={`${styles.planCard} ${styles.recommended}`}>
            <div className={styles.recommendedBadge}>{t.plans.scholar.badge}</div>
            <Image
              src="/pics/pic3.jpeg"
              alt={t.plans.scholar.title}
              width={70}
              height={70}
              className={styles.planIcon}
            />
            <h3>{t.plans.scholar.title}</h3>
            <p className={styles.price}>{t.plans.scholar.price}</p>
            <ul>
              {t.plans.scholar.features.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <Link href="/signup" className={`${styles.btnPurple} ${styles.small}`}>
              {t.plans.scholar.cta}
            </Link>
          </div>

          <div className={styles.planCard}>
            <Image
              src="/pics/pic4.jpeg"
              alt={t.plans.institution.title}
              width={70}
              height={70}
              className={styles.planIcon}
            />
            <h3>{t.plans.institution.title}</h3>
            <p className={styles.price}>{t.plans.institution.price}</p>
            <ul>
              {t.plans.institution.features.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <Link
              href="#contact"
              className={`${styles.btnSecondary} ${styles.small} ${styles.institution}`}
            >
              {t.plans.institution.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* Marketplace Preview Section */}
      <section className={styles.marketplacePreview} id="marketplace">
        <h2 className={styles.marketplaceTitle}>{t.marketplaceTitle}</h2>

        <p className={styles.marketplaceDescription}>{t.marketplaceDesc}</p>

        <div
          className={styles.searchWrapper}
          onClick={() => (window.location.href = "/signup")}
        >
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className={styles.searchInput}
            readOnly
          />
        </div>

        <div className={styles.horizontalScroll}>
          {t.courses.map((course, index) => (
            <div
              key={index}
              className={styles.courseCard}
              onClick={() => (window.location.href = "/signup")}
            >
              <Image
                src={course.img}
                alt={course.title}
                className={styles.courseImage}
                width={400}
                height={250}
              />

              <div className={styles.courseInfo}>
                <div className={styles.courseContentTop}>
                  <h3>{course.title}</h3>
                  <p className={styles.teacher}>{course.teacher}</p>
                  <p className={styles.courseSummary}>{course.summary}</p>

                  <div className={styles.courseMeta}>
                    <span className={styles.courseTag}>{course.tag}</span>
                    <span className={styles.ratingBox}>⭐ {course.rating}</span>
                    <span className={styles.reviewBox}>{course.reviews}</span>
                  </div>
                </div>

                <div className={styles.priceRow}>
                  <p className={styles.price}>{course.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className={styles.viewAllBtn}
          onClick={() => (window.location.href = "/signup")}
        >
          {t.viewAllCourses}
        </button>
      </section>

      {/* Blog / Insights Section */}
      <section className={styles.blogs} id="blogs">
        <h2>{t.learnersTitle}</h2>
        <p className={styles.subtitle}>{t.learnersSub}</p>

        <div className={styles.blogCarousel}>
          {t.posts.map((post, i) => (
            <div key={i} className={styles.blogCard}>
              <div className={styles.blogHeader}>
                <div className={styles.avatar}></div>
                <div>
                  <h4>{post.user}</h4>
                  <p>{post.handle}</p>
                </div>
              </div>
              <p className={styles.blogText}>{post.text}</p>
              <span className={styles.blogTime}>{post.time}</span>
            </div>
          ))}
        </div>

        <Link href="/signup">
          <button className={styles.registerBtn}>{t.registerNow}</button>
        </Link>
      </section>

      {/* Sponsors Section */}
      <section className={styles.sponsorSection}>
        <h2>{t.partnersTitle}</h2>

        <div className={styles.sponsorSlider}>
          <div className={styles.sponsorTrack}>
            {[
              "/pics/logo_1.jpeg",
              "/pics/logo_2.jpeg",
              "/pics/logo_3.jpeg",
              "/pics/logo_4.jpeg",
            ].map((logo, i) => (
              <div key={i} className={styles.sponsorLogo}>
                <Image src={logo} alt={`Sponsor ${i}`} width={150} height={50} />
              </div>
            ))}

            {[
              "/pics/logo_1.jpeg",
              "/pics/logo_2.jpeg",
              "/pics/logo_3.jpeg",
              "/pics/logo_4.jpeg",
            ].map((logo, i) => (
              <div key={i + 4} className={styles.sponsorLogo}>
                <Image
                  src={logo}
                  alt={`Sponsor duplicate ${i}`}
                  width={150}
                  height={50}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={styles.contactSection}>
        <h2>{t.contactTitle}</h2>
        <p className={styles.subtitle}>{t.contactSub}</p>

        <div className={styles.contactCenter}>
          <div className={styles.contactWrapper}>
            <div className={styles.contactImage}>
              <Image
                src="/pics/contactus.jpeg"
                alt={t.contactTitle}
                width={600}
                height={400}
              />
            </div>

            <form className={styles.contactForm}>
              <div className={styles.formGroup}>
                <label>{t.name}</label>
                <input type="text" placeholder={t.namePlaceholder} required />
              </div>

              <div className={styles.formGroup}>
                <label>{t.email}</label>
                <input type="email" placeholder={t.emailPlaceholder} required />
              </div>

              <div className={styles.formGroup}>
                <label>{t.phone}</label>
                <input type="tel" placeholder={t.phonePlaceholder} />
              </div>

              <div className={styles.formGroup}>
                <label>{t.message}</label>
                <textarea
                  placeholder={t.messagePlaceholder}
                  rows={4}
                ></textarea>
              </div>

              <button type="submit" className={styles.btnPrimary}>
                {t.submit}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}