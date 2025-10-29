import React from 'react';
import styles from './support.module.css';
// import styles from '../page.module.css';

export const metadata = {
  title: 'Customer Support - YANKA',
  description: 'Get help and support for your account',
};

const SupportPage = () => {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Hello, User!</h1>
        {/* <p>Welcome to the Customer Support page.</p> */}
        <h2 className={styles.leftText}>How can we help?</h2> 
        <input
          type="text"
          placeholder="Search how-tos and more"
          className={styles.searchBox}
        />
      </main>
    </div>
  );
};

export default SupportPage;
