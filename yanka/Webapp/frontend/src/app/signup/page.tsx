"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signUp } from "aws-amplify/auth";
import { v4 as uuidv4 } from "uuid";
import styles from "./signup.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function SignUp() {
  const { language } = useLanguage();

  const translations = {
    en: {
      subtitle: "Empower your academic journey with AI",
      fullName: "Full Name",
      namePlaceholder: "Enter your full name",
      email: "Email Address",
      emailPlaceholder: "Enter your email",
      password: "Password",
      passwordPlaceholder: "Create a password",

      agreeTerms: "I agree with the",
      terms: "Terms and Conditions",
      agreePrivacy: "I agree with the",
      privacy: "Privacy Policy",

      createAccount: "Create Account",
      creating: "Creating account…",

      social: "Or sign up with",

      loginText: "Already have an account?",
      login: "Log in",

      back: "← Back to Home",

      errorTerms:
        "Please agree to the Terms and Conditions before creating your account.",
      errorPrivacy:
        "Please agree to the Privacy Policy before creating your account.",
      errorGeneric: "Sign up failed. Please try again.",
    },

    fr: {
      subtitle: "Boostez votre parcours académique avec l’IA",
      fullName: "Nom complet",
      namePlaceholder: "Entrez votre nom complet",
      email: "Adresse e-mail",
      emailPlaceholder: "Entrez votre e-mail",
      password: "Mot de passe",
      passwordPlaceholder: "Créer un mot de passe",

      agreeTerms: "J’accepte les",
      terms: "Conditions générales",
      agreePrivacy: "J’accepte la",
      privacy: "Politique de confidentialité",

      createAccount: "Créer un compte",
      creating: "Création du compte…",

      social: "Ou inscrivez-vous avec",

      loginText: "Vous avez déjà un compte ?",
      login: "Se connecter",

      back: "← Retour à l’accueil",

      errorTerms:
        "Veuillez accepter les conditions générales avant de créer votre compte.",
      errorPrivacy:
        "Veuillez accepter la politique de confidentialité avant de créer votre compte.",
      errorGeneric: "Échec de l'inscription. Veuillez réessayer.",
    },
  };

  const t = translations[language];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agreedToTerms) {
      setError(t.errorTerms);
      return;
    }

    if (!agreedToPrivacy) {
      setError(t.errorPrivacy);
      return;
    }

    setLoading(true);

    try {
      const username = uuidv4();

      await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
            name,
          },
        },
      });

      router.push(
        `/signup/verify?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}`
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t.errorGeneric);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupBox}>
        <Image
          src="/pics/Y_Logo.jpeg"
          alt="YANKA Logo"
          width={100}
          height={100}
          className={styles.logo}
        />

        <p className={styles.subtitle}>{t.subtitle}</p>

        {error && <p className={styles.errorText}>{error}</p>}

        <form className={styles.signupForm} onSubmit={handleSubmit}>
          {/* Name */}
          <div className={styles.formGroup}>
            <label htmlFor="name">{t.fullName}</label>
            <input
              type="text"
              id="name"
              placeholder={t.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label htmlFor="email">{t.email}</label>
            <input
              type="email"
              id="email"
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className={`${styles.formGroup} ${styles.passwordGroup}`}>
            <label htmlFor="password">{t.password}</label>
            <div className={styles.passwordWrapper}>
              <input
                type="password"
                id="password"
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Terms */}
          <div className={styles.termsWrapper}>
            <label className={styles.termsLabel}>
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className={styles.termsCheckbox}
              />
              <span>
                {t.agreeTerms}{" "}
                <Link href="/terms" className={styles.termsLink}>
                  {t.terms}
                </Link>
              </span>
            </label>
          </div>

          {/* Privacy */}
          <div className={styles.termsWrapper}>
            <label className={styles.termsLabel}>
              <input
                type="checkbox"
                checked={agreedToPrivacy}
                onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                className={styles.termsCheckbox}
              />
              <span>
                {t.agreePrivacy}{" "}
                <Link href="/privacy" className={styles.termsLink}>
                  {t.privacy}
                </Link>
              </span>
            </label>
          </div>

          {/* Submit */}
          <button type="submit" className={styles.signupBtn} disabled={loading}>
            {loading ? t.creating : t.createAccount}
          </button>
        </form>

        {/* Social */}
        <div className={styles.socialSignup}>
          <p>{t.social}</p>
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

        {/* Login */}
        <p className={styles.loginLink}>
          {t.loginText} <Link href="/login">{t.login}</Link>
        </p>

        {/* Back */}
        <p className={styles.homeLink}>
          <Link href="/">{t.back}</Link>
        </p>
      </div>
    </div>
  );
}