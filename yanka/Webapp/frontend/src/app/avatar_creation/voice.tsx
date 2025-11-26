"use client";

import React, { useState } from "react";
import styles from "./avatar.module.css";

const Voice = () => {
    const [voice, setVoice] = useState("Voice 1");

    const voiceOptions = [
        { id: "Voice 1", label: "Voice 1" },
        { id: "Voice 2", label: "Voice 2" },
        { id: "Voice 3", label: "Voice 3" },
        { id: "Voice 4", label: "Voice 4" },
        { id: "Voice 5", label: "Voice 5" },
    ];

    return (
        <div className={styles.tabContent}>
            <div className={styles.section}>
                <h4>Select Voice</h4>
                <div className={styles.styleOptions}>
                    {voiceOptions.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => setVoice(option.id)}
                            className={`${styles.styleOption} ${
                                voice === option.id ? styles.selected : ""
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Voice;

