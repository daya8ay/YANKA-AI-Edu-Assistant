"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; // ✅ Import router
import styles from "./login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // ✅ Initialize router

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, skip authentication
    console.log("Login:", { email, password });
    router.push("/dashboard"); // ✅ Redirect to dashboard
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        {/* LOGO */}
        <Image 
          src="/pics/Y_Logo.jpeg" 
          alt="YANKA Logo" 
          width={100} 
          height={100} 
          className={styles.logo}
        />

        <h1>
          Welcome Back
        </h1>
        <p className={styles.subtitle}>
          Log in to your AI-powered portfolio
        </p>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className={styles.loginBtn}>
            Login
          </button>
        </form>

        <div className={styles.socialLogin}>
          <p>Or continue with</p>
          <div className={styles.socialIcons}>
            <a href="#">
              <Image src="/pics/gmail.jpeg" alt="Login with Gmail" width={38} height={38} />
            </a>
            <a href="#">
              <Image src="/pics/fb.jpeg" alt="Login with Facebook" width={38} height={38} />
            </a>
            <a href="#">
              <Image src="/pics/linkedin.jpeg" alt="Login with LinkedIn" width={38} height={38} />
            </a>
          </div>
        </div>

        <p className={styles.signupLink}>
          Don&apos;t have an account? <Link href="/signup">Sign Up</Link>
        </p>

        <p className={styles.homeLink}>
          <Link href="/">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
