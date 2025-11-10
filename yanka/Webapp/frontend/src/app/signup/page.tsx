"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; // ✅ import this
import styles from "./signup.module.css";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // ✅ initialize router

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, skip validation and go to dashboard
    console.log("SignUp:", { name, email, password });
    router.push("/dashboard"); // ✅ navigate to dashboard
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupBox}>
        {/* LOGO */}
        <Image 
          src="/pics/Y_Logo.jpeg" 
          alt="YANKA Logo" 
          width={100} 
          height={100} 
          className={styles.logo}
        />
        
        <p className={styles.subtitle}>Empower your academic journey with AI</p>

        <form className={styles.signupForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.passwordGroup}`}>
            <label htmlFor="password">Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type="password"
                id="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className={styles.signupBtn}>
            Create Account
          </button>
        </form>

        <div className={styles.socialSignup}>
          <p>Or sign up with</p>
          <div className={styles.socialIcons}>
            <a href="#">
              <Image src="/pics/gmail.jpeg" alt="Gmail" width={38} height={38} />
            </a>
            <a href="#">
              <Image src="/pics/fb.jpeg" alt="Facebook" width={38} height={38} />
            </a>
            <a href="#">
              <Image src="/pics/linkedin.jpeg" alt="LinkedIn" width={38} height={38} />
            </a>
          </div>
        </div>

        <p className={styles.loginLink}>
          Already have an account? <Link href="/login">Log in</Link>
        </p>
        <p className={styles.homeLink}>
          <Link href="/">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
