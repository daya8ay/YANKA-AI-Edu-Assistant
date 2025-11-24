"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./avatar.module.css";
import { HexColorPicker } from "react-colorful";

const Clothing = () => {
  const [topType, setTopType] = useState("t-shirt");
  const [topColor, setTopColor] = useState("#ffffff");

  const topTypeOptions = [
    { id: "t-shirt", label: "T-Shirt", image: "/avatar/clothing/t-shirt.svg" },
    { id: "hoodie", label: "Hoodie", image: "/avatar/clothing/hoodie.svg" },
    { id: "tanktop", label: "Tank Top", image: "/avatar/clothing/tanktop.svg" },
    { id: "sweater", label: "Sweater", image: "/avatar/clothing/sweater.svg" },
    { id: "polo", label: "Polo", image: "/avatar/clothing/polo.svg" },
  ];

  return (
    <div className={styles.tabContent}>
      <div className={styles.section}>
        <h4>Top Type</h4>
        <div className={styles.imageOptions}>
          {topTypeOptions.map((topTypeOption) => (
            <button
              key={topTypeOption.id}
              onClick={() => setTopType(topTypeOption.id)}
              className={`${styles.imageOption} ${
                topType === topTypeOption.id ? styles.selected : ""
              }`}
              title={topTypeOption.label}
            >
              <Image
                src={topTypeOption.image}
                alt={topTypeOption.label}
                width={80}
                height={80}
                className={styles.optionImage}
              />
              <span className={styles.optionLabel}>{topTypeOption.label}</span>
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
