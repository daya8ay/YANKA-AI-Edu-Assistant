"use client";

import React, { useState } from "react";
import NavBar from "@/components/NavBar";
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
      setError("Please enter a video title.");
      return;
    }
    if (!script && !file) {
      setError("Please provide a script or upload a lesson file.");
      return;
    }
    setError("");
    alert("Form is valid. This feature is still under development.");
  };

  return (
    <>
      <NavBar />
      <div className={styles.page} style={{ marginTop: "100px" }}>
        <main className={styles.main} style={{ display: "flex", gap: "2rem", width: "100%" }}>
          <div
            style={{
              flex: 1,
              background: "white",
              borderRadius: "8px",
              padding: "24px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>Video Preview</h2>
            <div
              style={{
                width: "100%",
                height: "250px",
                background: "#f5f5f5",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#888"
              }}
            >
              Coming soon...
            </div>
          </div>

          <div
            style={{
              flex: 1,
              background: "white",
              borderRadius: "8px",
              padding: "24px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
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
              style={{ width: "100%", marginBottom: "1rem", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
            />

            <label>Script (Optional)</label>
            <textarea
              placeholder="Write lesson script here..."
              value={script}
              onChange={(e) => setScript(e.target.value)}
              style={{ width: "100%", height: "140px", marginBottom: "1rem", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
            />

            <label>Upload Lesson File (.pdf or .docx)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ marginBottom: "1rem" }}
            />

            <label style={{ display: "block", marginTop: "1rem" }}>Video Type</label>
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
                padding: "12px",
                width: "100%",
                background: "#0056d2",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default VideoCreation;