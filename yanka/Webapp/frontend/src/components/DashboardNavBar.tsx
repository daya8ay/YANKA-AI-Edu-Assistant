"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./DashboardNavBar.module.css";

const DashboardNavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll <= 0) setIsScrolled(false);
      else if (currentScroll > lastScroll) setIsScrolled(true);
      else setIsScrolled(false);
      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <header className={`${styles.navbar} ${isScrolled ? styles.scrollDown : ""}`}>
      <Link href="/dashboard" className={styles.logoContainer}>
        <Image
          src="/pics/Y_Logo.jpeg"
          alt="YANKA Logo"
          width={80}      // increased
          height={80}     // increased
          className={styles.logoImg}
        />
      </Link>

      <nav>
        <ul>
          <li><Link href="/courses">Courses</Link></li>
          <li><Link href="/avatar_creation">Avatar Creation</Link></li>
          <li><Link href="/video">Video</Link></li>
          <li><Link href="/login" className={styles.logoutBtn}>Logout</Link></li>
          <li>
            <Image
              src="/pics/user_avatar.jpeg"
              alt="User Avatar"
              width={36}
              height={36}
              className={styles.userAvatar}
            />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default DashboardNavBar;
