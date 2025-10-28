"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./NavBar.module.css";

export default function NavBar() {
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logoLink}>
        <Image
          src="/logo1.svg"
          alt="YANKA Logo"
          width={150}
          height={50}
          className={styles.logo}
        />
      </Link>
      <div className={styles.navLinks}>
        <Link href="/">Home</Link>
        <Link href="/avatar_creation">Avatar Creation</Link>
        <Link href="/video">Video Creation</Link> 
      </div>
    </nav>
  );
}
