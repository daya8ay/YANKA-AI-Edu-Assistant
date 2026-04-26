"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser } from "aws-amplify/auth";
import NavBar from "@/components/NavBar";
import DashboardNavBar from "@/components/DashboardNavBar";
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

const contributions: ResearchContribution[] = [
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
      "By developing a system that predicts learner confusion within video lessons and integrates an adaptive support and explanation system to help learners, this project has created a viable solution to address the lack of support in onilne learning. The positive results from the user study demonstrate the overall effectiveness and usefulness of this workflow in a student’s learning process. Ultimately, this work demonstrates that the integration of real-time support within online video lessons can significantly reduce the issue of unaddressed confusion leading to dropout.",
    supportingMaterials: [
      { label: "Project Report (Placeholder)", href: "#" },
    ],
  },
];

export default function ResearchPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

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
          <h1>Research Projects Contributions</h1>
        </section>

        <section className={styles.contributionsSection}>
          {contributions.map((item, index) => (
            <article key={`${item.projectTitle}-${index}`} className={styles.card}>
              <header className={styles.cardHeader}>
                <h2>{item.projectTitle}</h2>
                <div>
                  <p>Name: {item.contributorName}</p>
                </div>
              </header>

              <div className={styles.metaGrid}>
                <div>
                  <span>Institution</span>
                  <p>{item.institution}</p>
                </div>
                <div>
                  <span>Platform</span>
                  <p>{item.platform}</p>
                </div>
              </div>

              <div className={styles.detailsGrid}>
                <section className={`${styles.block} ${styles.detailCard}`}>
                  <h3>Summary</h3>
                  <div className={styles.textGroup}>
                    <p>{item.summaryLines}</p>
                  </div>
                </section>

                {/* <section className={`${styles.block} ${styles.detailCard}`}>
                  <h3>Problem and Approach</h3>
                  <p>{item.approach}</p>
                </section> */}

                <section className={`${styles.block} ${styles.detailCard}`}>
                  <h3>Key Results</h3>
                  <div className={styles.textGroup}>
                    {item.keyResults.map((result, resultIndex) => (
                      <p key={resultIndex}>{result}</p>
                    ))}
                  </div>
                </section>

                <section className={`${styles.block} ${styles.detailCard}`}>
                  <h3>Impact</h3>
                  <p>{item.impact}</p>
                </section>
              </div>

              <section className={styles.block}>
                <h3>Supporting Materials</h3>
                <div className={styles.linksRow}>
                  {item.supportingMaterials.map((material, materialIndex) => (
                    <Link key={materialIndex} href={material.href} className={styles.linkChip}>
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
