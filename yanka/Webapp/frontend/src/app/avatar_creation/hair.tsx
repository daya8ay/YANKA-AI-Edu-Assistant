"use client";

import React, { useState } from "react";
import styles from "../page.module.css";
import { HexColorPicker } from "react-colorful";

const Hair = () => {
    const [hairColor, setHairColor] = useState("#ffffff");
    const [hairLength, setHairLength] = useState("");
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
        <div>
            <h3>Hair Length</h3>
            <div className={styles.optionsGrid}>
                {hairLengthOptions.map((hairLengthOption) => (
                    <button key={hairLengthOption.id} onClick={() => setHairLength(hairLengthOption.id)} className={styles.optionButton}>
                        {hairLengthOption.label}
                    </button>
                ))}
            </div>
            <h3>Hair Style</h3>
            {hairLength == "Short" && (
                <div className={styles.optionsGrid}>
                    {shortHairStyleOptions.map((shortHairStyleOption) => (
                        <button key={shortHairStyleOption.id} onClick={() => setShortHairStyle(shortHairStyleOption.id)} className={styles.optionButton}>
                            {shortHairStyleOption.label}
                        </button>
                    ))}
                </div>
            )}
            {hairLength == "Long" && (
                <div className={styles.optionsGrid}>
                    {longHairStyleOptions.map((longHairStyleOption) => (
                        <button key={longHairStyleOption.id} onClick={() => setLongHairStyle(longHairStyleOption.id)} className={styles.optionButton}>
                            {longHairStyleOption.label}
                        </button>
                    ))}
                </div>
            )}
            <h3>Hair Color</h3>
            <div className={styles.colorPickerContainer}>
                <HexColorPicker color={hairColor} onChange={setHairColor} />
            </div>
        </div>
    )
}

export default Hair;