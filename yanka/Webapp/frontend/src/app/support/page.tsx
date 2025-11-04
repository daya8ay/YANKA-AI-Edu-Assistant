import React from 'react';
import styles from './support.module.css';
import NavBar from '@/components/NavBar';
// import styles from '../page.module.css';

export const metadata = {
  title: 'Customer Support - YANKA',
  description: 'Get help and support for your account',
};

const SupportPage = () => {
  return (
    <>
      <NavBar />
      <div className={styles.page}>
        <main className={styles.main}>
          <h2 className={styles.leftText}>How can we help?</h2>
          <input
            type="text"
            placeholder="Search how-tos and more"
            className={styles.searchBox}
          />
        </main>
          <div className={styles.suggestions}>
            <h3>New to Yanka?</h3>
            {/* You can add more content here */}
        </div>
        <div className={styles.imageRow}>
        <div className={styles.imageItem}>
          <img src="/pics/support-img1.jpg" alt="Image 1" />
          <p>Getting started with Yanka</p>
        </div>
        <div className={styles.imageItem}>
          <img src="/pics/support-img3.jpg" alt="Image 2" />
          <p>Video Tutorials</p>
        </div>
        <div className={styles.imageItem}>
          <img src="/pics/support-img2.webp" alt="Image 3" />
          <p>Navigating the Yanka interface</p>
        </div>
      </div>

      </div>
    </>
  );
};

export default SupportPage;
