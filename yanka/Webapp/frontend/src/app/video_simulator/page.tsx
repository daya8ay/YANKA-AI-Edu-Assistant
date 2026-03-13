"use client";

import React, { useRef, useState } from "react";
import DashboardNavBar from "../../components/DashboardNavBar";
import Footer from "@/components/Footer";
import styles from "./video_simulator.module.css";

const VideoSimulator = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const handlePlay = () => {
    if (!videoRef.current) return;
    setIsPlaying(true);
    videoRef.current.play();
  };

  const handlePause = () => {
    if (!videoRef.current) return;
    setIsPlaying(false);
    videoRef.current.pause();
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    videoRef.current.currentTime = newTime;
  };

  const handleSpeedChange = (speed: number) => {
    if (!videoRef.current) return;
    setPlaybackRate(speed);
    videoRef.current.playbackRate = speed;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const [darkMode, setDarkMode] = useState(false);
  const [showConfusionModal, setShowConfusionModal] = useState(false);
  const [modalResponse, setModalResponse] = useState<string | null>(null);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleModalResponse = (response: string) => {
    setModalResponse(response);
    setShowConfusionModal(false);
  };

  return (
    <>
      <DashboardNavBar />
      <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
        <div className={styles.content}>
          <h1 className={styles.title}>Video Simulator</h1>

          <div className={styles.playerShell}>
            {/* Video */}
            <video
              ref={videoRef}
              className={styles.video}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              onClick={isPlaying ? handlePause : handlePlay}
              controls={false}
            >
              <source src="/video/test.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Controls bar */}
            <div className={styles.controlsBar}>
              {/* Progress row */}
              <div className={styles.progressRow}>
                <div
                  className={styles.progressTrack}
                  style={{ "--progress": `${progressPercent}%` } as React.CSSProperties}
                >
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    step="0.01"
                    value={currentTime}
                    onChange={handleSeek}
                    className={styles.seekBar}
                  />
                </div>
              </div>

              {/* Bottom row */}
              <div className={styles.bottomRow}>
                {/* Left group */}
                <div className={styles.leftGroup}>
                  <button
                    onClick={isPlaying ? handlePause : handlePlay}
                    className={styles.playButton}
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  {/* Volume */}
                  <div className={styles.volumeGroup}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" className={styles.volumeIcon}>
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={handleVolumeChange}
                      className={styles.volumeSlider}
                    />
                  </div>

                  <span className={styles.timeDisplay}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Right group — speed */}
                <div className={styles.rightGroup}>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handleSpeedChange(speed)}
                      className={`${styles.speedButton} ${playbackRate === speed ? styles.active : ""}`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Demo trigger */}
          <div className={styles.demoRow}>
            <button
              className={styles.demoTrigger}
              onClick={() => { setModalResponse(null); setShowConfusionModal(true); }}
            >
              Preview confusion alert
            </button>
            {modalResponse && (
              <span className={styles.demoResponse}>
                You selected: <strong>{modalResponse}</strong>
              </span>
            )}
          </div>

          <div className={styles.themeRow}>
            <span className={styles.themeLabel}>Background</span>
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className={`${styles.themeToggle} ${darkMode ? styles.themeActive : ""}`}
              aria-label="Toggle background colour"
            >
              <span className={styles.themeToggleThumb} />
            </button>
            <span className={styles.themeValue}>{darkMode ? "Dark" : "Light"}</span>
          </div>
        </div>
      </div>
      <Footer />

      {/* Confusion detection modal */}
      {showConfusionModal && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="confusionTitle">
          <div className={styles.modal}>
            <div className={styles.modalIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className={styles.modalTitle} id="confusionTitle">
              Looks like you might need a hand
            </h2>
            <p className={styles.modalBody}>
              Our system noticed some patterns that suggest you may be finding this section tricky, 
              which is completely okay! Would you like us to provide
              a deeper explanation or additional resources for this topic?
            </p>
            <div className={styles.modalActions}>
              <button
                className={`${styles.modalBtn} ${styles.modalBtnPrimary}`}
                onClick={() => handleModalResponse("Yes, help me")}
              >
                Yes, help me
              </button>
              <button
                className={`${styles.modalBtn} ${styles.modalBtnSecondary}`}
                onClick={() => handleModalResponse("Maybe later")}
              >
                Maybe later
              </button>
              <button
                className={`${styles.modalBtn} ${styles.modalBtnGhost}`}
                onClick={() => handleModalResponse("No thanks")}
              >
                No thanks
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoSimulator;
