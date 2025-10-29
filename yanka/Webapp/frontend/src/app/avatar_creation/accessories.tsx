"use client";

import React, { useState } from "react";
import styles from "./avatar.module.css";
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
                        ✓ On
                    </button>
                    <button
                        className={`${styles.styleOption} ${!enabled ? styles.selected : ""}`}
                        onClick={() => setEnabled(false)}
                        style={{ padding: '8px 16px', minWidth: '60px' }}
                    >
                        ✕ Off
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
            {renderAccessory("Glasses", glassesEnabled, setGlassesEnabled, glassesColor, setGlassesColor)}
            {renderAccessory("Earrings", earringsEnabled, setEarringsEnabled, earringsColor, setEarringsColor)}
            {renderAccessory("Necklace", necklaceEnabled, setNecklaceEnabled, necklaceColor, setNecklaceColor)}
            {renderAccessory("Hat", hatEnabled, setHatEnabled, hatColor, setHatColor)}
            {renderAccessory("Scarf", scarfEnabled, setScarfEnabled, scarfColor, setScarfColor)}
        </div>
    );
};

export default Accessories;
