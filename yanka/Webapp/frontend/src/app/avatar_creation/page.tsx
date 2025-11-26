"use client";

import React, { useState } from "react";
import DashboardNavBar from "@/components/DashboardNavBar";
import Footer from "@/components/Footer"; // ✅ Import Footer component
import styles from "./avatar.module.css";
import Gender from "./gender";
import Face from "./face";
import Hair from "./hair";
import Clothing from "./clothing";
import Accessories from "./accessories";
import Voice from "./voice";
import AvatarChat from "./AvatarChat";

const AvatarCreation = () => {
  const [currentTab, setCurrentTab] = useState("Gender");

  const tabs = [
    { id: "Gender", label: "Gender" },
    { id: "Face", label: "Face" },
    { id: "Hair", label: "Hair" },
    { id: "Clothing", label: "Clothing" },
    { id: "Accessories", label: "Accessories" },
    { id: "Voice", label: "Voice" },
  ];

  const renderTabContent = () => {
    switch (currentTab) {
      case "Gender":
        return <Gender />

      case "Face":
        return <Face />

      case "Hair":
        return <Hair />

      case "Clothing":
        return <Clothing />

      case "Accessories":
        return <Accessories />

      case "Voice":
        return <Voice />

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
      {/* ✅ Footer at the bottom */}
      <Footer />
    </>
  );
};

export default AvatarCreation;