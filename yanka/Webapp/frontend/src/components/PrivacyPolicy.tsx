"use client";

import React from "react";
import Link from "next/link";
import styles from "./PrivacyPolicy.module.css";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className={styles.privacyPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGlow}></div>

        <div className={styles.heroContent}>
          <div className={styles.breadcrumb}>
            <Link href="/">Home</Link> / Privacy Policy
          </div>

          <span className={styles.badge}>Yanka AI Legal</span>

          <h1>Privacy Policy</h1>

          <p className={styles.heroText}>
            At Yanka AI, we are committed to protecting your privacy and handling
            your data responsibly. This Privacy Policy explains what information
            we collect, how we use it, and the choices you have while using our
            platform.
          </p>

          <div className={styles.metaRow}>
            <span>Effective Date: February 23, 2026</span>
            <span>Last Updated: February 23, 2026</span>
            <span>Version 2.0</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.contentSection}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <h3>On this page</h3>
            <ul>
              <li><a href="#commitment">1. Our Commitment to Privacy</a></li>
              <li><a href="#collection">2. Information We Collect</a></li>
              <li><a href="#usage">3. How We Use Your Information</a></li>
              <li><a href="#ai-data">4. AI, Avatars & Learning Data</a></li>
              <li><a href="#sharing">5. Data Sharing & Disclosure</a></li>
              <li><a href="#transfers">6. International Data Transfers</a></li>
              <li><a href="#rights">7. Your Rights</a></li>
              <li><a href="#retention">8. Data Retention</a></li>
              <li><a href="#security">9. Security Measures</a></li>
              <li><a href="#children">10. Children & Minors</a></li>
              <li><a href="#contact">11. Contact & Complaints</a></li>
              <li><a href="#updates">12. Policy Updates</a></li>
            </ul>
          </div>
        </aside>

        {/* Content */}
        <div className={styles.mainContent}>
          <div className={styles.introCard}>
            <p>
              Yanka AI is committed to privacy by design, data minimization, and
              strong security practices. We do not sell personal data, and we do
              not use your private content to train external AI models without
              your explicit informed consent.
            </p>
          </div>

          <div className={styles.card} id="commitment">
            <h2>1. Our Commitment to Privacy</h2>
            <p>
              At Yanka AI, privacy is a core value, not an afterthought. Our
              platform is built on three foundational principles:
            </p>
            <ul>
              <li><strong>Privacy by Design:</strong> privacy protections are built into every feature from the ground up.</li>
              <li><strong>Data Minimization:</strong> we collect only what is strictly necessary to provide our services.</li>
              <li><strong>Security First:</strong> industry-leading encryption and access controls protect all data.</li>
            </ul>
            <p>
              We will never sell your personal data. We will never use your
              private content to train external AI models without your explicit,
              informed consent.
            </p>
          </div>

          <div className={styles.card} id="collection">
            <h2>2. Information We Collect</h2>

            <h3>2.1 Information You Provide</h3>
            <ul>
              <li>Name, email address, and username</li>
              <li>Account credentials and profile information</li>
              <li>Payment and billing information processed by secure third-party gateways</li>
              <li>Content you create or upload, such as courses, videos, scripts, documents, and research</li>
              <li>Communications with Yanka AI, including support tickets, feedback, and survey responses</li>
            </ul>

            <h3>2.2 AI-Generated & Educational Content</h3>
            <ul>
              <li>Text prompts, scripts, and course outlines you provide</li>
              <li>AI-generated videos, avatars, voices, quizzes, and courses</li>
              <li>Academic content such as notes, drafts, thesis materials, and research data</li>
            </ul>
            <p>
              <strong>Important:</strong> You own all content you create on
              Yanka AI. We do not sell your personal or educational content to any
              third party.
            </p>

            <h3>2.3 Automatically Collected Technical Data</h3>
            <ul>
              <li>Device type, browser type, and operating system</li>
              <li>IP address used for security, fraud prevention, and regional compliance</li>
              <li>Usage data such as session duration, accessed features, and navigation patterns</li>
              <li>Platform analytics like content views, quiz completion, and video engagement</li>
            </ul>

            <h3>2.4 Cookies & Tracking Technologies</h3>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Maintain secure login sessions</li>
              <li>Personalize content recommendations</li>
              <li>Analyze and optimize platform performance</li>
              <li>Enable marketplace and payment functionality</li>
            </ul>
          </div>

          <div className={styles.card} id="usage">
            <h2>3. How We Use Your Information</h2>
            <p>Yanka AI uses your information exclusively to:</p>
            <ul>
              <li>Operate and deliver the Yanka AI platform and its services</li>
              <li>Power AI learning, avatar generation, and content creation tools</li>
              <li>Enable course publishing, marketplace sales, and creator monetization</li>
              <li>Process payments, subscriptions, and revenue distributions</li>
              <li>Improve educational quality, platform features, and AI accuracy</li>
              <li>Ensure platform security and prevent fraud or abuse</li>
              <li>Fulfill legal obligations and regulatory compliance requirements</li>
              <li>Communicate service updates, security notices, and support responses</li>
            </ul>
            <p>
              We do not use your personal data to train external AI models
              without your explicit consent. We do not sell your data or share
              it for advertising purposes.
            </p>
          </div>

          <div className={styles.card} id="ai-data">
            <h2>4. AI, Avatars & Learning Data</h2>
            <ul>
              <li>AI outputs are generated based solely on your inputs and selected content</li>
              <li>AI avatars do not represent or impersonate real people without explicit authorization</li>
              <li>Voice cloning is strictly opt-in and can be revoked at any time</li>
              <li>AI does not make legal, medical, financial, or other high-stakes decisions on your behalf</li>
              <li>AI-generated content is marked with transparency metadata</li>
              <li>You retain responsibility for reviewing and validating AI-generated content before use</li>
            </ul>
          </div>

          <div className={styles.card} id="sharing">
            <h2>5. Data Sharing & Disclosure</h2>

            <h3>5.1 Service Providers</h3>
            <p>
              We may share limited, anonymized, or pseudonymized data with
              trusted third-party providers for cloud hosting, payment
              processing, analytics, and customer support.
            </p>

            <h3>5.2 Legal Requirements</h3>
            <p>
              Yanka AI may disclose data only when legally required, such as in
              response to a court order, regulatory investigation, or
              enforcement of our Terms & Conditions.
            </p>

            <h3>5.3 Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, or restructuring, user data
              may be transferred with appropriate safeguards and user
              notification.
            </p>
          </div>

          <div className={styles.card} id="transfers">
            <h2>6. International Data Transfers</h2>
            <p>
              Yanka AI operates globally, and your data may be processed in
              different countries. All international data transfers are
              conducted with appropriate legal safeguards, including Standard
              Contractual Clauses where required and data processing agreements
              with sub-processors.
            </p>
          </div>

          <div className={styles.card} id="rights">
            <h2>7. Your Rights</h2>

            <h3>7.1 GDPR Rights</h3>
            <ul>
              <li>Right to access</li>
              <li>Right to correction</li>
              <li>Right to erasure</li>
              <li>Right to restriction</li>
              <li>Right to portability</li>
              <li>Right to object</li>
              <li>Right to withdraw consent</li>
            </ul>

            <h3>7.2 CCPA/CPRA Rights</h3>
            <ul>
              <li>Right to know what personal data is collected, used, and shared</li>
              <li>Right to delete</li>
              <li>Right to opt-out</li>
              <li>Right to non-discrimination</li>
              <li>Right to correct inaccurate personal information</li>
            </ul>

            <h3>7.3 How to Exercise Your Rights</h3>
            <p>
              Submit privacy requests through your account privacy settings
              dashboard or by contacting the Yanka AI privacy team. Identity
              verification may be required.
            </p>
          </div>

          <div className={styles.card} id="retention">
            <h2>8. Data Retention</h2>
            <ul>
              <li>Active accounts: retained as long as needed to provide services</li>
              <li>Closed accounts: deleted or anonymized within 90 days of closure</li>
              <li>Financial records: retained for 7 years as required by law</li>
              <li>AI-generated content: deleted upon user request unless legally required</li>
              <li>Security logs: retained for 12 months for fraud prevention and audit purposes</li>
            </ul>
          </div>

          <div className={styles.card} id="security">
            <h2>9. Security Measures</h2>
            <ul>
              <li>TLS 1.3 encryption for data in transit</li>
              <li>AES-256 encryption for data at rest</li>
              <li>Role-based access with multi-factor authentication</li>
              <li>Secure cloud infrastructure with strong compliance practices</li>
              <li>Regular security testing and privacy impact assessments</li>
            </ul>
            <p>
              No system is 100% secure, but Yanka AI takes strong measures to
              protect user information and will notify affected users of data
              breaches where required by law.
            </p>
          </div>

          <div className={styles.card} id="children">
            <h2>10. Children & Minors</h2>
            <p>
              Yanka AI is not intended for children under 13 without parental or
              institutional supervision. For institutional deployments involving
              minors, enhanced consent workflows, safety protections, and
              educational-use restrictions may apply.
            </p>
          </div>

          <div className={styles.card} id="contact">
            <h2>11. Contact & Complaints</h2>
            <p>
              For privacy questions, complaints, or requests, users may contact
              the Yanka AI privacy team through designated support channels and
              account settings.
            </p>
          </div>

          <div className={styles.card} id="updates">
            <h2>12. Policy Updates</h2>
            <p>
              We may update this Privacy Policy to reflect legal, technical, or
              platform changes. Material updates will be communicated through
              email, platform alerts, or updated notices on the website.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;