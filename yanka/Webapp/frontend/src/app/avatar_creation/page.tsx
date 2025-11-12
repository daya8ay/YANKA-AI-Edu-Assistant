"use client";

import React, { useState } from "react";
import DashboardNavBar from "@/components/DashboardNavBar";
import styles from "./avatar.module.css";
import Face from "./face";
import Hair from "./hair";
import Clothing from "./clothing";
import Accessories from "./accessories";
import AvatarChat from "./AvatarChat";

const AvatarCreation = () => {
  const [currentTab, setCurrentTab] = useState("Face");

  const tabs = [
    { id: "Face", label: "Face" },
    { id: "Hair", label: "Hair" },
    { id: "Clothing", label: "Clothing" },
    { id: "Accessories", label: "Accessories" },
  ];

  const renderTabContent = () => {
    switch (currentTab) {

      case "Face":
        return <Face />

      case "Hair":
        return <Hair />

      case "Clothing":
        return <Clothing />

      case "Accessories":
        return <Accessories />

      default:
        return null;
    }
  };

  return (
    <>
      <DashboardNavBar />
      <div className={styles.page}>
        <main className={styles.main}>
          <h1 className={styles.pageTitle}>Create Your AI Avatar</h1>

          <div className={styles.cardRow}>
            <div className={styles.previewCard}>
              <h3>Preview</h3>
              <p style={{ color: '#666', margin: 0 }}>Coming soon</p>
            </div>

            <div className={styles.customizationCard}>
              <div className={styles.tabs}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`${styles.mainTabButton} ${
                      currentTab === tab.id ? styles.activeMainTab : ""
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {renderTabContent()}
            </div>
          </div>
        </main>
      </div>

      <AvatarChat />
    </>
  );
};

export default AvatarCreation;