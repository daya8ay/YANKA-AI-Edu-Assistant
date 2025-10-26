'use client';

import React from 'react';
import { useState } from 'react';
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Welcome to YANKA</h1>
        <p>AI-Powered Multilingual Educational Assistant</p>
      </main>
    </div>
  );
}
