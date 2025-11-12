"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./avatar.module.css";
import { HexColorPicker } from "react-colorful";

const Hair = () => {
    const [activeSubTab, setActiveSubTab] = useState("Hair");
    const [hairColor, setHairColor] = useState("#ffffff");
    const [facialHairColor, setFacialHairColor] = useState("#ffffff");
    const [hairLength, setHairLength] = useState("Short");
    const [shortHairStyle, setShortHairStyle] = useState("Bob");
    const [longHairStyle, setLongHairStyle] = useState("Straight");
    const [facialHair, setFacialHair] = useState("None");

    const subTabs = [
        { id: "Hair", label: "Hair" },
        { id: "Facial Hair", label: "Facial Hair" },
    ];

    const hairLengthOptions = [
        { id: "Short", label: "Short" },
        { id: "Long", label: "Long" },
    ];
    
    const shortHairStyleOptions = [
        { id: "Bob", label: "Bob" },
        { id: "Mohawk", label: "Mohawk" },
        { id: "Mullet", label: "Mullet" },
        { id: "Fringe", label: "Fringe" },
        { id: "Bald", label: "Bald" },
        { id: "Wavy", label: "Wavy" },
        { id: "Curly", label: "Curly" },
        { id: "Straight", label: "Straight" },
    ];
    
    const longHairStyleOptions = [
        { id: "Mohawk", label: "Mohawk" },
        { id: "Mullet", label: "Mullet" },
        { id: "Fringe", label: "Fringe" },
        { id: "Wavy", label: "Wavy" },
        { id: "Curly", label: "Curly" },
        { id: "Straight", label: "Straight" },
        { id: "Braids", label: "Braids" },
        { id: "Comb Over", label: "Comb Over" },
    ];

    const facialHairOptions = [
        { id: "None", label: "None" },
        { id: "beard1", label: "Beard 1", image: "/avatar/facial_hair/beard1.svg" },
        { id: "beard2", label: "Beard 2", image: "/avatar/facial_hair/beard2.svg" },
        { id: "beard3", label: "Beard 3", image: "/avatar/facial_hair/beard3.svg" },
        { id: "beard4", label: "Beard 4", image: "/avatar/facial_hair/beard4.svg" },
        { id: "beard5", label: "Beard 5", image: "/avatar/facial_hair/beard5.svg" },
        { id: "beard6", label: "Beard 6", image: "/avatar/facial_hair/beard6.svg" },
        { id: "beard7", label: "Beard 7", image: "/avatar/facial_hair/beard7.svg" },
        { id: "beard8", label: "Beard 8", image: "/avatar/facial_hair/beard8.svg" },
        { id: "beard9", label: "Beard 9", image: "/avatar/facial_hair/beard9.svg" },
        { id: "beard10", label: "Beard 10", image: "/avatar/facial_hair/beard10.svg" },
        { id: "beard11", label: "Beard 11", image: "/avatar/facial_hair/beard11.svg" },
        { id: "beard12", label: "Beard 12", image: "/avatar/facial_hair/beard12.svg" },
        { id: "beard13", label: "Beard 13", image: "/avatar/facial_hair/beard13.svg" },
    ];

    const renderHairContent = () => (
        <>
            <div className={styles.section}>
                <h4>Hair Length</h4>
                <div className={styles.styleOptions}>
                    {hairLengthOptions.map((hairLengthOption) => (
                        <button 
                            key={hairLengthOption.id} 
                            onClick={() => setHairLength(hairLengthOption.id)} 
                            className={`${styles.styleOption} ${hairLength === hairLengthOption.id ? styles.selected : ""}`}
                        >
                            {hairLengthOption.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h4>Hair Style</h4>
                {hairLength === "Short" && (
                    <div className={styles.styleOptions}>
                        {shortHairStyleOptions.map((shortHairStyleOption) => (
                            <button 
                                key={shortHairStyleOption.id} 
                                onClick={() => setShortHairStyle(shortHairStyleOption.id)} 
                                className={`${styles.styleOption} ${shortHairStyle === shortHairStyleOption.id ? styles.selected : ""}`}
                            >
                                {shortHairStyleOption.label}
                            </button>
                        ))}
                    </div>
                )}
                {hairLength === "Long" && (
                    <div className={styles.styleOptions}>
                        {longHairStyleOptions.map((longHairStyleOption) => (
                            <button 
                                key={longHairStyleOption.id} 
                                onClick={() => setLongHairStyle(longHairStyleOption.id)} 
                                className={`${styles.styleOption} ${longHairStyle === longHairStyleOption.id ? styles.selected : ""}`}
                            >
                                {longHairStyleOption.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.section}>
                <h4>Hair Color</h4>
                <div style={{ marginTop: '15px' }}>
                    <HexColorPicker color={hairColor} onChange={setHairColor} />
                </div>
            </div>
        </>
    );

    const renderFacialHairContent = () => (
        <>
            <div className={styles.section}>
                <h4>Facial Hair Style</h4>
                <div className={styles.imageOptions}>
                    {facialHairOptions.map((option) => (
                        option.id === "None" ? (
                            <button
                                key={option.id}
                                onClick={() => setFacialHair(option.id)}
                                className={`${styles.imageOption} ${styles.noneOption} ${
                                    facialHair === option.id ? styles.selected : ""
                                }`}
                            >
                                <span>None</span>
                            </button>
                        ) : (
                            <button
                                key={option.id}
                                onClick={() => setFacialHair(option.id)}
                                className={`${styles.imageOption} ${
                                    facialHair === option.id ? styles.selected : ""
                                }`}
                                title={option.label}
                            >
                                <Image
                                    src={option.image!}
                                    alt={option.label}
                                    width={80}
                                    height={80}
                                    className={styles.optionImage}
                                />
                            </button>
                        )
                    ))}
                </div>
            </div>

            {facialHair !== "None" && (
                <div className={styles.section}>
                    <h4>Facial Hair Color</h4>
                    <div style={{ marginTop: '15px' }}>
                        <HexColorPicker color={facialHairColor} onChange={setFacialHairColor} />
                    </div>
                </div>
            )}
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

            {activeSubTab === "Hair" && renderHairContent()}
            {activeSubTab === "Facial Hair" && renderFacialHairContent()}
        </div>
    )
}

export default Hair;
