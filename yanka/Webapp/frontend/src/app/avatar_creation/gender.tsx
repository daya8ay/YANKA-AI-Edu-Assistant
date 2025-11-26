"use client";

import React, { useState } from "react";
import styles from "./avatar.module.css";

const Gender = () => {
    const [gender, setGender] = useState("Male");

    const genderOptions = [
        { id: "Male", label: "Male" },
        { id: "Female", label: "Female" },
    ];

    return (
        <div className={styles.tabContent}>
            <div className={styles.section}>
                <h4>Select Gender</h4>
                <div className={styles.styleOptions}>
                    {genderOptions.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => setGender(option.id)}
                            className={`${styles.styleOption} ${
                                gender === option.id ? styles.selected : ""
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

export default Gender;

