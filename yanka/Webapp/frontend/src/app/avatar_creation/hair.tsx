"use client";

import React, { useState } from "react";
import styles from "./avatar.module.css";
import { HexColorPicker } from "react-colorful";

const Hair = () => {
    const [hairColor, setHairColor] = useState("#ffffff");
    const [hairLength, setHairLength] = useState("Short");
    const [shortHairStyle, setShortHairStyle] = useState("Bob");
    const [longHairStyle, setLongHairStyle] = useState("Straight");

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
    
    return (
        <div className={styles.tabContent}>
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
        </div>
    )
}

export default Hair;
