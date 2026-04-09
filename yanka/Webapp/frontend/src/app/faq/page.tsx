'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { faqs } from './faqData';
import styles from './faq.module.css';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState('section1');
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setStuck(window.scrollY > 80);

    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={styles.page}>

      {/* Sticky Section Nav */}
      <div className={`${styles.stickyNav} ${stuck ? styles.stickyNavScrolled : ''}`}>
        <Link href="/support" className={styles.backBtn}>← Back</Link>
      </div>

      <div className={styles.container}>
        <h1 className={styles.title}>Frequently Asked Questions</h1>

        {/* Section 1 */}
        <section id="section1" className={styles.section}>
          <h2 className={styles.sectionTitle}>1. General Questions About Yanka AI</h2>
          <div className={styles.list}>
            {faqs.slice(0, 3).map((faq, i) => (
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
            {faqs.slice(3, 5).map((faq, i) => (
              <div key={i} className={styles.item} onClick={() => setOpenIndex(openIndex === (i + 3) ? null : (i + 3))}>
                <div className={styles.question}>
                  <span>{faq.question}</span>
                  <span>{openIndex === (i + 3) ? '∧' : '∨'}</span>
                </div>
                {openIndex === (i + 3) && <p className={styles.answer}>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 */}
        <section id="section3" className={styles.section}>
          <h2 className={styles.sectionTitle}>3. AI Learning & Student Support</h2>
          <div className={styles.list}>
            {faqs.slice(5, 7).map((faq, i) => (
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
              
        {/* Section 4 */}
        <section id="section3" className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Academic Research & Thesis Tools</h2>
          <div className={styles.list}>
            {faqs.slice(7, 9).map((faq, i) => (
              <div key={i} className={styles.item} onClick={() => setOpenIndex(openIndex === (i + 7) ? null : (i + 7))}>
                <div className={styles.question}>
                  <span>{faq.question}</span>
                  <span>{openIndex === (i + 7) ? '∧' : '∨'}</span>
                </div>
                {openIndex === (i + 7) && <p className={styles.answer}>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>
              
        {/* Section 5 */}
        <section id="section3" className={styles.section}>
          <h2 className={styles.sectionTitle}>5. AI Avatars, Voice & Video Creation</h2>
          <div className={styles.list}>
            {faqs.slice(9, 11).map((faq, i) => (
              <div key={i} className={styles.item} onClick={() => setOpenIndex(openIndex === (i + 9) ? null : (i + 9))}>
                <div className={styles.question}>
                  <span>{faq.question}</span>
                  <span>{openIndex === (i + 9) ? '∧' : '∨'}</span>
                </div>
                {openIndex === (i + 9) && <p className={styles.answer}>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>
              
        {/* Section 6 */}
        <section id="section3" className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Course, Training & Content Creation</h2>
          <div className={styles.list}>
            {faqs.slice(11, 13).map((faq, i) => (
              <div key={i} className={styles.item} onClick={() => setOpenIndex(openIndex === (i + 11) ? null : (i + 11))}>
                <div className={styles.question}>
                  <span>{faq.question}</span>
                  <span>{openIndex === (i + 11) ? '∧' : '∨'}</span>
                </div>
                {openIndex === (i + 11) && <p className={styles.answer}>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Section 7 */}
        <section id="section3" className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Marketplace, Monetization & Earnings</h2>
          <div className={styles.list}>
            {faqs.slice(13, 16).map((faq, i) => (
              <div key={i} className={styles.item} onClick={() => setOpenIndex(openIndex === (i + 13) ? null : (i + 13))}>
                <div className={styles.question}>
                  <span>{faq.question}</span>
                  <span>{openIndex === (i + 13) ? '∧' : '∨'}</span>
                </div>
                {openIndex === (i + 13) && <p className={styles.answer}>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Section 8 */}
        <section id="section3" className={styles.section}>
          <h2 className={styles.sectionTitle}>8. Partners & Affiliates</h2>
          <div className={styles.list}>
            {faqs.slice(16, 18).map((faq, i) => (
              <div key={i} className={styles.item} onClick={() => setOpenIndex(openIndex === (i + 16) ? null : (i + 16))}>
                <div className={styles.question}>
                  <span>{faq.question}</span>
                  <span>{openIndex === (i + 16) ? '∧' : '∨'}</span>
                </div>
                {openIndex === (i + 16) && <p className={styles.answer}>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Section 9 */}
        <section id="section3" className={styles.section}>
          <h2 className={styles.sectionTitle}>9. Institutions, Companies & Governments</h2>
          <div className={styles.list}>
            {faqs.slice(18, 19).map((faq, i) => (
              <div key={i} className={styles.item} onClick={() => setOpenIndex(openIndex === (i + 18) ? null : (i + 18))}>
                <div className={styles.question}>
                  <span>{faq.question}</span>
                  <span>{openIndex === (i + 18) ? '∧' : '∨'}</span>
                </div>
                {openIndex === (i + 18) && <p className={styles.answer}>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Section 10 */}
        <section id="section3" className={styles.section}>
          <h2 className={styles.sectionTitle}>10. Pricing, Plans & Payments</h2>
          <div className={styles.list}>
            {faqs.slice(19, 20).map((faq, i) => (
                <div key={i} className={styles.item} onClick={() => setOpenIndex(openIndex === (i + 19) ? null : (i + 19))}>
                <div className={styles.question}>
                  <span>{faq.question}</span>
                  <span>{openIndex === (i + 19) ? '∧' : '∨'}</span>
                </div>
                {openIndex === (i + 19) && <p className={styles.answer}>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Section 11 */}
        <section id="section3" className={styles.section}>
          <h2 className={styles.sectionTitle}>11. Privacy, Security & Ethics</h2>
          <div className={styles.list}>
            {faqs.slice(20, 21).map((faq, i) => (
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
              
        {/* Section 12 */}
        <section id="section3" className={styles.section}>
          <h2 className={styles.sectionTitle}>12. Technical & Platform Questions</h2>
          <div className={styles.list}>
            {faqs.slice(21, 23).map((faq, i) => (
              <div key={i} className={styles.item} onClick={() => setOpenIndex(openIndex === (i + 21) ? null : (i + 21))}>
                <div className={styles.question}>
                  <span>{faq.question}</span>
                  <span>{openIndex === (i + 21) ? '∧' : '∨'}</span>
                </div>
                {openIndex === (i + 21) && <p className={styles.answer}>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Section 13 */}
        <section id="section3" className={styles.section}>
          <h2 className={styles.sectionTitle}>13. Support & Resources</h2>
          <div className={styles.list}>
            {faqs.slice(23).map((faq, i) => (
              <div key={i} className={styles.item} onClick={() => setOpenIndex(openIndex === (i + 27) ? null : (i + 27))}>
                <div className={styles.question}>
                  <span>{faq.question}</span>
                  <span>{openIndex === (i + 27) ? '∧' : '∨'}</span>
                </div>
                {openIndex === (i + 27) && <p className={styles.answer}>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}