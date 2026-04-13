"use client";

import React, { useState } from "react";
import DashboardNavBar from "../../components/DashboardNavBar";
import Footer from "@/components/Footer";
import VideoChat from "./VideoChat";
import styles from "./video.module.css";
import {
  Camera,
  UploadCloud,
  Languages,
  Clapperboard,
  UserCircle2,
  Shield,
  Check,
  Mic,
  Captions,
  Sparkles,
  ArrowRight,
} from "lucide-react";

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
  const [videoId, setVideoId] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoStatus, setVideoStatus] = useState("");
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
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

      <section className={styles.heroSection}>
        <div className={styles.heroVisualWrap}>
          <div className={styles.heroGlow}></div>
          <div className={styles.heroImageFrame}>
            <img
              src="/pics/video-lesson-preview.JPG"
              alt="AI Video Lesson Preview"
              className={styles.heroImage}
            />
          </div>
        </div>

        <div className={styles.heroContent}>

          <h1 className={styles.heroTitle}>AI Video Lesson Concept</h1>

          <p className={styles.heroDescription}>
            Transform your teaching material into multilingual AI-powered videos
            with the YANKA Video Lesson feature:
          </p>

          <div className={styles.heroFeatureGrid}>
            <div className={styles.heroFeatureCard}>
              <div className={styles.heroFeatureIcon}>
                <UserCircle2 size={22} />
              </div>
              <div>
                <h3>AI Avatar Integration</h3>
                <p>Personalized avatars narrate lessons with realistic gestures and emotions.</p>
              </div>
            </div>

            <div className={styles.heroFeatureCard}>
              <div className={styles.heroFeatureIcon}>
                <Mic size={22} />
              </div>
              <div>
                <h3>Speech & Voice Synthesis</h3>
                <p>Generate lifelike voiceovers across languages automatically.</p>
              </div>
            </div>

            <div className={styles.heroFeatureCard}>
              <div className={styles.heroFeatureIcon}>
                <Captions size={22} />
              </div>
              <div>
                <h3>Multilingual Subtitles</h3>
                <p>Offer instant captions in anyone&apos;s preferred languages.</p>
              </div>
            </div>

            <div className={styles.heroFeatureCard}>
              <div className={styles.heroFeatureIcon}>
                <Sparkles size={22} />
              </div>
              <div>
                <h3>Smart Video Editing</h3>
                <p>AI fine-tunes visuals and transitions for better engagement.</p>
              </div>
            </div>
          </div>

          <button
            className={styles.heroCTA}
            onClick={() =>
              document
                .getElementById("video-creation-panel")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            <span>Try Video Creation</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <div className={styles.page} style={{ marginTop: "100px", paddingBottom: "120px" }}>
        <main className={styles.main}>
          <div className={styles.layoutGrid}>
            <div className={styles.leftColumn}>
              <div className={styles.glassCard}>
                <h2 className={styles.sectionTitle}>Video Preview</h2>

                {videoUrl ? (
                  <video controls className={styles.previewVideo}>
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className={styles.previewPlaceholder}>
                    <Camera size={24} className={styles.previewIcon} />
                    <span>
                      {videoStatus === "processing"
                        ? "Your lesson video is being generated..."
                        : "Preview will appear here"}
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.glassCard}>
                <h2 className={styles.sectionTitle}>How It Works</h2>

                <div className={styles.innerInfoCard}>
                  <ul className={styles.tipList}>
                    <li>Upload or write your lesson content</li>
                    <li>Choose your avatar and languages</li>
                    <li>Select the video type you want</li>
                    <li>Generate a multilingual AI-powered lesson</li>
                  </ul>
                </div>

                {showSummary && (
                  <div className={`${styles.innerInfoCard} ${styles.summaryBox}`}>
                    <h3 className={styles.smallCardTitle}>Video Settings Summary</h3>
                    <p className={styles.summaryText}>
                      Avatar: <strong>{avatar || "Not selected"}</strong>
                      <br />
                      Language: <strong>{language}</strong>
                      <br />
                      Subtitles: <strong>{subtitle}</strong>
                      <br />
                      Video Type: <strong>{videoType || "None selected"}</strong>
                      <br />
                      Script: <strong>{script ? "Provided" : "Not provided"}</strong>
                    </p>
                  </div>
                )}

                {videoStatus && (
                  <div className={`${styles.innerInfoCard} ${styles.summaryBox}`}>
                    <h3 className={styles.smallCardTitle}>Video Status</h3>
                    <p className={styles.summaryText}>
                      Current status: <strong>{videoStatus}</strong>
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.rightColumn}>
              <div className={styles.glassCard} id="video-creation-panel">
                <h2 className={styles.sectionTitle}>Video Creation</h2>
                <p className={styles.formSubtitle}>
                  Customize and generate your AI-powered lesson video
                </p>

                {error && <p className={styles.errorText}>{error}</p>}

                <div className={styles.formCard}>
                  <label className={styles.formLabel}>Video Title</label>
                  <input
                    type="text"
                    placeholder="Enter video title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.textInput}
                  />
                </div>

                <div className={styles.formCard}>
                  <div className={styles.cardHeadingRow} style={{ marginBottom: "10px" }}>
                    <div className={styles.iconBadge}>
                      <UserCircle2 size={18} />
                    </div>
                    <label className={styles.formLabel} style={{ marginBottom: 0 }}>
                      Avatar
                    </label>
                  </div>

                  <select
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="">Select an avatar...</option>
                    <option value="avatar1">My Avatar 1</option>
                    <option value="avatar2">My Avatar 2</option>
                  </select>

                  <p className={styles.helperLinkRow}>
                    No avatar yet?{" "}
                    <a href="/avatar_creation" className={styles.helperLink}>
                      Create one here →
                    </a>
                  </p>
                </div>

                <div className={styles.bottomGrid}>
                  <div className={styles.smallCard}>
                    <div className={styles.cardHeadingRow}>
                      <div className={styles.iconBadge}>
                        <Languages size={18} />
                      </div>
                      <h3 className={styles.cardHeading}>Language & Subtitles</h3>
                    </div>

                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className={styles.selectInput}
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
                    </select>

                    <select
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className={styles.selectInput}
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
                    </select>

                    <div className={styles.uploadDropZone}>
                      <UploadCloud size={30} className={styles.uploadIcon} />
                      <div className={styles.uploadTitle}>
                        Drag & drop a lesson file or click to upload
                      </div>

                      <label htmlFor="lesson-file" className={styles.uploadFileButton}>
                        PDF or DOCX File
                      </label>

                      <input
                        id="lesson-file"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className={styles.hiddenFileInput}
                      />

                      {file && <p className={styles.summaryText}>Selected: {file.name}</p>}
                    </div>
                  </div>

                  <div className={styles.smallCard}>
                    <div className={styles.cardHeadingRow}>
                      <div className={styles.iconBadge}>
                        <Clapperboard size={18} />
                      </div>
                      <h3 className={styles.cardHeading}>Video Type</h3>
                    </div>

                    <select
                      value={videoType}
                      onChange={(e) => setVideoType(e.target.value)}
                      className={styles.selectInput}
                    >
                      <option value="">Select a video type...</option>
                      <option value="lesson">Lesson Plan Video</option>
                      <option value="explainer">Concept Explainer</option>
                      <option value="vocab">Vocabulary Builder</option>
                      <option value="reading">Reading + Narration</option>
                      <option value="custom">Custom / Other (Describe Manually)</option>
                    </select>

                    {videoType === "custom" && (
                      <input
                        type="text"
                        placeholder="Describe the video type you want..."
                        value={customVideoType}
                        onChange={(e) => setCustomVideoType(e.target.value)}
                        className={styles.textInput}
                        style={{ marginBottom: "12px" }}
                      />
                    )}

                    <label className={styles.formLabel} style={{ marginTop: "6px" }}>
                      Additional Guidance
                    </label>
                    <textarea
                      placeholder="Example: Explain key terms clearly, focus on the main ideas..."
                      value={lessonVisualNotes}
                      onChange={(e) => setLessonVisualNotes(e.target.value)}
                      className={styles.textAreaInput}
                      style={{ minHeight: "120px", marginBottom: "14px" }}
                    />

                    <label className={styles.formLabel} style={{ marginTop: "14px" }}>
                      Script (Optional)
                    </label>
                    <textarea
                      placeholder="Write lesson script here..."
                      value={script}
                      onChange={(e) => setScript(e.target.value)}
                      className={styles.textAreaInput}
                      style={{ minHeight: "140px" }}
                    />

                    <button
                      onClick={handleSubmit}
                      disabled={isGenerating}
                      className={styles.primaryButton}
                    >
                      {isGenerating ? "Generating..." : "Generate AI Video"}
                    </button>

                    <button
                      onClick={checkVideoStatus}
                      disabled={!videoId || isCheckingStatus}
                      className={styles.secondaryButton}
                    >
                      {isCheckingStatus ? "Checking Status..." : "Check Video Status"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <VideoChat />
      <Footer />
    </>
  );
};

export default VideoCreation;