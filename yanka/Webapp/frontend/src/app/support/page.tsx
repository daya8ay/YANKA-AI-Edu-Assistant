import React from 'react';
import styles from './support.module.css';
import NavBar from '@/components/NavBar';
import Link from "next/link";

export const metadata = {
  title: 'Customer Support - YANKA',
  description: 'Get help and support for your account',
};

const SupportPage = () => {
  return (
    <>
      <NavBar />
      <div className={styles.supportContainer}>
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
        </div>

        <div className={styles.imageRow}>
          <div className={styles.imageItem}>
            <Link href="/#pricing">
              <img src="/pics/support-img1.jpg" alt="Image 1" />
            </Link>
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
