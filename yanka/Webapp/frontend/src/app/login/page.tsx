"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "aws-amplify/auth";
import styles from "./login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agreedToTerms) {
      setError("Please agree to the Terms and Conditions before logging in.");
      return;
    }

    setLoading(true);

    try {
      await signOut().catch(() => {});

      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password,
      });

      if (isSignedIn) {
        router.push("/dashboard");
      } else if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
        router.push(`/signup?verify=true&email=${encodeURIComponent(email)}`);
      } else {
        setError(`Unexpected step: ${nextStep.signInStep}`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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

        <h1>Welcome Back</h1>
        <p className={styles.subtitle}>Log in to your AI-powered portfolio</p>

        {/* Error banner */}
        {error && (
          <p className={styles.errorText}>
            {error}
          </p>
        )}

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
                required
              />
            </div>
          </div>

          <div className={styles.termsWrapper}>
            <label className={styles.termsLabel}>
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className={styles.termsCheckbox}
              />
              <span>
                I agree with the{" "}
                <Link href="/terms" className={styles.termsLink}>
                  Terms and Conditions
                </Link>
              </span>
            </label>
          </div>

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>

        <div className={styles.socialLogin}>
          <p>Or continue with</p>
          <div className={styles.socialIcons}>
            <a href="#">
              <Image
                src="/pics/gmail.jpeg"
                alt="Login with Gmail"
                width={38}
                height={38}
              />
            </a>
            <a href="#">
              <Image
                src="/pics/fb.jpeg"
                alt="Login with Facebook"
                width={38}
                height={38}
              />
            </a>
            <a href="#">
              <Image
                src="/pics/linkedin.jpeg"
                alt="Login with LinkedIn"
                width={38}
                height={38}
              />
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