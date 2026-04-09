'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { faqs } from './faqData';
import styles from './faq.module.css';
import { useSearchParams } from 'next/navigation';

const getSectionId = (faqIndex: number): string => {
  if (faqIndex < 5)  return "section1";
  if (faqIndex < 8)  return "section2";
  if (faqIndex < 10) return "section3";
  if (faqIndex < 12) return "section4";
  if (faqIndex < 15) return "section5";
  if (faqIndex < 17) return "section6";
  if (faqIndex < 20) return "section7";
  if (faqIndex < 22) return "section8";
  if (faqIndex < 24) return "section9";
  return "section10";
};

function FAQContent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const openParam = searchParams.get('open');
    if (openParam !== null) {
      const index = parseInt(openParam);
      setOpenIndex(index);
      setTimeout(() => {
        const el = document.getElementById(getSectionId(index));
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [searchParams]);

  return (
    <div className={styles.page}>
      <div className={styles.stickyNav}>
        <Link href="/support" className={styles.backBtn}>← Back</Link>
      </div>

      <div className={styles.container}>
        <h1 className={styles.title}>Frequently Asked Questions</h1>

        {/* Section 1 */}
        <section id="section1" className={styles.section}>
          <h2 className={styles.sectionTitle}>1. General Questions About Yanka AI</h2>
          <div className={styles.list}>
            {faqs.slice(0, 5).map((faq, i) => (
              <div key={i} className={styles.item} onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                <div className={styles.question}>
                  <span>{faq.question}</span>
                  <span>{openIndex === i ? '∧' : '∨'}</span>
                </div>
                {openIndex === i && <p className={styles.answer}>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 */}
        <section id="section2" className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Getting Started & Accounts</h2>
          <div className={styles.list}>
            {faqs.slice(5, 8).map((faq, i) => (
              <div key={i} className={styles.item} onClick={() => setOpenIndex(openIndex === (i + 5) ? null : (i + 5))}>
                <div className={styles.question}>
                  <span>{faq.question}</span>
                  <span>{openIndex === (i + 5) ? '∧' : '∨'}</span>
                </div>
                {openIndex === (i + 5) && <p className={styles.answer}>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 */}
        <section id="section3" className={styles.section}>
          <h2 className={styles.sectionTitle}>3. AI Learning & Student Support</h2>
          <div className={styles.list}>
            {faqs.slice(8, 10).map((faq, i) => (
              <div key={i} className={styles.item} onClick={() => setOpenIndex(openIndex === (i + 8) ? null : (i + 8))}>
                <div className={styles.question}>
                  <span>{faq.question}</span>
                  <span>{openIndex === (i + 8) ? '∧' : '∨'}</span>
                </div>
                {openIndex === (i + 8) && <p className={styles.answer}>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Section 4 */}
        <section id="section4" className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Academic Research & Thesis Tools</h2>
          <div className={styles.list}>
            {faqs.slice(10, 12).map((faq, i) => (
              <div key={i} className={styles.item} onClick={() => setOpenIndex(openIndex === (i + 10) ? null : (i + 10))}>
                <div className={styles.question}>
                  <span>{faq.question}</span>
                  <span>{openIndex === (i + 10) ? '∧' : '∨'}</span>
                </div>
                {openIndex === (i + 10) && <p className={styles.answer}>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 */}
        <section id="section5" className={styles.section}>
          <h2 className={styles.sectionTitle}>5. AI Avatars, Voice & Video Creation</h2>
          <div className={styles.list}>
            {faqs.slice(12, 15).map((faq, i) => (
              <div key={i} className={styles.item} onClick={() => setOpenIndex(openIndex === (i + 12) ? null : (i + 12))}>
                <div className={styles.question}>
                  <span>{faq.question}</span>
                  <span>{openIndex === (i + 12) ? '∧' : '∨'}</span>
                </div>
                {openIndex === (i + 12) && <p className={styles.answer}>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Section 6 */}
        <section id="section6" className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Course, Training & Content Creation</h2>
          <div className={styles.list}>
            {faqs.slice(15, 17).map((faq, i) => (
              <div key={i} className={styles.item} onClick={() => setOpenIndex(openIndex === (i + 15) ? null : (i + 15))}>
                <div className={styles.question}>
                  <span>{faq.question}</span>
                  <span>{openIndex === (i + 15) ? '∧' : '∨'}</span>
                </div>
                {openIndex === (i + 15) && <p className={styles.answer}>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Section 7 */}
        <section id="section7" className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Marketplace, Monetization & Earnings</h2>
          <div className={styles.list}>
            {faqs.slice(17, 20).map((faq, i) => (
              <div key={i} className={styles.item} onClick={() => setOpenIndex(openIndex === (i + 17) ? null : (i + 17))}>
                <div className={styles.question}>
                  <span>{faq.question}</span>
                  <span>{openIndex === (i + 17) ? '∧' : '∨'}</span>
                </div>
                {openIndex === (i + 17) && <p className={styles.answer}>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Section 8 */}
        <section id="section8" className={styles.section}>
          <h2 className={styles.sectionTitle}>8. Partners & Affiliates</h2>
          <div className={styles.list}>
            {faqs.slice(20, 22).map((faq, i) => (
              <div key={i} className={styles.item} onClick={() => setOpenIndex(openIndex === (i + 20) ? null : (i + 20))}>
                <div className={styles.question}>
                  <span>{faq.question}</span>
                  <span>{openIndex === (i + 20) ? '∧' : '∨'}</span>
                </div>
                {openIndex === (i + 20) && <p className={styles.answer}>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Section 9 */}
        <section id="section9" className={styles.section}>
          <h2 className={styles.sectionTitle}>9. Institutions, Companies & Governments</h2>
          <div className={styles.list}>
            {faqs.slice(22, 24).map((faq, i) => (
              <div key={i} className={styles.item} onClick={() => setOpenIndex(openIndex === (i + 22) ? null : (i + 22))}>
                <div className={styles.question}>
                  <span>{faq.question}</span>
                  <span>{openIndex === (i + 22) ? '∧' : '∨'}</span>
                </div>
                {openIndex === (i + 22) && <p className={styles.answer}>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Section 10 */}
        <section id="section10" className={styles.section}>
          <h2 className={styles.sectionTitle}>10. PRIVACY, SECURITY & ETHICS</h2>
          <div className={styles.list}>
            {faqs.slice(24, 27).map((faq, i) => (
              <div key={i} className={styles.item} onClick={() => setOpenIndex(openIndex === (i + 24) ? null : (i + 24))}>
                <div className={styles.question}>
                  <span>{faq.question}</span>
                  <span>{openIndex === (i + 24) ? '∧' : '∨'}</span>
                </div>
                {openIndex === (i + 24) && <p className={styles.answer}>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FAQContent />
    </Suspense>
  );
}