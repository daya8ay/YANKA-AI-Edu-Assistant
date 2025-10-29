"use client";

import React, { useState } from "react";
import styles from "./avatar.module.css";
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
            <div className={styles.section}>
                <h4>Eye Color</h4>
                <div style={{ marginTop: '15px' }}>
                    <HexColorPicker color={eyeColor} onChange={setEyeColor} />
                </div>
            </div>

            <div className={styles.section}>
                <h4>Facial Hair</h4>
                <div className={styles.styleOptions}>
                    {facialHairOptions.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => setFacialHair(option.id)}
                            className={`${styles.styleOption} ${
                                facialHair === option.id ? styles.selected : ""
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Face;