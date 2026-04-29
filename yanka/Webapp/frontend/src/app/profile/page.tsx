"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DashboardNavBar from "@/components/DashboardNavBar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import styles from "./page.module.css";

export default function ProfilePage() {
  const { authStatus, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login");
    }
  }, [authStatus, router]);

  if (authStatus !== "authenticated") {
    return null;
  }

  const email =
    user?.signInDetails?.loginId ||
    user?.username ||
    "student@yanka.com";

  const displayName =
    user?.signInDetails?.loginId?.split("@")[0] ||
    user?.username?.split("@")[0] ||
    "Student";

  const formattedName =
    displayName.charAt(0).toUpperCase() + displayName.slice(1);

  return (
    <>
      <DashboardNavBar />

      <main className={styles.profilePage}>
        {/* HERO SECTION */}
        <section className={styles.heroSection}>
          <div className={styles.heroText}>
            <p className={styles.breadcrumb}>Dashboard / Profile</p>
            <h1>My Profile</h1>
            <p>
              Manage your personal information and keep your learning profile up
              to date.
            </p>
          </div>

          <div className={styles.avatarCard}>
            <Image
              src="/pics/user_avatar.jpeg"
              alt="User Avatar"
              width={140}
              height={140}
              className={styles.avatar}
            />
            <h2>{formattedName}</h2>
            <p>{email}</p>
          </div>
        </section>

        {/* PROFILE GRID */}
        <section className={styles.profileGrid}>
          {/* PERSONAL */}
          <div className={styles.infoCard}>
            <h3>Personal Information</h3>

            <div className={styles.infoRow}>
              <span className={styles.label}>Full Name</span>
              <span className={styles.value}>{formattedName}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>{email}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Phone Number</span>
              <span className={styles.value}>+1 (000) 000-0000</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Date of Birth</span>
              <span className={styles.value}>MM/DD/YYYY</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Gender</span>
              <span className={styles.value}>Not specified</span>
            </div>
          </div>

          {/* ACADEMIC */}
          <div className={styles.infoCard}>
            <h3>Academic Details</h3>

            <div className={styles.infoRow}>
              <span className={styles.label}>Student ID</span>
              <span className={styles.value}>YKA-2026-001</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Grade / Level</span>
              <span className={styles.value}>Level 3</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Preferred Language</span>
              <span className={styles.value}>English</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Enrollment Status</span>
              <span className={styles.value}>Active</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Learning Goal</span>
              <span className={styles.value}>Complete weekly lessons</span>
            </div>
          </div>

          {/* ADDRESS */}
          <div className={styles.infoCard}>
            <h3>Address Details</h3>

            <div className={styles.infoRow}>
              <span className={styles.label}>Country</span>
              <span className={styles.value}>United States</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>State</span>
              <span className={styles.value}>Arizona</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>City</span>
              <span className={styles.value}>Tempe</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Postal Code</span>
              <span className={styles.value}>85281</span>
            </div>
          </div>

          {/* ACCOUNT */}
          <div className={styles.infoCard}>
            <h3>Account Settings</h3>

            <div className={styles.infoRow}>
              <span className={styles.label}>Username</span>
              <span className={styles.value}>{displayName}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Password</span>
              <span className={styles.value}>••••••••••</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Notifications</span>
              <span className={styles.value}>Enabled</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Account Type</span>
              <span className={styles.value}>Student</span>
            </div>
          </div>

          {/* 💳 PAYMENT DETAILS (NEW) */}
          <div className={styles.infoCard}>
            <h3>Payment Details</h3>

            <div className={styles.infoRow}>
              <span className={styles.label}>Pricing Plan</span>
              <span className={styles.value}>Premium Monthly</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Card Type</span>
              <span className={styles.value}>Visa</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Card Number</span>
              <span className={styles.value}>•••• •••• •••• 4242</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Billing Cycle</span>
              <span className={styles.value}>Monthly</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Next Payment</span>
              <span className={styles.value}>May 28, 2026</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Payment Status</span>
              <span className={styles.value}>Active</span>
            </div>
          </div>
        </section>

        {/* ACTION BUTTONS */}
        <section className={styles.actionSection}>
          <button className={styles.primaryBtn}>Edit Profile</button>
          <button className={styles.secondaryBtn}>Change Password</button>
          <button className={styles.secondaryBtn}>Manage Payment</button>
        </section>
      </main>

      <Footer />
    </>
  );
}