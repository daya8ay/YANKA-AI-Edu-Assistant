"use client";

import React, { useState } from "react";
import DashboardNavBar from "../../components/DashboardNavBar";
import Footer from "@/components/Footer"; 
import VideoChat from "./VideoChat";
import styles from "../page.module.css";

const VideoCreation = () => {
  const [title, setTitle] = useState("");
  const [script, setScript] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoType, setVideoType] = useState("");
  const [customVideoType, setCustomVideoType] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  const handleSubmit = async () => {
    if (!title) {
      setError("Please enter a video title.");
      return;
    }
    if (!script && !file) {
      setError("Please provide a script or upload a lesson file.");
      return;
    }

    setError("");
    setIsGenerating(true);

    setShowSummary(false);

    setTimeout(() => {
      setIsGenerating(false);
      setShowSummary(true);
      alert("Form is valid. This feature is still under development.");
    }, 1500);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) alert("File uploaded successfully!");
    } catch (err) {
      setError("Error uploading file.");
    }
  };

  return (
    <>
      <DashboardNavBar />
      <section
        style={{
          background: "linear-gradient(135deg, #eef2ff 0%, #ffffff 100%)",
          padding: "100px 80px",
          borderRadius: "20px",
          margin: "40px auto 60px",
          maxWidth: "1400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "4rem",
          boxShadow: "0 6px 24px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <img
            src="/pics/video-lesson-preview.JPG"
            alt="AI Video Lesson Preview"
            style={{
              width: "100%",
              maxWidth: "520px",
              borderRadius: "16px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              objectFit: "cover",
              transition: "transform 0.4s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </div>
        <div style={{ flex: 1.2 }}>
          <h1
            style={{
              fontSize: "2.4rem",
              color: "#1E3A8A",
              fontWeight: 700,
              fontFamily: "'Poppins', sans-serif",
              marginBottom: "1rem",
            }}
          >
            AI Video Lesson Concept
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#374151",
              lineHeight: "1.8",
              maxWidth: "600px",
              marginBottom: "2.5rem",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            The <strong>YANKA Video Lesson</strong> feature will allow educators and anyone to
            transform any teaching material into multilingual AI-generated videos.
            Each video will include avatars, voice narration, subtitles, and visuals, making
            learning more accessible and engaging for everyone.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1.5rem",
            }}
          >
            {[
              { title: "AI Avatar Integration", text: "Personalized avatars narrate lessons with realistic gestures and emotions." },
              { title: "Speech & Voice Synthesis", text: "Generate lifelike voiceovers across languages automatically." },
              { title: "Multilingual Subtitles", text: "Offer instant captions in anyones preferred languages." },
              { title: "Smart Video Editing", text: "AI fine-tunes visuals and transitions for better engagement." },
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "22px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06)";
                }}
              >
                <h3
                  style={{
                    color: "#1E3A8A",
                    fontWeight: 600,
                    marginBottom: "0.4rem",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "1.05rem",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    color: "#4B5563",
                    fontSize: "0.9rem",
                    lineHeight: "1.6",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className={styles.page} style={{ marginTop: "100px", paddingBottom: "120px"  }}>
        <main
          className={styles.main}
          style={{
            display: "flex",
            gap: "2rem",
            width: "100%",
            alignItems: "flex-start", 
          }}
        >
          <div
            style={{
              flex: 1,
              background: "white",
              borderRadius: "8px",
              padding: "24px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>Video Preview</h2>
            <div
              style={{
                width: "100%",
                height: "350px",
                background: "#f0f4f8",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#777",
                fontSize: "18px",
                fontWeight: 500,
                marginBottom: "24px", 
              }}
            >
              Preview Coming Soon
            </div>
            <div className={styles.stackContainer}>
              <div className={styles.infoCard}>
                <h3 style={{ color: "#1E3A8A", marginBottom: "10px", fontSize: "1rem" }}>
                  How This Works
                </h3>
                <ul className={styles.tipList} style={{ color: "#4B5563", fontSize: "0.9rem", lineHeight: "1.6" }}>
                  <li>1. Upload or write your lesson content</li>
                  <li>2. Choose your avatar and languages</li>
                  <li>3. Select the video type you want</li>
                  <li>4. Generate a multilingual AI-powered lesson</li>
                </ul>
              </div>
              {showSummary && (
                <div className={`${styles.infoCard} ${styles.summaryBox}`}>
                  <h3 style={{ color: "#1E3A8A", marginBottom: "10px", fontSize: "1rem" }}>
                    Video Settings Summary
                  </h3>
                  <p style={{ color: "#4B5563", fontSize: "0.9rem", lineHeight: "1.6" }}>
                    Avatar: <strong>Not selected</strong><br />
                    Language: <strong>English</strong><br />
                    Subtitles: <strong>No subtitles</strong><br />
                    Video Type: <strong>{videoType || "None selected"}</strong><br />
                    Script: <strong>{script ? "Provided" : "Not provided"}</strong>
                  </p>
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              flex: 1,
              background: "white",
              borderRadius: "8px",
              padding: "24px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <h1 className={styles.pageTitle}>Video Creation</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <label>Video Title</label>
            <input
              type="text"
              placeholder="Enter video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                marginBottom: "1rem",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <label>Choose Avatar</label>
            <select
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "0.5rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Select an avatar...</option>
              <option value="avatar1">My Avatar 1</option>
              <option value="avatar2">My Avatar 2</option>
            </select>
            <p style={{ marginBottom: "1rem", fontSize: "0.9rem" }}>
              No avatar yet?{" "}
              <a
                href="/avatar_creation"
                style={{ color: "#1E3A8A", textDecoration: "underline" }}
              >
                Create one here →
              </a>
            </p>
            <label>Video Language</label>
            <select
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "1rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="lingala">Lingala</option>
              <option value="swahili">Swahili</option>
              <option value="arabic">Arabic</option>
              <option value="portuguese">Portuguese</option>
              <option value="mandarin">Mandarin Chinese</option>
              <option value="hindi">Hindi</option>
              <option value="tagalog">Tagalog</option>
              <option value="somali">Somali</option>
              <option value="amharic">Amharic</option>
              <option value="kinyarwanda">Kinyarwanda</option>
              <option value="yoruba">Yoruba</option>
              <option disabled>──────────</option>
              <option disabled>More languages coming soon...</option>
            </select>
            <label>Subtitles</label>
            <select
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "1rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option value="none">No Subtitles</option>
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="lingala">Lingala</option>
              <option value="swahili">Swahili</option>
              <option value="arabic">Arabic</option>
              <option value="portuguese">Portuguese</option>
              <option value="mandarin">Mandarin Chinese</option>
              <option value="hindi">Hindi</option>
              <option value="tagalog">Tagalog</option>
              <option value="somali">Somali</option>
              <option value="amharic">Amharic</option>
              <option value="kinyarwanda">Kinyarwanda</option>
              <option value="yoruba">Yoruba</option>
              <option disabled>──────────</option>
              <option disabled>More subtitle options coming soon...</option>
            </select>
            <label>Video Type</label>
            <select
              value={videoType}
              onChange={(e) => setVideoType(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: videoType === "custom" ? "0.5rem" : "1rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Select a video type...</option>
              <option value="lesson">Lesson Plan Video</option>
              <option value="explainer">Concept Explainer</option>
              <option value="vocab">Vocabulary Builder</option>
              <option value="reading">Reading + Narration</option>
              <option value="custom">Custom / Other (Describe Manually)</option>
              <option disabled>──────────</option>
              <option disabled>More video formats coming soon...</option>
            </select>
            {videoType === "custom" && (
              <input
                type="text"
                placeholder="Describe the video type you want..."
                value={customVideoType}
                onChange={(e) => setCustomVideoType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "1rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            )}
            <label>Script (Optional)</label>
            <textarea
              placeholder="Write lesson script here..."
              value={script}
              onChange={(e) => setScript(e.target.value)}
              style={{
                width: "100%",
                height: "140px",
                marginBottom: "1rem",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <label>Upload Lesson File (.pdf or .docx)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ marginBottom: "1rem" }}
            />
            <button
              onClick={handleUpload}
              style={{
                marginBottom: "1rem",
                padding: "10px",
                background: "#003366",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Upload File
            </button>
            <button
              onClick={handleSubmit}
              disabled={isGenerating}
              style={{
                marginTop: "2rem",
                padding: "12px",
                width: "100%",
                background: isGenerating ? "#a0a0a0" : "#003366",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: isGenerating ? "not-allowed" : "pointer",
                fontSize: "16px",
                transition: "0.3s ease",
                marginBottom: "100px",
              }}
            >
              {isGenerating ? "Generating..." : "Generate AI Video"}
                        </button>
          </div>
        </main>
      </div>
      <VideoChat />
      <Footer />
    </>
  );
};

export default VideoCreation;
