"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./avatar.module.css";
import { HexColorPicker } from "react-colorful";

const Accessories = () => {
    const [glassesEnabled, setGlassesEnabled] = useState(false);
    const [glassesType, setGlassesType] = useState("glasses1");
    const [glassesColor, setGlassesColor] = useState("#000000");

    const [earringsEnabled, setEarringsEnabled] = useState(false);
    const [earringsColor, setEarringsColor] = useState("#ffffff");

    const [necklaceEnabled, setNecklaceEnabled] = useState(false);
    const [necklaceColor, setNecklaceColor] = useState("#ffffff");

    const [hatEnabled, setHatEnabled] = useState(false);
    const [hatColor, setHatColor] = useState("#ffffff");

    const glassesOptions = [
        { id: "glasses1", label: "Style 1", image: "/avatar/glasses/glasses1.svg" },
        { id: "glasses2", label: "Style 2", image: "/avatar/glasses/glasses2.svg" },
        { id: "glasses3", label: "Style 3", image: "/avatar/glasses/glasses3.svg" },
        { id: "glasses4", label: "Style 4", image: "/avatar/glasses/glasses4.svg" },
        { id: "glasses5", label: "Style 5", image: "/avatar/glasses/glasses5.svg" },
    ];

    const renderGlassesSection = () => (
        <div className={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ margin: 0 }}>Glasses</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        className={`${styles.styleOption} ${glassesEnabled ? styles.selected : ""}`}
                        onClick={() => setGlassesEnabled(true)}
                        style={{ padding: '8px 16px', minWidth: '60px' }}
                    >
                        ✓ Yes
                    </button>
                    <button
                        className={`${styles.styleOption} ${!glassesEnabled ? styles.selected : ""}`}
                        onClick={() => setGlassesEnabled(false)}
                        style={{ padding: '8px 16px', minWidth: '60px' }}
                    >
                        ✕ No
                    </button>
                </div>
            </div>
            {glassesEnabled && (
                <>
                    <div className={styles.imageOptions}>
                        {glassesOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => setGlassesType(option.id)}
                                className={`${styles.imageOption} ${
                                    glassesType === option.id ? styles.selected : ""
                                }`}
                                title={option.label}
                            >
                                <Image
                                    src={option.image}
                                    alt={option.label}
                                    width={80}
                                    height={80}
                                    className={styles.optionImage}
                                />
                            </button>
                        ))}
                    </div>
                    <div style={{ marginTop: '15px' }}>
                        <h5 style={{ marginBottom: '10px', fontSize: '1rem', color: '#1E4386' }}>Glasses Color</h5>
                        <HexColorPicker color={glassesColor} onChange={setGlassesColor} />
                    </div>
                </>
            )}
        </div>
    );

    const renderAccessory = (
        name: string,
        enabled: boolean,
        setEnabled: (value: boolean) => void,
        color: string,
        setColor: (value: string) => void
    ) => (
        <div className={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ margin: 0 }}>{name}</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        className={`${styles.styleOption} ${enabled ? styles.selected : ""}`}
                        onClick={() => setEnabled(true)}
                        style={{ padding: '8px 16px', minWidth: '60px' }}
                    >
                        ✓ Yes
                    </button>
                    <button
                        className={`${styles.styleOption} ${!enabled ? styles.selected : ""}`}
                        onClick={() => setEnabled(false)}
                        style={{ padding: '8px 16px', minWidth: '60px' }}
                    >
                        ✕ No
                    </button>
                </div>
            </div>
            {enabled && (
                <div style={{ marginTop: '15px' }}>
                    <HexColorPicker color={color} onChange={setColor} />
                </div>
            )}
        </div>
    );

    return (
        <div className={styles.tabContent}>
            {renderGlassesSection()}
            {renderAccessory("Earrings", earringsEnabled, setEarringsEnabled, earringsColor, setEarringsColor)}
            {renderAccessory("Necklace", necklaceEnabled, setNecklaceEnabled, necklaceColor, setNecklaceColor)}
            {renderAccessory("Hat", hatEnabled, setHatEnabled, hatColor, setHatColor)}
        </div>
    );
};

export default Accessories;
