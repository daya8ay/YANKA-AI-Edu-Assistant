"use client";
import React, { useState } from "react";
import styles from "../page.module.css";

const VideoCreation = () => {
  const [title, setTitle] = useState("");
  const [script, setScript] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [videoType, setVideoType] = useState("ai");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!title) {
      setError("Please enter a video title!");
      return;
    }
    if (!script && !file) {
      setError("Please provide a script or upload a lesson file!");
      return;
    }
    setError("");
    alert("Form is valid. Please note that this feature is still under development.");
  };

  return (
    <div className={styles.page}>
      <main className={styles.main} style={{ display: "flex", gap: "2rem" }}>
        <div
          style={{
            flex: 1,
            border: "1px solid #ddd",
            padding: "1rem",
            borderRadius: "5px",
            textAlign: "center"
          }}
        >
          <p>Video Preview Placeholder</p>
          <div
            style={{
              width: "100%",
              height: "250px",
              background: "#f0f0f0",
              borderRadius: "5px"
            }}
          />
        </div>

        <div
          style={{
            flex: 1,
            border: "1px solid #ddd",
            padding: "1rem",
            borderRadius: "5px"
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
            style={{ width: "100%", marginBottom: "1rem", padding: "8px" }}
          />

          <label>Script (Optional)</label>
          <textarea
            placeholder="Write lesson script here . . ."
            value={script}
            onChange={(e) => setScript(e.target.value)}
            style={{
              width: "100%",
              height: "120px",
              marginBottom: "1rem",
              padding: "8px"
            }}
          />

          <label>Upload Lesson File (.pdf or .docx)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ marginBottom: "1rem" }}
          />

          <label style={{ display: "block", marginTop: "1rem" }}>
            Video Type
          </label>
          <div>
            <label>
              <input
                type="radio"
                value="ai"
                checked={videoType === "ai"}
                onChange={() => setVideoType("ai")}
              />
              Generate AI Video
            </label>
            <label style={{ marginLeft: "1rem" }}>
              <input
                type="radio"
                value="upload"
                checked={videoType === "upload"}
                onChange={() => setVideoType("upload")}
              />
              Upload Video File
            </label>
          </div>

          {videoType === "upload" && (
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              style={{ marginTop: "1rem" }}
            />
          )}

          <button
            onClick={handleSubmit}
            style={{
              marginTop: "2rem",
              padding: "10px",
              width: "100%",
              background: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default VideoCreation;