import React from 'react';
import styles from './video.module.css';
import NavBar from '@/components/NavBar';

export const metadata = {
  title: 'Video Creation - YANKA',
  description: 'Create educational video content with YANKA',
};

const VideoCreation = () => {
  return (
    <>
      <NavBar />
      <div className={styles.page}>
        <main className={styles.main}>
          <h1 className={styles.pageTitle}>Video Creation</h1>
        </main>
      </div>
    </>
  );
};

export default VideoCreation;