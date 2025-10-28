"use client";

import React, { useState } from "react";
import styles from "../page.module.css";
import { HexColorPicker } from "react-colorful";

const Face = () => {
    const [eyeColor, setEyeColor] = useState("#3b82f6");
    const [facialHair, setFacialHair] = useState("None");

    const facialHairOptions = [
        { id: "None", label: "None" },
        { id: "Mustache", label: "Mustache" },
        { id: "Goatee", label: "Goatee" },
        { id: "Beard", label: "Beard" },
        { id: "Stubble", label: "Stubble" },
    ];

    return (
        <div className={styles.tabContent}>
            <h3>Eye Color</h3>
            <div className={styles.colorPickerContainer}>
                <HexColorPicker color={eyeColor} onChange={setEyeColor} />
            </div>

            <h3>Facial Hair</h3>
            <div className={styles.optionsGrid}>
                {facialHairOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => setFacialHair(option.id)}
                        className={`${styles.optionButton} ${
                            facialHair === option.id ? styles.activeOption : ""
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Face;