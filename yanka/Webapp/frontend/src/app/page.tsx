'use client';

import { useState } from 'react';
import styles from "./page.module.css";

export default function Home() {
  const [message, setMessage] = useState('Hello World!');

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>{message}</h1>
        <p>Welcome to YANKA - AI-Powered Multilingual Educational Assistant</p>
      </main>
    </div>
  );
}
