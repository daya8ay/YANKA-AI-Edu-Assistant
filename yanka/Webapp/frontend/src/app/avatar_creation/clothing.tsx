"use client";

import React, { useState } from "react";
import styles from "./avatar.module.css";
import { HexColorPicker } from "react-colorful";

const Clothing = () => {
  const [topType, setTopType] = useState("T-Shirt");
  const [topColor, setTopColor] = useState("#ffffff");

  const topTypeOptions = [
    { id: "T-Shirt", label: "T-Shirt" },
    { id: "Hoodie", label: "Hoodie" },
    { id: "Tank Top", label: "Tank Top" },
    { id: "Sweater", label: "Sweater" },
  ];

  return (
    <div className={styles.tabContent}>
      <div className={styles.section}>
        <h4>Top Type</h4>
        <div className={styles.styleOptions}>
          {topTypeOptions.map((topTypeOption) => (
            <button
              key={topTypeOption.id}
              onClick={() => setTopType(topTypeOption.id)}
              className={`${styles.styleOption} ${
                topType === topTypeOption.id ? styles.selected : ""
              }`}
            >
              {topTypeOption.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h4>Top Color</h4>
        <div style={{ marginTop: '15px' }}>
          <HexColorPicker color={topColor} onChange={setTopColor} />
        </div>
      </div>
    </div>
  );
};

export default Clothing;
