import React from 'react';
import styles from '../page.module.css';

export const metadata = {
  title: 'Create Your AI Avatar - YANKA',
  description: 'Create your personalized AI avatar for educational content',
};

const AvatarCreation = () => {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1 className={styles.pageTitle}>Create Your AI Avatar</h1>
            </main>
        </div>
    );
};

export default AvatarCreation;