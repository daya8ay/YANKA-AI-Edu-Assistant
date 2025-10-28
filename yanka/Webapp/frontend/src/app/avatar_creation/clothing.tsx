"use client";

import React, { useState } from "react";
import styles from "../page.module.css";
import { HexColorPicker } from "react-colorful";

const Clothing = () => {
  const [topType, setTopType] = useState("T-Shirt");
  const [topColor, setTopColor] = useState("#ffffff");

  { /* options for top type */ }
  const topTypeOptions = [
    { id: "T-Shirt", label: "T-Shirt" },
    { id: "Hoodie", label: "Hoodie" },
    { id: "Tank Top", label: "Tank Top" },
    { id: "Sweater", label: "Sweater" },
  ];

  return (
    <div className={styles.tabContent}>
      <h3>Top Type</h3>
      {/* top type options */}
      <div className={styles.optionsGrid}>
        {topTypeOptions.map((topTypeOption) => (
          <button
            key={topTypeOption.id}
            onClick={() => setTopType(topTypeOption.id)}
            className={`${styles.optionButton} ${
              topType === topTypeOption.id ? styles.activeOption : ""
            }`}
          >
            {topTypeOption.label}
          </button>
        ))}
      </div>

      <h3>Top Color</h3>
      {/* top color */}
      <div className={styles.colorPickerContainer}>
        <HexColorPicker color={topColor} onChange={setTopColor} />
      </div>
    </div>
  );
};

export default Clothing;
