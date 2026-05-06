"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser } from "aws-amplify/auth";
import NavBar from "@/components/NavBar";
import DashboardNavBar from "@/components/DashboardNavBar";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./research.module.css";

type ResearchContribution = {
  contributorName: string;
  institution: string;
  projectTitle: string;
  platform: string;
  summaryLines: string;
  keyResults: string[];
  impact: string;
  supportingMaterials: { label: string; href: string }[];
};

type ResearchPageContent = {
  pageTitle: string;
  nameLabel: string;
  institutionLabel: string;
  platformLabel: string;
  summaryLabel: string;
  keyResultsLabel: string;
  impactLabel: string;
  supportingMaterialsLabel: string;
  contributions: ResearchContribution[];
};

const contentByLanguage: Record<"en" | "fr", ResearchPageContent> = {
  en: {
    pageTitle: "Research Contributions",
    nameLabel: "Name",
    institutionLabel: "Institution",
    platformLabel: "Platform",
    summaryLabel: "Summary",
    keyResultsLabel: "Key Results",
    impactLabel: "Impact",
    supportingMaterialsLabel: "Supporting Materials",
    contributions: [
      {
        contributorName: "Aayush Bharti",
        institution: "Arizona State University (ASU)",
        projectTitle:
          "Predicting Learner Confusion in Interactive Video Lessons Using Real-Time Engagement Analytics",
        platform: "YANKA",
        summaryLines:
          "The rise of online education started with COVID-19, as institutions needed to find a way to shift away from an in-person learning environment. Although it is more convenient, there are still key issues regarding unaddressed student confusion due to a lack of real-time support, leading to high disengagement and dropout rates. This project addresses this challenge by developing a workflow that utilizes Artificial Intelligence and Machine Learning to predict learner confusion using video engagement analytics, such as pause count, skip count, and time watched, and provide real-time support to learners during online video lessons.",
        keyResults: [
          "The results of the study illustrated that the project provided a viable solution to the problem of unaddressed confusion and lack of support in online video lessons. Specifically, the machine learning model identified confusion in 100% of the participants who reported moderate or high confusion. Moreover, 89% of the participants strongly agreed that the platform effectively offered help when they were confused. Finally, 90% of the participants reported that they found the tool to be useful or extremely useful in their learning experience. Overall, the study showcased positive results regarding the effectiveness and usefulness of the project.",
        ],
        impact:
          "By developing a system that predicts learner confusion within video lessons and integrates an adaptive support and explanation system to help learners, this project has created a viable solution to address the lack of support in online learning. The positive results from the user study demonstrate the overall effectiveness and usefulness of this workflow in a student's learning process. Ultimately, this work demonstrates that the integration of real-time support within online video lessons can significantly reduce the issue of unaddressed confusion leading to dropout.",
        supportingMaterials: [
          { label: "Project Report (Placeholder)", href: "#" },
          { label: "Video Simulator (Demo)", href: "/video_simulator" },
        ],
      },
    ],
  },
  fr: {
    pageTitle: "Contributions aux projets de recherche",
    nameLabel: "Nom",
    institutionLabel: "Institution",
    platformLabel: "Plateforme",
    summaryLabel: "Resume",
    keyResultsLabel: "Resultats cles",
    impactLabel: "Impact",
    supportingMaterialsLabel: "Documents complementaires",
    contributions: [
      {
        contributorName: "Aayush Bharti",
        institution: "Arizona State University (ASU)",
        projectTitle:
          "Prediction de la confusion des apprenants dans des lecons video interactives a l'aide d'analyses d'engagement en temps reel",
        platform: "YANKA",
        summaryLines:
          "L'essor de l'education en ligne a commence avec la COVID-19, lorsque les etablissements ont du s'eloigner de l'apprentissage en presentiel. Meme si ce format est plus pratique, des problemes importants subsistent, notamment la confusion des etudiants qui n'est pas prise en charge en temps reel, ce qui entraine du desengagement et des abandons. Ce projet releve ce defi en developpant un flux de travail qui utilise l'intelligence artificielle et l'apprentissage automatique pour predire la confusion des apprenants a partir d'indicateurs d'engagement video, tels que le nombre de pauses, le nombre de sauts et le temps de visionnage, afin de fournir un soutien en temps reel pendant les lecons video en ligne.",
        keyResults: [
          "Les resultats de l'etude ont montre que le projet apporte une solution viable au probleme de la confusion non prise en charge et du manque de soutien dans les lecons video en ligne. Plus precisement, le modele d'apprentissage automatique a identifie la confusion chez 100 % des participants ayant declare un niveau de confusion modere ou eleve. De plus, 89 % des participants ont fortement approuve le fait que la plateforme leur a effectivement apporte de l'aide lorsqu'ils etaient confus. Enfin, 90 % des participants ont indique que l'outil etait utile ou extremement utile pour leur apprentissage. Globalement, l'etude a mis en evidence des resultats positifs quant a l'efficacite et a l'utilite du projet.",
        ],
        impact:
          "En developpant un systeme qui predit la confusion des apprenants dans les lecons video et integre un systeme adaptatif de soutien et d'explication, ce projet propose une solution viable au manque d'accompagnement dans l'apprentissage en ligne. Les resultats positifs de l'etude utilisateur demontrent l'efficacite et l'utilite de ce flux de travail dans le processus d'apprentissage des etudiants. En definitive, ce travail montre que l'integration d'un soutien en temps reel dans les lecons video en ligne peut reduire de maniere significative la confusion non prise en charge qui conduit a l'abandon.",
        supportingMaterials: [
          { label: "Rapport du projet (Espace reserve)", href: "#" },
          { label: "Simulateur video (Demo)", href: "/video_simulator" },
        ],
      },
    ],
  },
};

