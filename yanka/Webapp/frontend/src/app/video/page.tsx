import React from 'react';
import styles from '../page.module.css';

export const metadata = {
  title: 'Video Creation - YANKA',
  description: 'Create educational video content with YANKA',
};

const VideoCreation = () => {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Video Creation</h1>
      </main>
    </div>
  );
};

export default VideoCreation;