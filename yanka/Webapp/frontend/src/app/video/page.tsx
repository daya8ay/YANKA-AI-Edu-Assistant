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
  const [language, setLanguage] = useState("english");
  const [subtitle, setSubtitle] = useState("none");
  const [avatar, setAvatar] = useState("");
  const [generatedScript, setGeneratedScript] = useState("");
  const [videoId, setVideoId] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoStatus, setVideoStatus] = useState("");
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [templateStyle, setTemplateStyle] = useState("presentation");
  const [contentMode, setContentMode] = useState("slides_avatar");
  const [lessonVisualNotes, setLessonVisualNotes] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Please enter a video title.");
      return;
    }
  
    if (!script.trim() && !file) {
      setError("Please provide a script or upload a lesson file.");
      return;
    }
  
    setError("");
    setIsGenerating(true);
    setShowSummary(false);
  
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("avatar", avatar);
      formData.append("language", language);
      formData.append("subtitle", subtitle);
      formData.append("video_type", videoType);
      formData.append("custom_video_type", customVideoType);
      formData.append("script", script);
      formData.append("template_style", templateStyle);
      formData.append("content_mode", contentMode);
      formData.append("lesson_visual_notes", lessonVisualNotes);
        
      if (file) {
        formData.append("file", file);
      }
  
      const response = await fetch("http://localhost:8000/video/generate", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok || !data.success) {
        throw new Error(data.detail || data.error || "Failed to submit video request.");
      }
  
      console.log("Video generation response:", data);
      setGeneratedScript(data.generated_script || "");
      setVideoId(data.video_id || "");
      setVideoUrl("");
      setVideoStatus(data.status || "processing");
      setShowSummary(true);
      alert("Your lesson video is being generated.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong while generating the video.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const checkVideoStatus = async () => {
    if (!videoId) {
      setError("No video has been created yet.");
      return;
    }
  
    setIsCheckingStatus(true);
    setError("");
  
    try {
      const response = await fetch(`http://localhost:8000/video/status/${videoId}`);
      const data = await response.json();
  
      console.log("Video status response:", data);
  
      const status = data?.data?.status || "";
      const url = data?.data?.video_url || "";
  
      setVideoStatus(status);
  
      if (url) {
        setVideoUrl(url);
        alert("Your video is ready!");
      } else if (status === "processing") {
        alert("Your lesson video is still being generated.");
      } else if (status === "failed") {
        setError("Video generation failed. Please try again.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to check video status.");
      }
    } finally {
      setIsCheckingStatus(false);
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
            The <strong>Yanka AI Video Lesson</strong> feature will allow educators and anyone to
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
            alignItems: "stretch",
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
            {videoUrl ? (
              <video
                controls
                style={{
                  width: "100%",
                  maxHeight: "350px",
                  borderRadius: "8px",
                  marginBottom: "24px",
                  background: "#000",
                }}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
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
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                {videoStatus === "processing"
                  ? "Your lesson video is being generated..."
                  : "Preview Coming Soon"}
              </div>
            )}
            <div className={styles.stackContainer}>
              <div className={styles.infoCard}>
                <h3 style={{ color: "#1E3A8A", marginBottom: "10px", fontSize: "1rem" }}>
                  How This Works
                </h3>
                <ul className={styles.tipList} style={{ color: "#4B5563", fontSize: "0.9rem", lineHeight: "1.6" }}>
                  <li> Upload or write your lesson content</li>
                  <li> Choose your avatar and languages</li>
                  <li> Select the video type you want</li>
                  <li> Generate a multilingual AI-powered lesson</li>
                </ul>
              </div>
              <div className={styles.divider}></div>
              {showSummary && (
                <div className={`${styles.infoCard} ${styles.summaryBox}`}>
                  <h3 style={{ color: "#1E3A8A", marginBottom: "10px", fontSize: "1rem" }}>
                    Video Settings Summary
                  </h3>
                  <p style={{ color: "#4B5563", fontSize: "0.9rem", lineHeight: "1.6" }}>
                    Avatar: <strong>{avatar || "Not selected"}</strong><br />
                    Language: <strong>{language}</strong><br />
                    Subtitles: <strong>{subtitle}</strong><br />
                    Video Type: <strong>{videoType || "None selected"}</strong><br />
                    Script: <strong>{script ? "Provided" : "Not provided"}</strong>
                  </p>
                </div>
              )}
              {generatedScript && (
                <div className={`${styles.infoCard} ${styles.summaryBox}`}>
                  <h3 style={{ color: "#1E3A8A", marginBottom: "10px", fontSize: "1rem" }}>
                    Generated Script
                  </h3>
                  <p
                    style={{
                      color: "#4B5563",
                      fontSize: "0.9rem",
                      lineHeight: "1.6",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {generatedScript}
                  </p>
                </div>
              )}
              {videoStatus && (
                <div className={`${styles.infoCard} ${styles.summaryBox}`}>
                  <h3 style={{ color: "#1E3A8A", marginBottom: "10px", fontSize: "1rem" }}>
                    Video Status
                  </h3>
                  <p style={{ color: "#4B5563", fontSize: "0.9rem", lineHeight: "1.6" }}>
                    Current status: <strong>{videoStatus}</strong>
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
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
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
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
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
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
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
              <label>Template Style</label>
              <select
                value={templateStyle}
                onChange={(e) => setTemplateStyle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "1rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="presentation">Presentation / Lesson</option>
                <option value="explainer_clean">Clean Explainer</option>
                <option value="training">Training Module</option>
                <option value="news">News / Presenter Style</option>
              </select>
              <label>Video Layout</label>
              <select
                value={contentMode}
                onChange={(e) => setContentMode(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "1rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="avatar_only">Avatar Only</option>
                <option value="slides_avatar">Slides + Avatar Corner</option>
                <option value="visual_focus">Visual Content Focus</option>
                <option value="cutaway_presenter">Cut Between Avatar and Content</option>
              </select>

              <label>Visual Notes (Optional)</label>
              <textarea
                placeholder="Example: Show slides, keep avatar bottom-right, highlight key points visually..."
                value={lessonVisualNotes}
                onChange={(e) => setLessonVisualNotes(e.target.value)}
                style={{
                  width: "100%",
                  height: "110px",
                  marginBottom: "1rem",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
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
                marginBottom: "16px",
              }}
            >
              {isGenerating ? "Generating..." : "Generate AI Video"}
            </button>

            <button
              onClick={checkVideoStatus}
              disabled={!videoId || isCheckingStatus}
              style={{
                padding: "12px",
                width: "100%",
                background: !videoId || isCheckingStatus ? "#a0a0a0" : "#1E3A8A",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: !videoId || isCheckingStatus ? "not-allowed" : "pointer",
                fontSize: "16px",
                transition: "0.3s ease",
                marginBottom: "40px",
              }}
            >
              {isCheckingStatus ? "Checking Status..." : "Check Video Status"}
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
