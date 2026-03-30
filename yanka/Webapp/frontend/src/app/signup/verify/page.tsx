"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import styles from "../signup.module.css";

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResendMessage(null);
    setLoading(true);

    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setResendMessage(null);

    try {
      await resendSignUpCode({ username: email });
      setResendMessage("A new code has been sent to your email.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to resend code. Please try again.");
      }
    }
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

        <h1 style={{ fontWeight: 700, color: "#0041ad", marginBottom: "0.4rem" }}>
          Verify your email
        </h1>
        <p className={styles.subtitle}>
          We sent a 6-digit code to <strong>{email}</strong>
        </p>

        {/* Error banner */}
        {error && (
          <p style={{ color: "red", marginBottom: "12px", fontSize: "14px" }}>
            {error}
          </p>
        )}

        {/* Resend success message */}
        {resendMessage && (
          <p style={{ color: "green", marginBottom: "12px", fontSize: "14px" }}>
            {resendMessage}
          </p>
        )}

        <form className={styles.signupForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="code">Verification Code</label>
            <input
              type="text"
              id="code"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value.trim())}
              maxLength={6}
              required
              autoComplete="one-time-code"
            />
          </div>

          <button
            type="submit"
            className={styles.signupBtn}
            disabled={loading}
          >
            {loading ? "Verifying…" : "Verify Email"}
          </button>
        </form>

        {/* Resend code */}
        <p style={{ marginTop: "1.2rem", fontSize: "0.9rem", color: "#555" }}>
          Didn&apos;t receive a code?{" "}
          <button
            onClick={handleResend}
            style={{
              background: "none",
              border: "none",
              color: "#243b82",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.9rem",
              padding: 0,
            }}
          >
            Resend code
          </button>
        </p>

        <p className={styles.homeLink}>
          <Link href="/login">← Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div />}>
      <VerifyForm />
    </Suspense>
  );
}
