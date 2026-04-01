"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import NavBar from "@/components/NavBar";
import DashboardNavBar from "@/components/DashboardNavBar";
import SupportContent from "./SupportContent";
import styles from "./support.module.css";

export default function SupportPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false))
      .finally(() => setAuthChecked(true));
  }, []);

  if (!authChecked) return null;

  return (
    <div className={styles.pageWrapper}>
      {isLoggedIn ? <DashboardNavBar /> : <NavBar />}
      <div className={styles.page}>
        <SupportContent />
      </div>
    </div>
  );
}
