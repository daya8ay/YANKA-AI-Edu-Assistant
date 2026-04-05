"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./avatar.module.css";

type HeygenVoice = {
    voice_id: string;
    name: string;
    language: string;
    gender: string;
    preview_audio: string;
    support_pause?: boolean;
    emotion_support?: boolean;
};

const Voice: React.FC<{
    voices: HeygenVoice[];
    selectedVoiceId: string | null;
    onSelectVoiceId: (voiceId: string) => void;
    loading?: boolean;
    error?: string | null;
}> = ({ voices, selectedVoiceId, onSelectVoiceId, loading, error }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const VOICES_PER_PAGE = 18;
    const [page, setPage] = useState(1);

    const voicesWithPreview = useMemo(() => {
        const hasPreview = (v: HeygenVoice) =>
            typeof v.preview_audio === "string" && v.preview_audio.trim() !== "";

        const isSingleWordName = (name: string) =>
            name.trim().split(/\s+/).filter(Boolean).length === 1;

        return voices.filter((v) => {
            const nameOk = typeof v.name === "string" && isSingleWordName(v.name);
            return hasPreview(v) && nameOk;
        });
    }, [voices]);

    const selectedVoice = useMemo(() => {
        if (!selectedVoiceId) return null;
        return voicesWithPreview.find((v) => v.voice_id === selectedVoiceId) ?? null;
    }, [selectedVoiceId, voicesWithPreview]);

    // Ensure the selection always points to a voice that has preview audio.
    useEffect(() => {
        if (!selectedVoiceId) return;
        if (selectedVoice) return;
        if (voicesWithPreview.length === 0) return;
        onSelectVoiceId(voicesWithPreview[0].voice_id);
    }, [selectedVoiceId, selectedVoice, voicesWithPreview, onSelectVoiceId]);

    // Autoplay preview whenever the selected voice changes.
    useEffect(() => {
        if (!selectedVoice?.preview_audio) return;
        if (!audioRef.current) return;

        try {
            // Reset so the preview always starts from the beginning.
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        } catch {
            // Ignore reset errors (some browsers may throw during rapid src swaps).
        }

        audioRef.current.play().catch(() => {
            // Autoplay can be blocked if not triggered by user gesture; we ignore.
        });
    }, [selectedVoice?.voice_id, selectedVoice?.preview_audio]);

    const sortedVoices = useMemo(() => {
        return [...voicesWithPreview].sort((a, b) =>
            (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" })
        );
    }, [voicesWithPreview]);

    const totalPages = Math.max(1, Math.ceil(sortedVoices.length / VOICES_PER_PAGE));
    const safePage = Math.min(page, totalPages);
    const pageStart = (safePage - 1) * VOICES_PER_PAGE;
    const pageEnd = Math.min(pageStart + VOICES_PER_PAGE, sortedVoices.length);
    const pageVoices = useMemo(
        () => sortedVoices.slice(pageStart, pageEnd),
        [sortedVoices, pageStart, pageEnd],
    );

    // Keep pagination page in a valid range when the list shrinks/changes.
    useEffect(() => {
        setPage((p) => Math.min(Math.max(1, p), totalPages));
    }, [totalPages]);

    // Jump to the page that contains the currently selected voice.
    useEffect(() => {
        if (!selectedVoiceId) {
            setPage(1);
            return;
        }
        if (sortedVoices.length === 0) {
            setPage(1);
            return;
        }
        const idx = sortedVoices.findIndex((v) => v.voice_id === selectedVoiceId);
        if (idx === -1) {
            setPage(1);
            return;
        }
        setPage(Math.floor(idx / VOICES_PER_PAGE) + 1);
    }, [selectedVoiceId, sortedVoices]);

    return (
        <div className={styles.tabContent}>
            <div className={styles.section}>
                <h4>Select Voice</h4>

                {loading ? <p style={{ color: "#6B7FA8" }}>Loading voices...</p> : null}
                {error ? <p style={{ color: "red" }}>{error}</p> : null}

                {!loading && !error ? (
                    <>
                        {selectedVoice?.preview_audio ? (
                            <div style={{ marginTop: "15px" }}>
                                <h5
                                    style={{
                                        marginBottom: "10px",
                                        fontSize: "1rem",
                                        color: "#1E4386",
                                    }}
                                >
                                    Preview
                                </h5>
                                <audio
                                    ref={audioRef}
                                    autoPlay
                                    playsInline
                                    controls
                                    src={selectedVoice.preview_audio}
                                    style={{ width: "100%" }}
                                />
                            </div>
                        ) : null}

                        {voicesWithPreview.length === 0 ? (
                            <p style={{ color: "#6B7FA8", marginTop: "12px" }}>
                                No voices with preview audio available.
                            </p>
                        ) : (
                            <div className={styles.styleOptions} style={{ marginTop: "14px" }}>
                                {pageVoices.map((v) => (
                                    <button
                                        key={v.voice_id}
                                        onClick={() => onSelectVoiceId(v.voice_id)}
                                        className={`${styles.styleOption} ${
                                            selectedVoiceId === v.voice_id ? styles.selected : ""
                                        }`}
                                    >
                                        {v.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {voicesWithPreview.length > VOICES_PER_PAGE ? (
                            <div className={styles.avatarPagination}>
                                <button
                                    type="button"
                                    className={styles.avatarPaginationBtn}
                                    disabled={safePage <= 1}
                                    onClick={() =>
                                        setPage((p) =>
                                            Math.max(1, Math.min(totalPages, p) - 1),
                                        )
                                    }
                                >
                                    Previous
                                </button>
                                <span className={styles.avatarPaginationInfo}>
                                    {pageStart + 1}–{pageEnd} of {sortedVoices.length} · Page{" "}
                                    {safePage} / {totalPages}
                                </span>
                                <button
                                    type="button"
                                    className={styles.avatarPaginationBtn}
                                    disabled={safePage >= totalPages}
                                    onClick={() =>
                                        setPage((p) =>
                                            Math.min(
                                                totalPages,
                                                Math.max(1, p) + 1,
                                            ),
                                        )
                                    }
                                >
                                    Next
                                </button>
                            </div>
                        ) : null}
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default Voice;

