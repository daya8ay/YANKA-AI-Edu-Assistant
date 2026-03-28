"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import DashboardNavBar from "../../components/DashboardNavBar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import styles from "./video_simulator.module.css";
import {
  Room,
  RoomEvent,
  Track,
  type RemoteTrack,
  DataPacket_Kind,
} from "livekit-client";

interface KeyPoint {
  point: string;
  explanation: string;
}

interface SuggestedQuestion {
  question: string;
  answer: string;
}

interface HelpContent {
  summary: string;
  keyPoints: KeyPoint[];
  suggestedQuestions: SuggestedQuestion[];
}

const VideoSimulator = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  // ── Analytics state ──
  const [pauseCount, setPauseCount] = useState(0);
  const [seekCount, setSeekCount] = useState(0);
  const [totalWatchTime, setTotalWatchTime] = useState(0);
  const watchStartVideoTimeRef = useRef<number | null>(null);

  // ── ML prediction ──
  const [predictionLoading, setPredictionLoading] = useState(false);

  // ── Milestone guards ──
  const earlyCheckSent = useRef(false);
  const midCheckSent   = useRef(false);
  const lateCheckSent  = useRef(false);
  const endCheckSent   = useRef(false);

  // ── Help state ──
  const helpDecision = useRef<"none" | "snoozed" | "dismissed" | "accepted_help">("none");
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [helpContent, setHelpContent] = useState<HelpContent | null>(null);
  const [helpLoading, setHelpLoading] = useState(false);
  const [helpTimestamp, setHelpTimestamp] = useState(0);
  const [showLookbackPicker, setShowLookbackPicker] = useState(false);
  const [pendingHelpTimestamp, setPendingHelpTimestamp] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());
  const [revealedPoints, setRevealedPoints] = useState<Set<number>>(new Set());

  // ── Help feedback + chat state ──
  const [helpfulness, setHelpfulness] = useState<"up" | "down" | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(true);

  // ── Avatar state ──
  const [avatarMode, setAvatarMode] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const avatarVideoRef = useRef<HTMLVideoElement>(null);
  const livekitRoomRef = useRef<Room | null>(null);
  const avatarSessionIdRef = useRef<string | null>(null);
  const avatarAudioElemsRef = useRef<HTMLAudioElement[]>([]);

  // ── UI state ──
  const [darkMode, setDarkMode] = useState(false);
  const [showConfusionModal, setShowConfusionModal] = useState(false);
  const [confusionModalFromEnd, setConfusionModalFromEnd] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // ── Resizable panel (horizontal + vertical) ──
  const [videoPct, setVideoPct] = useState(50);
  const [panelHeight, setPanelHeight] = useState(720);
  const playerRowRef = useRef<HTMLDivElement>(null);
  const helpPanelRef = useRef<HTMLDivElement>(null);

  const onResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const onMove = (ev: MouseEvent) => {
      if (!playerRowRef.current) return;
      const { left, width } = playerRowRef.current.getBoundingClientRect();
      const pct = ((ev.clientX - left) / width) * 100;
      setVideoPct(Math.min(70, Math.max(30, pct)));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  const onVerticalResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = helpPanelRef.current?.getBoundingClientRect().height ?? panelHeight;
    const onMove = (ev: MouseEvent) => {
      const next = startHeight + (ev.clientY - startY);
      setPanelHeight(Math.min(900, Math.max(280, next)));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [panelHeight]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // ── Send analytics to ML backend ──
  const sendAnalyticsToBackend = useCallback(async (
    trigger: "manual" | "mid" | "late" | "end" = "manual",
    metricOverrides?: { time_watched?: number },
  ) => {
    setPredictionLoading(true);
    try {
      const metrics = {
        video_duration: Number((duration / 60).toFixed(2)) || 0,
        time_watched: metricOverrides?.time_watched ?? (Number((totalWatchTime / 60).toFixed(2)) || 0),
        skip_count: seekCount,
        pause_count: pauseCount,
      };
      const result = await api.getVideoPrediction(metrics);
      const p = (result.prediction as string).trim().toLowerCase();

      const qualifies = p === "high" || (p === "medium" && trigger === "end");
      const blockedByAcceptedHelp =
        helpDecision.current === "accepted_help" && (trigger === "mid" || trigger === "late");
      const canShowPopup =
        helpDecision.current !== "dismissed" && qualifies && !blockedByAcceptedHelp;

      if (canShowPopup) {
        if (videoRef.current && !videoRef.current.paused) {
          if (watchStartVideoTimeRef.current !== null) {
            const watched = videoRef.current.currentTime - watchStartVideoTimeRef.current;
            if (watched > 0) setTotalWatchTime((prev) => prev + watched);
            watchStartVideoTimeRef.current = null;
          }
          videoRef.current.pause();
          setIsPlaying(false);
        }
        setConfusionModalFromEnd(trigger === "end");
        setShowConfusionModal(true);
      }
    } catch (err) {
      console.error("Prediction error:", err);
    } finally {
      setPredictionLoading(false);
    }
  }, [duration, totalWatchTime, seekCount, pauseCount]);

  // ── Milestone checks at 25% / 50% / 75% ──
  useEffect(() => {
    if (duration <= 0) return;
    const pct = currentTime / duration;

    const getCurrentWatchTimeMins = () => {
      const inProgressSecs =
        watchStartVideoTimeRef.current !== null && videoRef.current
          ? Math.max(0, videoRef.current.currentTime - watchStartVideoTimeRef.current)
          : 0;
      return Number(((totalWatchTime + inProgressSecs) / 60).toFixed(2)) || 0;
    };

    if (pct >= 0.25 && !earlyCheckSent.current) {
      earlyCheckSent.current = true;
      sendAnalyticsToBackend("mid", { time_watched: getCurrentWatchTimeMins() });
    }
    if (pct >= 0.5 && !midCheckSent.current) {
      midCheckSent.current = true;
      sendAnalyticsToBackend("mid", { time_watched: getCurrentWatchTimeMins() });
    }
    if (pct >= 0.75 && !lateCheckSent.current) {
      lateCheckSent.current = true;
      sendAnalyticsToBackend("late", { time_watched: getCurrentWatchTimeMins() });
    }
  }, [currentTime, duration, totalWatchTime, sendAnalyticsToBackend]);

  const handlePlay = () => {
    if (!videoRef.current) return;
    setIsPlaying(true);
    watchStartVideoTimeRef.current = videoRef.current.currentTime;
    videoRef.current.play();
  };

  const handlePause = () => {
    if (!videoRef.current) return;
    if (watchStartVideoTimeRef.current !== null) {
      const watched = videoRef.current.currentTime - watchStartVideoTimeRef.current;
      if (watched > 0) setTotalWatchTime((prev) => prev + watched);
      watchStartVideoTimeRef.current = null;
    }
    setIsPlaying(false);
    setPauseCount((prev) => prev + 1);
    videoRef.current.pause();
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newTime = parseFloat(e.target.value);

    if (isPlaying && watchStartVideoTimeRef.current !== null) {
      const watched = videoRef.current.currentTime - watchStartVideoTimeRef.current;
      if (watched > 0) setTotalWatchTime((prev) => prev + watched);
      watchStartVideoTimeRef.current = newTime;
    }

    setCurrentTime(newTime);
    videoRef.current.currentTime = newTime;
    setSeekCount((prev) => prev + 1);
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
    if (endCheckSent.current) return;
    endCheckSent.current = true;

    let finalWatchTime = totalWatchTime;
    if (videoRef.current && watchStartVideoTimeRef.current !== null) {
      const watched = videoRef.current.currentTime - watchStartVideoTimeRef.current;
      if (watched > 0) {
        finalWatchTime += watched;
        setTotalWatchTime(finalWatchTime);
      }
      watchStartVideoTimeRef.current = null;
    }

    setIsPlaying(false);
    setIsCompleted(true);
    sendAnalyticsToBackend("end", {
      time_watched: Number((finalWatchTime / 60).toFixed(2)) || 0,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // ── Avatar: stop current session ──
  const stopAvatarSession = useCallback(async () => {
    if (livekitRoomRef.current) {
      livekitRoomRef.current.disconnect();
      livekitRoomRef.current = null;
    }
    avatarAudioElemsRef.current.forEach((el) => { el.pause(); el.remove(); });
    avatarAudioElemsRef.current = [];
    if (avatarSessionIdRef.current) {
      try { await api.stopAvatarSession(avatarSessionIdRef.current); } catch { /* best effort */ }
      avatarSessionIdRef.current = null;
    }
    setAvatarMode(false);
    setAvatarLoading(false);
    setAvatarError(null);
  }, []);

  const handleReplay = useCallback(async () => {
    await stopAvatarSession();
    earlyCheckSent.current = false;
    midCheckSent.current = false;
    lateCheckSent.current = false;
    endCheckSent.current = false;
    helpDecision.current = "none";

    setPauseCount(0);
    setSeekCount(0);
    setTotalWatchTime(0);
    watchStartVideoTimeRef.current = null;
    setShowConfusionModal(false);
    setConfusionModalFromEnd(false);
    setShowLookbackPicker(false);
    setPendingHelpTimestamp(0);
    setIsCompleted(false);
    setPredictionLoading(false);

    setShowHelpPanel(false);
    setHelpContent(null);
    setHelpTimestamp(0);
    setRevealedAnswers(new Set());
    setRevealedPoints(new Set());
    setHelpfulness(null);
    setChatInput("");
    setChatMessages([]);
    setChatMinimized(true);

    const v = videoRef.current;
    if (!v) {
      setIsPlaying(false);
      return;
    }
    v.pause();
    v.currentTime = 0;
    setCurrentTime(0);
    try {
      await v.play();
      setIsPlaying(true);
      watchStartVideoTimeRef.current = 0;
    } catch {
      setIsPlaying(false);
      watchStartVideoTimeRef.current = null;
    }
  }, [stopAvatarSession]);

  // ── Avatar: start session and speak the help content ──
  const startAvatarSession = useCallback(async (content: typeof helpContent) => {
    if (!content) return;
    setAvatarError(null);
    setAvatarLoading(true);

    try {
      const { session_id, livekit_url, livekit_token } = await api.getAvatarSession();
      avatarSessionIdRef.current = session_id;

      const room = new Room();
      livekitRoomRef.current = room;

      // Attach video to the <video> element; give audio its own <audio> element
      // to avoid srcObject conflicts and bypass browser autoplay restrictions.
      room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack) => {
        if (track.kind === Track.Kind.Audio) {
          const audioEl = track.attach() as HTMLAudioElement;
          audioEl.autoplay = true;
          document.body.appendChild(audioEl);
          avatarAudioElemsRef.current.push(audioEl);
        }
        if (track.kind === Track.Kind.Video && avatarVideoRef.current) {
          track.attach(avatarVideoRef.current);
          setAvatarLoading(false);
          setAvatarMode(true);

          // Build a teacher-style spoken script from the help content
          const ordinals = ["First", "Second", "Third", "Fourth", "Fifth"];
          const keyPointsScript = content.keyPoints.length > 0
            ? `Now, there are ${content.keyPoints.length} key concept${content.keyPoints.length > 1 ? "s" : ""} I want you to take away from this section. ` +
              content.keyPoints
                .map((kp, i) => `${ordinals[i] ?? `Point ${i + 1}`} — ${kp.point}. ${kp.explanation}`)
                .join(" ")
            : "";
          const questionsScript = content.suggestedQuestions.length > 0
            ? "Before you move on, here are a couple of things worth thinking about. " +
              content.suggestedQuestions.map((sq) => sq.question).join(" And also — ")
            : "";
          const script = [
            "Alright, let me walk you through what's happening in this section.",
            content.summary,
            keyPointsScript,
            questionsScript,
            "Take your time, and feel free to continue watching the video whenever you're ready.",
          ].filter(Boolean).join(" ");

          const payload = new TextEncoder().encode(
            JSON.stringify({ event_type: "avatar.speak_text", session_id, text: script })
          );
          room.localParticipant
            .publishData(payload, { topic: "agent-control", reliable: true })
            .catch(console.error);
        }
      });

      await room.connect(livekit_url, livekit_token);
      // Unlock the browser's audio autoplay restriction using the current user gesture
      await room.startAudio();
    } catch (err) {
      console.error("Avatar session error:", err);
      const msg = err instanceof Error ? err.message : "";
      setAvatarError(
        msg.includes("429") || msg.toLowerCase().includes("closing")
          ? "A previous avatar session is still closing. Please wait a few seconds and try again."
          : "Could not start avatar session. Please try again."
      );
      setAvatarLoading(false);
      stopAvatarSession();
    }
  }, [stopAvatarSession]);

  // Stop avatar when help panel closes
  useEffect(() => {
    if (!showHelpPanel) stopAvatarSession();
  }, [showHelpPanel, stopAvatarSession]);

  // ── Open help panel with AI content ──
  const openHelpPanel = async (timestamp: number, lookback?: number) => {
    setHelpTimestamp(timestamp);
    setShowHelpPanel(true);
    setHelpContent(null);
    setHelpLoading(true);
    setRevealedAnswers(new Set());
    setRevealedPoints(new Set());
    setHelpfulness(null);
    setChatMinimized(true);
    setChatInput("");
    setChatMessages([]);
    try {
      const result = await api.getVideoHelp({ timestamp, lookback });
      setHelpContent(result);
    } catch (err) {
      console.error("Help fetch error:", err);
      setHelpContent({
        summary: "Unable to load help content at this time. Please try again.",
        keyPoints: [],
        suggestedQuestions: [],
      });
    } finally {
      setHelpLoading(false);
    }
  };

  const sendChatMessage = useCallback(async () => {
    const msg = chatInput.trim();
    if (!msg || chatLoading) return;
    setChatMinimized(false);
    setChatMessages((prev) => [...prev, { role: "user", text: msg }]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await api.videoHelpChat({ message: msg, timestamp: helpTimestamp });
      setChatMessages((prev) => [...prev, { role: "assistant", text: res.response }]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I couldn't get a response. Please try again." },
      ]);
    } finally {
      setChatLoading(false);
    }
  }, [chatInput, chatLoading, helpTimestamp]);

  const handleModalResponse = (response: string) => {
    if (response === "Maybe later") {
      helpDecision.current = helpDecision.current === "snoozed" ? "dismissed" : "snoozed";
    } else if (response === "Yes, help me") {
      helpDecision.current = isCompleted ? "dismissed" : "accepted_help";
    } else {
      helpDecision.current = "dismissed";
    }
    setShowConfusionModal(false);
    setConfusionModalFromEnd(false);

    if (response === "Yes, help me") {
      const ts = videoRef.current?.currentTime ?? 0;
      setPendingHelpTimestamp(ts);
      setShowLookbackPicker(true);
    }
  };

  const handleLookbackSelection = (lookbackSeconds: number | null) => {
    const timestamp = pendingHelpTimestamp || (videoRef.current?.currentTime ?? 0);
    const clampedLookback =
      lookbackSeconds === null ? timestamp : Math.min(lookbackSeconds, timestamp);
    setShowLookbackPicker(false);
    setPendingHelpTimestamp(0);
    openHelpPanel(timestamp, clampedLookback);
  };
  const watchedSoFar = Math.max(1, Math.round(pendingHelpTimestamp || currentTime));
  const lookback50 = Math.max(1, Math.round(watchedSoFar * 0.5));
  const lookback25 = Math.max(1, Math.round(watchedSoFar * 0.25));
  const lookback50Mins = Math.max(1, Math.round(lookback50 / 60));
  const lookback25Mins = Math.max(1, Math.round(lookback25 / 60));

  return (
    <>
      <DashboardNavBar />
      <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
        <div className={`${styles.content} ${showHelpPanel ? styles.contentWide : ""}`}>
          <h1 className={styles.title}>Video Simulator</h1>

          <div
            ref={playerRowRef}
            className={`${styles.playerRow} ${showHelpPanel ? styles.playerRowSplit : ""}`}
          >
            {/* ── Video player ── */}
            <div
              className={styles.playerShell}
              style={showHelpPanel ? { flex: `0 0 calc(${videoPct}% - 8px)` } : undefined}
            >
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

              <div className={styles.controlsBar}>
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

                <div className={styles.bottomRow}>
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

                    <button
                      type="button"
                      className={styles.replayButton}
                      onClick={() => void handleReplay()}
                      aria-label="Replay from start"
                      title="Reset analytics and play from the beginning"
                    >
                      Replay
                    </button>

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

                    {predictionLoading && (
                      <span className={styles.analysing}>Analysing…</span>
                    )}
                  </div>

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

            {/* ── Drag-to-resize handle ── */}
            {showHelpPanel && (
              <div className={styles.resizeHandle} onMouseDown={onResizeStart} title="Drag to resize" />
            )}

            {/* ── Help panel ── */}
            {showHelpPanel && (
              <div
                ref={helpPanelRef}
                className={styles.helpPanel}
                style={{ flex: `0 0 calc(${100 - videoPct}% - 8px)`, height: `${panelHeight}px` }}
              >
                <div className={styles.helpPanelHeader}>
                  <div>
                    <h2 className={styles.helpPanelTitle}>Help</h2>
                    <span className={styles.helpPanelTimestamp}>
                      at {formatTime(helpTimestamp)}
                    </span>
                  </div>
                  <div className={styles.helpPanelHeaderRight}>
                    {/* Avatar / Read toggle — only show once help content is ready */}
                    {helpContent && !helpLoading && (
                      <div className={styles.avatarToggle}>
                        <button
                          className={`${styles.avatarToggleBtn} ${!avatarMode && !avatarLoading ? styles.avatarToggleBtnActive : ""}`}
                          onClick={() => { if (avatarMode || avatarLoading) stopAvatarSession(); }}
                          disabled={!avatarMode && !avatarLoading}
                        >
                          Written Explanation
                        </button>
                        <button
                          className={`${styles.avatarToggleBtn} ${(avatarMode || avatarLoading) ? styles.avatarToggleBtnActive : ""}`}
                          onClick={() => { if (!avatarMode && !avatarLoading) startAvatarSession(helpContent); }}
                          disabled={avatarMode || avatarLoading}
                        >
                          {avatarLoading ? "Connecting…" : "Video Explanation"}
                        </button>
                      </div>
                    )}
                    <button
                      className={styles.helpPanelClose}
                      onClick={() => setShowHelpPanel(false)}
                      aria-label="Close help panel"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className={styles.helpPanelBody}>
                  {/* Avatar video — hidden when not active */}
                  <video
                    ref={avatarVideoRef}
                    className={`${styles.avatarVideo} ${avatarMode ? styles.avatarVideoVisible : ""}`}
                    autoPlay
                    playsInline
                    muted={false}
                  />
                  {avatarError && (
                    <p className={styles.avatarError}>{avatarError}</p>
                  )}

                  {/* Written content — only shown in Read mode */}
                  {!avatarMode && !avatarLoading && (
                    helpLoading ? (
                      <div className={styles.helpLoading}>
                        <div className={styles.helpSpinner} />
                        <p>Generating help for this section…</p>
                      </div>
                    ) : helpContent ? (
                      <>
                        <section className={styles.helpSection}>
                          <h3 className={styles.helpSectionTitle}>Summary</h3>
                          <p className={styles.helpSummaryText}>{helpContent.summary}</p>
                        </section>

                        {helpContent.keyPoints.length > 0 && (
                          <section className={styles.helpSection}>
                            <h3 className={styles.helpSectionTitle}>Key Points</h3>
                            <ul className={styles.helpKeyPoints}>
                              {helpContent.keyPoints.map((kp, i) => {
                                const isOpen = revealedPoints.has(i);
                                return (
                                  <li key={i}>
                                    <button
                                      className={styles.helpPointToggle}
                                      onClick={() => setRevealedPoints((prev) => {
                                        const next = new Set(prev);
                                        isOpen ? next.delete(i) : next.add(i);
                                        return next;
                                      })}
                                      aria-expanded={isOpen}
                                    >
                                      <svg
                                        className={`${styles.helpPointChevron} ${isOpen ? styles.helpPointChevronOpen : ""}`}
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"
                                      >
                                        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                      <span className={styles.helpPointLabel}>{kp.point}</span>
                                    </button>
                                    {isOpen && kp.explanation && (
                                      <p className={styles.helpPointExplanation}>{kp.explanation}</p>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </section>
                        )}
                      </>
                    ) : null
                  )}

                  {/* Questions to Consider — available under the avatar too */}
                  {helpContent && !helpLoading && helpContent.suggestedQuestions.length > 0 && (
                    <section className={styles.helpSection}>
                      <h3 className={styles.helpSectionTitle}>Questions to Consider</h3>
                      <ul className={styles.helpQuestions}>
                        {helpContent.suggestedQuestions.map((sq, i) => {
                          const isRevealed = revealedAnswers.has(i);
                          return (
                            <li key={i}>
                              <div className={styles.helpQuestionRow}>
                                <span className={styles.helpQuestionLabel}>{sq.question}</span>
                                <button
                                  className={`${styles.helpRevealBtn} ${isRevealed ? styles.helpRevealBtnOpen : ""}`}
                                  onClick={() => setRevealedAnswers((prev) => {
                                    const next = new Set(prev);
                                    isRevealed ? next.delete(i) : next.add(i);
                                    return next;
                                  })}
                                  aria-expanded={isRevealed}
                                >
                                  {isRevealed ? "Hide answer" : "Show answer"}
                                </button>
                              </div>
                              {isRevealed && sq.answer && (
                                <p className={styles.helpQuestionAnswer}>{sq.answer}</p>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  )}

                  {/* Avatar mode hint */}
                  {(avatarMode || avatarLoading) && !avatarError && (
                    <p className={styles.avatarHint}>
                      Switch to <strong>Read</strong> to review the summary and key points at your own pace. The questions (and answers) are available here too.
                    </p>
                  )}
                </div>

                {/* ── Feedback + chat footer ── */}
                {helpContent && !helpLoading && (
                  <div className={styles.helpPanelFooter}>
                    {/* Was this helpful?
                    <div className={styles.helpFeedback}>
                      <span className={styles.helpFeedbackLabel}>Was this helpful?</span>
                      <div className={styles.helpFeedbackBtns}>
                        <button
                          className={`${styles.helpFeedbackBtn} ${helpfulness === "up" ? styles.helpFeedbackBtnActive : ""}`}
                          onClick={() => setHelpfulness((prev) => prev === "up" ? null : "up")}
                          aria-label="Yes, this was helpful"
                          title="Yes, this helped"
                        >
                          <svg viewBox="0 0 24 24" fill={helpfulness === "up" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <button
                          className={`${styles.helpFeedbackBtn} ${helpfulness === "down" ? styles.helpFeedbackBtnActive : ""}`}
                          onClick={() => setHelpfulness((prev) => prev === "down" ? null : "down")}
                          aria-label="No, this wasn't helpful"
                          title="No, I still need help"
                        >
                          <svg viewBox="0 0 24 24" fill={helpfulness === "down" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                      {helpfulness && (
                        <span className={styles.helpFeedbackConfirm}>
                          {helpfulness === "up" ? "Thanks for the feedback!" : "Got it — we'll keep improving!"}
                        </span>
                      )}
                    </div> */}

                    {/* Need more help? */}
                    <div className={styles.helpChat}>
                      <div className={styles.helpChatHeader}>
                        <span className={styles.helpChatLabel}>Need more help?</span>
                        <div className={styles.helpChatControls}>
                          <button
                            type="button"
                            className={`${styles.helpChatToggleBtn} ${!chatMinimized ? styles.helpChatToggleBtnActive : ""}`}
                            onClick={() => setChatMinimized((prev) => !prev)}
                            aria-expanded={!chatMinimized}
                            aria-label={chatMinimized ? "Expand chat" : "Minimize chat"}
                          >
                            {chatMinimized
                              ? `Open chat${chatMessages.length > 0 ? ` (${chatMessages.length})` : ""}`
                              : "Minimize"}
                          </button>
                        </div>
                      </div>

                      {!chatMinimized && (
                        <div
                          className={styles.helpChatMessages}
                        >
                          {chatMessages.length > 0 ? (
                            chatMessages.map((msg, i) => (
                              <div
                                key={i}
                                className={`${styles.helpChatMsg} ${msg.role === "user" ? styles.helpChatMsgUser : styles.helpChatMsgAssistant}`}
                              >
                                {msg.text}
                              </div>
                            ))
                          ) : (
                            <p className={styles.helpChatEmpty}>No messages yet. Ask your question below.</p>
                          )}

                          {chatLoading && (
                            <div
                              className={`${styles.helpChatMsg} ${styles.helpChatMsgAssistant} ${styles.helpChatMsgLoading}`}
                            >
                              Thinking…
                            </div>
                          )}
                        </div>
                      )}
                      <div className={styles.helpChatInputRow}>
                        <input
                          type="text"
                          className={styles.helpChatInput}
                          placeholder="Ask a follow-up question…"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }}
                          disabled={chatLoading}
                        />
                        <button
                          className={styles.helpChatSend}
                          onClick={sendChatMessage}
                          disabled={!chatInput.trim() || chatLoading}
                          aria-label="Send"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Vertical drag-to-resize handle ── */}
                <div className={styles.verticalResizeHandle} onMouseDown={onVerticalResizeStart} title="Drag to resize height" />
              </div>
            )}
          </div>

          {/* ── Help button (manual trigger) ── */}
          {!showHelpPanel && (
            <div className={styles.demoRow}>
              <button
                className={styles.demoTrigger}
                onClick={() => {
                  const ts = videoRef.current?.currentTime ?? 0;
                  if (isPlaying) handlePause();
                  setPendingHelpTimestamp(ts);
                  setShowLookbackPicker(true);
                }}
              >
                Get help
              </button>
              {/* <button
                className={styles.demoTrigger}
                onClick={() => { setShowConfusionModal(true); }}
              >
                Preview confusion alert
              </button> */}
            </div>
          )}

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

      {/* ── Confusion detection modal ── */}
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
              which is completely okay! Would you like us to provide a deeper explanation or
              additional resources for this topic?
            </p>
            <div className={styles.modalActions}>
              <button
                className={`${styles.modalBtn} ${styles.modalBtnPrimary}`}
                onClick={() => handleModalResponse("Yes, help me")}
              >
                Yes, help me
              </button>
              {!confusionModalFromEnd && (
                <button
                  className={`${styles.modalBtn} ${styles.modalBtnSecondary}`}
                  onClick={() => handleModalResponse("Maybe later")}
                >
                  Maybe later
                </button>
              )}
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

      {showLookbackPicker && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="lookbackTitle">
          <div className={styles.modal}>
            <h2 className={styles.modalTitle} id="lookbackTitle">
              Choose Help Scope
            </h2>
            <p className={styles.modalBody}>
              Select how much recent content you want help with.
            </p>
            <div className={styles.modalActions}>
              
              <button
                className={`${styles.modalBtn} ${styles.modalBtnSecondary}`}
                onClick={() => handleLookbackSelection(lookback25)}
              >
                Last {lookback25Mins} minute{lookback25Mins === 1 ? "" : "s"}
              </button>
              <button
                className={`${styles.modalBtn} ${styles.modalBtnSecondary}`}
                onClick={() => handleLookbackSelection(lookback50)}
              >
                Last {lookback50Mins} minute{lookback50Mins === 1 ? "" : "s"}
              </button>
              <button
                className={`${styles.modalBtn} ${styles.modalBtnPrimary}`}
                onClick={() => handleLookbackSelection(null)}
              >
                Whole video so far
              </button>
              <button
                className={`${styles.modalBtn} ${styles.modalBtnGhost}`}
                onClick={() => {
                  setShowLookbackPicker(false);
                  setPendingHelpTimestamp(0);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoSimulator;
