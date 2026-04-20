"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "aws-amplify/auth";
import styles from "./login.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function Login() {
  const { language } = useLanguage();

  const translations = {
    en: {
      welcome: "Welcome Back",
      subtitle: "Log in to your AI-powered portfolio",
      email: "Email Address",
      emailPlaceholder: "Enter your email",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      login: "Login",
      loggingIn: "Logging in…",
      social: "Or continue with",
      noAccount: "Don't have an account?",
      signUp: "Sign Up",
      back: "← Back to Home",
      loginFailed: "Login failed. Please try again.",
      unexpectedStep: "Unexpected step:",
    },
    fr: {
      welcome: "Bon retour",
      subtitle: "Connectez-vous à votre portfolio alimenté par l’IA",
      email: "Adresse e-mail",
      emailPlaceholder: "Entrez votre e-mail",
      password: "Mot de passe",
      passwordPlaceholder: "Entrez votre mot de passe",
      login: "Se connecter",
      loggingIn: "Connexion en cours…",
      social: "Ou continuer avec",
      noAccount: "Vous n'avez pas de compte ?",
      signUp: "S’inscrire",
      back: "← Retour à l’accueil",
      loginFailed: "La connexion a échoué. Veuillez réessayer.",
      unexpectedStep: "Étape inattendue :",
    },
  };

  const t = translations[language];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
        setError(`${t.unexpectedStep} ${nextStep.signInStep}`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t.loginFailed);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <Image
          src="/pics/Y_Logo.jpeg"
          alt="YANKA Logo"
          width={100}
          height={100}
          className={styles.logo}
        />

        <h1>{t.welcome}</h1>
        <p className={styles.subtitle}>{t.subtitle}</p>

        {error && <p className={styles.errorText}>{error}</p>}

        <form className={styles.loginForm} onSubmit={handleSubmit}>
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

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? t.loggingIn : t.login}
          </button>
        </form>

        <div className={styles.socialLogin}>
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

        <p className={styles.signupLink}>
          {t.noAccount} <Link href="/signup">{t.signUp}</Link>
        </p>

        <p className={styles.homeLink}>
          <Link href="/">{t.back}</Link>
        </p>
      </div>
    </div>
  );
}