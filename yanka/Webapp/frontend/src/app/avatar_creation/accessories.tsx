"use client";

import React, { useState } from "react";
import styles from "../page.module.css";
import { HexColorPicker } from "react-colorful";

const Accessories = () => {
    const [glassesEnabled, setGlassesEnabled] = useState(false);
    const [glassesColor, setGlassesColor] = useState("#ffffff");

    const [earringsEnabled, setEarringsEnabled] = useState(false);
    const [earringsColor, setEarringsColor] = useState("#ffffff");

    const [necklaceEnabled, setNecklaceEnabled] = useState(false);
    const [necklaceColor, setNecklaceColor] = useState("#ffffff");

    const [hatEnabled, setHatEnabled] = useState(false);
    const [hatColor, setHatColor] = useState("#ffffff");

    const [scarfEnabled, setScarfEnabled] = useState(false);
    const [scarfColor, setScarfColor] = useState("#ffffff");

    return (
        <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
                <h3>Glasses</h3>
                <div className={styles.headerActions}>
                    <button
                        className={`${styles.optionButton} ${glassesEnabled ? styles.activeOption : ""}`}
                        onClick={() => setGlassesEnabled(true)}
                    >
                        ✓
                    </button>
                    <button
                        className={`${styles.optionButton} ${!glassesEnabled ? styles.activeOption : ""}`}
                        onClick={() => setGlassesEnabled(false)}
                    >
                        ✕
                    </button>
                </div>
            </div>
            {glassesEnabled && (
                <div className={styles.colorPickerContainer}>
                    <HexColorPicker color={glassesColor} onChange={setGlassesColor} />
                </div>
            )}

            <div className={styles.sectionHeader}>
                <h3>Earrings</h3>
                <div className={styles.headerActions}>
                    <button
                        className={`${styles.optionButton} ${earringsEnabled ? styles.activeOption : ""}`}
                        onClick={() => setEarringsEnabled(true)}
                    >
                        ✓
                    </button>
                    <button
                        className={`${styles.optionButton} ${!earringsEnabled ? styles.activeOption : ""}`}
                        onClick={() => setEarringsEnabled(false)}
                    >
                        ✕
                    </button>
                </div>
            </div>
            {earringsEnabled && (
                <div className={styles.colorPickerContainer}>
                    <HexColorPicker color={earringsColor} onChange={setEarringsColor} />
                </div>
            )}

            <div className={styles.sectionHeader}>
                <h3>Necklace</h3>
                <div className={styles.headerActions}>
                    <button
                        className={`${styles.optionButton} ${necklaceEnabled ? styles.activeOption : ""}`}
                        onClick={() => setNecklaceEnabled(true)}
                    >
                        ✓
                    </button>
                    <button
                        className={`${styles.optionButton} ${!necklaceEnabled ? styles.activeOption : ""}`}
                        onClick={() => setNecklaceEnabled(false)}
                    >
                        ✕
                    </button>
                </div>
            </div>
            {necklaceEnabled && (
                <div className={styles.colorPickerContainer}>
                    <HexColorPicker color={necklaceColor} onChange={setNecklaceColor} />
                </div>
            )}

            <div className={styles.sectionHeader}>
                <h3>Hat</h3>
                <div className={styles.headerActions}>
                    <button
                        className={`${styles.optionButton} ${hatEnabled ? styles.activeOption : ""}`}
                        onClick={() => setHatEnabled(true)}
                    >
                        ✓
                    </button>
                    <button
                        className={`${styles.optionButton} ${!hatEnabled ? styles.activeOption : ""}`}
                        onClick={() => setHatEnabled(false)}
                    >
                        ✕
                    </button>
                </div>
            </div>
            {hatEnabled && (
                <div className={styles.colorPickerContainer}>
                    <HexColorPicker color={hatColor} onChange={setHatColor} />
                </div>
            )}

            <div className={styles.sectionHeader}>
                <h3>Scarf</h3>
                <div className={styles.headerActions}>
                    <button
                        className={`${styles.optionButton} ${scarfEnabled ? styles.activeOption : ""}`}
                        onClick={() => setScarfEnabled(true)}
                    >
                        ✓
                    </button>
                    <button
                        className={`${styles.optionButton} ${!scarfEnabled ? styles.activeOption : ""}`}
                        onClick={() => setScarfEnabled(false)}
                    >
                        ✕
                    </button>
                </div>
            </div>
            {scarfEnabled && (
                <div className={styles.colorPickerContainer}>
                    <HexColorPicker color={scarfColor} onChange={setScarfColor} />
                </div>
            )}
        </div>
    )
}

export default Accessories;