export default function ResearchPage() {
  const { language } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const t = contentByLanguage[language];

  useEffect(() => {
    getCurrentUser()
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false))
      .finally(() => setAuthChecked(true));
  }, []);

  if (!authChecked) return null;

  return (
    <div className={styles.pageWrapper}>
      {isLoggedIn ? <DashboardNavBar /> : <NavBar />}
      <main className={styles.page}>
        <section className={styles.hero}>
          {/* <p className={styles.eyebrow}>Research Projects</p> */}
          <h1>{t.pageTitle}</h1>
        </section>

        <section className={styles.contributionsSection}>
          {t.contributions.map((item, index) => (
            <article key={`${item.projectTitle}-${index}`} className={styles.card}>
              <header className={styles.cardHeader}>
                <h2>{item.projectTitle}</h2>
                <div>
                  <p>
                    {t.nameLabel}: {item.contributorName}
                  </p>
                </div>
              </header>

              <div className={styles.metaGrid}>
                <div>
                  <span>{t.institutionLabel}</span>
                  <p>{item.institution}</p>
                </div>
                <div>
                  <span>{t.platformLabel}</span>
                  <p>{item.platform}</p>
                </div>
              </div>

              <div className={styles.detailsGrid}>
                <section className={`${styles.block} ${styles.detailCard}`}>
                  <h3>{t.summaryLabel}</h3>
                  <div className={styles.textGroup}>
                    <p>{item.summaryLines}</p>
                  </div>
                </section>

                {/* <section className={`${styles.block} ${styles.detailCard}`}>
                  <h3>Problem and Approach</h3>
                  <p>{item.approach}</p>
                </section> */}

                <section className={`${styles.block} ${styles.detailCard}`}>
                  <h3>{t.keyResultsLabel}</h3>
                  <div className={styles.textGroup}>
                    {item.keyResults.map((result, resultIndex) => (
                      <p key={resultIndex}>{result}</p>
                    ))}
                  </div>
                </section>

                <section className={`${styles.block} ${styles.detailCard}`}>
                  <h3>{t.impactLabel}</h3>
                  <p>{item.impact}</p>
                </section>
              </div>

              <section className={styles.block}>
                <h3>{t.supportingMaterialsLabel}</h3>
                <div className={styles.linksRow}>
                  {item.supportingMaterials.map((material, materialIndex) => (
                      <Link
                        key={materialIndex}
                        href={material.href}
                        className={`${styles.linkChip} ${material.href === "/video_simulator" ? styles.linkChipUnderline : ""}`}
                      >
                        {material.label}
                      </Link>
                  ))}
                </div>
              </section>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
