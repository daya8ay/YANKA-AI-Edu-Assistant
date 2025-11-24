"use client";

import React, { useState } from "react";
import styles from "./avatar.module.css";
import { HexColorPicker } from "react-colorful";

const Face = () => {
    const [activeSubTab, setActiveSubTab] = useState("Skin");
    const [skinColor, setSkinColor] = useState("#fdbcb4");
    const [eyeShape, setEyeShape] = useState("Round");
    const [eyeColor, setEyeColor] = useState("#895129");
    const [eyebrowShape, setEyebrowShape] = useState("Straight");
    const [eyebrowColor, setEyebrowColor] = useState("#895129");

    const subTabs = [
        { id: "Skin", label: "Skin" },
        { id: "Eye", label: "Eye" },
    ];

    const skinColorOptions = [
        { id: "White", label: "White", color: "#fdbcb4" },
        { id: "Light Brown", label: "Light Brown", color: "#e0ac69" },
        { id: "Medium Brown", label: "Medium Brown", color: "#c68642" },
        { id: "Dark Brown", label: "Dark Brown", color: "#8d5524" },
        { id: "Black", label: "Black", color: "#3d2817" },
    ]

    const eyeShapeOptions = [
        { id: "Round", label: "Round" },
        { id: "Almond", label: "Almond" },
        { id: "Downturned", label: "Downturned" },
        { id: "Monolid", label: "Monolid" },
    ]

    const eyebrowShapeOptions = [
        { id: "Straight", label: "Straight" },
        { id: "Curved", label: "Curved" },
        { id: "Thin", label: "Thin" },
        { id: "Thick", label: "Thick" },
    ]

    const renderSkinContent = () => (
        <>
            <div className={styles.section}>
                <h4>Skin Color</h4>
                <div className={styles.colorPicker}>
                    {skinColorOptions.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => setSkinColor(option.color)}
                            className={`${styles.colorOption} ${
                                skinColor === option.color ? styles.selected : ""
                            }`}
                            style={{ backgroundColor: option.color }}
                            title={option.label}
                        />
                    ))}
                </div>
            </div>
        </>
    );

    const renderEyeContent = () => (
        <>
            <div className={styles.section}>
                <h4>Eye Shape</h4>
                <div className={styles.styleOptions}>
                    {eyeShapeOptions.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => setEyeShape(option.id)}
                            className={`${styles.styleOption} ${eyeShape === option.id ? styles.selected : ""}`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h4>Eye Color</h4>
                <div style={{ marginTop: '15px' }}>
                    <HexColorPicker color={eyeColor} onChange={setEyeColor} />
                </div>
            </div>

            <div className={styles.section}>
                <h4>Eyebrow Shape</h4>
                <div className={styles.styleOptions}>
                    {eyebrowShapeOptions.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => setEyebrowShape(option.id)}
                            className={`${styles.styleOption} ${eyebrowShape === option.id ? styles.selected : ""}`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h4>Eyebrow Color</h4>
                <div style={{ marginTop: '15px' }}>
                    <HexColorPicker color={eyebrowColor} onChange={setEyebrowColor} />
                </div>
            </div>
        </>
    );
    
    return (
        <div className={styles.tabContent}>
            <div className={styles.subTabs}>
                {subTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className={`${styles.subTabButton} ${
                            activeSubTab === tab.id ? styles.activeSubTab : ""
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeSubTab === "Skin" && renderSkinContent()}
            {activeSubTab === "Eye" && renderEyeContent()}
        </div>
    )
}

export default Face;