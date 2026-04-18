"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./avatar.module.css";
import {
    VIDEO_VOICE_LANGUAGE_OPTIONS,
    type VideoVoiceLanguage,
    normalizeVoiceLanguageToVideoKey,
} from "./voiceLanguageOptions";

type HeygenVoice = {
    voice_id: string;
    name: string;
    language?: string | null;
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

    const VOICES_PER_PAGE = 20;
    const [page, setPage] = useState(1);
    const [voiceLanguage, setVoiceLanguage] = useState<VideoVoiceLanguage>("english");

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

    /** Preview + single-word names + language matches a video-page language. */
    const eligibleVoices = useMemo(() => {
        return voicesWithPreview.filter((v) => normalizeVoiceLanguageToVideoKey(v.language) != null);
    }, [voicesWithPreview]);

    const countsByLanguage = useMemo(() => {
        const m = new Map<VideoVoiceLanguage, number>();
        for (const o of VIDEO_VOICE_LANGUAGE_OPTIONS) {
            m.set(o.value, 0);
        }
        for (const v of eligibleVoices) {
            const k = normalizeVoiceLanguageToVideoKey(v.language);
            if (k) m.set(k, (m.get(k) ?? 0) + 1);
        }
        return m;
    }, [eligibleVoices]);

    const selectedVoice = useMemo(() => {
        if (!selectedVoiceId) return null;
        return eligibleVoices.find((v) => v.voice_id === selectedVoiceId) ?? null;
    }, [selectedVoiceId, eligibleVoices]);

    // Drop invalid selection when the eligible list changes; align language to that pick.
    useEffect(() => {
        if (eligibleVoices.length === 0) return;
        if (!selectedVoiceId || !eligibleVoices.some((v) => v.voice_id === selectedVoiceId)) {
            const pick = eligibleVoices[0];
            onSelectVoiceId(pick.voice_id);
            const n = normalizeVoiceLanguageToVideoKey(pick.language);
            if (n) setVoiceLanguage(n);
        }
    }, [eligibleVoices, selectedVoiceId, onSelectVoiceId]);

    // When data loads or parent changes selection, align dropdown to the selected voice.
    useEffect(() => {
        if (eligibleVoices.length === 0 || !selectedVoiceId) return;
        const v = eligibleVoices.find((x) => x.voice_id === selectedVoiceId);
        if (!v) return;
        const n = normalizeVoiceLanguageToVideoKey(v.language);
        if (!n) return;
        setVoiceLanguage((tab) => (tab === n ? tab : n));
    }, [eligibleVoices, selectedVoiceId]);

    // Autoplay preview whenever the selected voice changes.
    useEffect(() => {
        if (!selectedVoice?.preview_audio) return;
        if (!audioRef.current) return;

        try {
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
        const inLang = eligibleVoices.filter(
            (v) => normalizeVoiceLanguageToVideoKey(v.language) === voiceLanguage,
        );
        return [...inLang].sort((a, b) =>
            (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" }),
        );
    }, [eligibleVoices, voiceLanguage]);

    const voiceLanguageSelectStyle: React.CSSProperties = {
        width: "100%",
        padding: "10px",
        marginBottom: "12px",
        borderRadius: "6px",
        border: "1px solid #ccc",
    };

    const goToVoiceLanguage = (lang: VideoVoiceLanguage) => {
        setVoiceLanguage(lang);
        setPage(1);
        const list = eligibleVoices
            .filter((v) => normalizeVoiceLanguageToVideoKey(v.language) === lang)
            .sort((a, b) =>
                (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" }),
            );
        if (list[0]) onSelectVoiceId(list[0].voice_id);
    };

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
                        {voicesWithPreview.length === 0 ? (
                            <p style={{ color: "#6B7FA8", marginTop: "12px" }}>
                                No voices with preview audio available.
                            </p>
                        ) : eligibleVoices.length === 0 ? (
                            <p style={{ color: "#6B7FA8", marginTop: "12px" }}>
                                No voices match the current filters (preview + single-word names) for any
                                language in the list below. HeyGen may use different language labels for
                                some locales.
                            </p>
                        ) : (
                            <>
                                <label
                                    htmlFor="avatar-voice-language"
                                    style={{
                                        display: "block",
                                        marginTop: "12px",
                                        marginBottom: "6px",
                                        fontSize: "0.95rem",
                                        color: "#1E4386",
                                        fontWeight: 600,
                                    }}
                                >
                                    Voice language
                                </label>
                                <select
                                    id="avatar-voice-language"
                                    value={voiceLanguage}
                                    onChange={(e) =>
                                        goToVoiceLanguage(e.target.value as VideoVoiceLanguage)
                                    }
                                    style={voiceLanguageSelectStyle}
                                >
                                    {VIDEO_VOICE_LANGUAGE_OPTIONS.map((opt) => (
                                        <option
                                            key={opt.value}
                                            value={opt.value}
                                            disabled={(countsByLanguage.get(opt.value) ?? 0) === 0}
                                        >
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>

                                {selectedVoice?.preview_audio ? (
                                    <div style={{ marginTop: "4px", marginBottom: "4px" }}>
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

                                {sortedVoices.length === 0 ? (
                                    <p style={{ color: "#6B7FA8", marginTop: "8px" }}>
                                        No voices for this language with the current filters.
                                    </p>
                                ) : (
                                    <div className={styles.styleOptions} style={{ marginTop: "12px" }}>
                                        {pageVoices.map((v) => (
                                            <button
                                                key={v.voice_id}
                                                type="button"
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
                            </>
                        )}

                        {eligibleVoices.length > 0 && sortedVoices.length > VOICES_PER_PAGE ? (
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
