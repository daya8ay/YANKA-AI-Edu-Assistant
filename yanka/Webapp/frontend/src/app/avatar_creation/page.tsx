"use client";

import React, { useEffect, useMemo, useState } from "react";
import DashboardNavBar from "@/components/DashboardNavBar";
import Footer from "@/components/Footer";
import styles from "./avatar.module.css";
import Clothing from "./clothing";
import Voice from "./voice";
import StudioAvatar, { type PresenterGender } from "./studioAvatar";
import { useAuth } from "@/hooks/useAuth";
import { avatarService, type HeyGenAvatarData, type SavedAvatar } from "@/services/avatarService";

type HeygenAvatar = {
  id: string;
  name: string;
  gender?: string | null;
  preview_image_url: string;
  default_voice_id: string | null;
  kind: "avatar" | "talking_photo" | "avatar_group";
};

function mergeAvatarsByKindId(base: HeygenAvatar[], extra: HeygenAvatar[]): HeygenAvatar[] {
  const seen = new Set(base.map((a) => `${a.kind}:${a.id}`));
  const out = [...base];
  for (const a of extra) {
    const key = `${a.kind}:${a.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(a);
  }
  return out;
}

function getPersonKey(a: Pick<HeygenAvatar, "id" | "name" | "kind">): string {
  // Prefer the name prefix before " in " (e.g. "Aditya in Blue shirt" => "Aditya")
  const name = (a.name ?? "").trim();
  const inIdx = name.toLowerCase().indexOf(" in ");
  if (inIdx > 0) return name.slice(0, inIdx).trim();

  // Fallback: avatar_id prefix before first underscore (e.g. "Aditya_public_1" => "Aditya")
  const id = (a.id ?? "").trim();
  const usIdx = id.indexOf("_");
  if (usIdx > 0) return id.slice(0, usIdx).trim();

  // For many talking-photo / other rows, names are like:
  // "Tiana smiling 2", "Tiana riding a horse", "Tiana front of castle 3".
  // Treat the leading token as the person when followed by scene/pose words.
  const firstWord = name.match(/^([A-Za-z][A-Za-z'-]*)\b/);
  if (firstWord) {
    const lead = firstWord[1];
    const rest = name.slice(firstWord[0].length).trim().toLowerCase();
    const looksLikePoseOrScene =
      /^(\d+\b|\(|in\b|on\b|at\b|with\b|without\b|riding\b|standing\b|sitting\b|smiling\b|laughing\b|front\b|side\b|left\b|right\b)/.test(rest);
    if (rest && looksLikePoseOrScene) return lead;
  }

  // For talking-photo/group entries, be more aggressive so variant names collapse
  // into one presenter card (e.g. "Tiana smiling 2", "Tiana riding a horse").
  if (a.kind !== "avatar") {
    const firstToken = name.match(/^([A-Za-z][A-Za-z'-]*)\b/);
    if (firstToken) return firstToken[1];
  }

  return name || id;
}

function avatarMatchesPresenterGender(
  avatar: Pick<HeygenAvatar, "gender">,
  filter: PresenterGender,
): boolean {
  const g = (avatar.gender ?? "").toLowerCase().trim();
  const isMale = g === "male" || g === "man" || g === "m";
  const isFemale = g === "female" || g === "woman" || g === "f";

  if (filter === "male") return isMale;
  if (filter === "female") return isFemale;
  return !isMale && !isFemale;
}

/** Must match initial `presenterGender` state (used to pick first avatar after fetch). */
const DEFAULT_PRESENTER_GENDER: PresenterGender = "male";

type HeygenVoice = {
  voice_id: string;
  name: string;
  language: string;
  gender: string;
  preview_audio: string;
  support_pause?: boolean;
  emotion_support?: boolean;
};

const AvatarCreation = () => {
  const [currentTab, setCurrentTab] = useState("Avatar");

  const [heygenLoading, setHeygenLoading] = useState(true);
  const [heygenError, setHeygenError] = useState<string | null>(null);
  const [avatars, setAvatars] = useState<HeygenAvatar[]>([]);
  const [voices, setVoices] = useState<HeygenVoice[]>([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [presenterGender, setPresenterGender] =
    useState<PresenterGender>(DEFAULT_PRESENTER_GENDER);
  const [selectedPersonKey, setSelectedPersonKey] = useState<string | null>(null);

  // Avatar saving state
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [customAvatarName, setCustomAvatarName] = useState<string>("");

  // Saved avatars state
  const [savedAvatars, setSavedAvatars] = useState<SavedAvatar[]>([]);
  const [loadingSavedAvatars, setLoadingSavedAvatars] = useState(false);
  const [deletingAvatarId, setDeletingAvatarId] = useState<number | null>(null);
  const [renamingAvatarId, setRenamingAvatarId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState<string>("");

  // Auth hook
  const { authStatus, authFetch } = useAuth();

  const tabs = [
    { id: "Avatar", label: "Avatar" },
    { id: "Looks", label: "Looks" },
    { id: "Voice", label: "Voice" },
    { id: "MyAvatars", label: "My Avatars" },
  ];

  const selectedAvatar =
    avatars.find((a) => a.id === selectedAvatarId) ?? null;

  const filteredAvatars = useMemo(
    () => avatars.filter((a) => avatarMatchesPresenterGender(a, presenterGender)),
    [avatars, presenterGender],
  );

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  useEffect(() => {
    let cancelled = false;

    async function loadHeygenLists() {
      setHeygenLoading(true);
      setHeygenError(null);

      try {
        const [avatarsRes, voicesRes] = await Promise.all([
          fetch(`${API_URL}/heygen/avatars`),
          fetch(`${API_URL}/heygen/voices`),
        ]);

        if (!avatarsRes.ok) throw new Error("Failed to load avatars");
        if (!voicesRes.ok) throw new Error("Failed to load voices");

        const avatarsJson = await avatarsRes.json();
        const voicesJson = await voicesRes.json();

        const loadedAvatars: HeygenAvatar[] = avatarsJson.avatars ?? [];
        const loadedVoices: HeygenVoice[] = voicesJson.voices ?? [];

        if (cancelled) return;

        setAvatars(loadedAvatars);
        setVoices(loadedVoices);

        const firstMatch =
          loadedAvatars.find((a) =>
            avatarMatchesPresenterGender(a, DEFAULT_PRESENTER_GENDER),
          ) ??
          loadedAvatars[0] ??
          null;
        const initialVoiceId =
          (firstMatch?.default_voice_id &&
            loadedVoices.some((v) => v.voice_id === firstMatch.default_voice_id)
            ? firstMatch.default_voice_id
            : loadedVoices[0]?.voice_id ?? null) ?? null;

        setSelectedAvatarId(firstMatch?.id ?? null);
        setSelectedVoiceId(initialVoiceId);

        // Group looks are a separate slow endpoint so /heygen/avatars matches HeyGen /v2/avatars
        // (same as heygen_avatars_dump.json) and the grid fills in when this returns.
        void (async () => {
          try {
            const gr = await fetch(`${API_URL}/heygen/avatar-group-looks`);
            if (!gr.ok || cancelled) return;
            const gj = await gr.json();
            const extra: HeygenAvatar[] = gj.avatars ?? [];
            if (cancelled || extra.length === 0) return;
            setAvatars((prev) => mergeAvatarsByKindId(prev, extra));
          } catch {
            /* keep v2-only list */
          }
        })();
      } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        setHeygenError(message);
      } finally {
        if (!cancelled) setHeygenLoading(false);
      }
    }

    loadHeygenLists();
    return () => {
      cancelled = true;
    };
  }, [API_URL]);

  useEffect(() => {
    // When the user picks a different avatar, prefer that avatar's default voice.
    if (!selectedAvatarId) return;
    const a = avatars.find((x) => x.id === selectedAvatarId);
    if (!a?.default_voice_id) return;
    if (!voices.some((v) => v.voice_id === a.default_voice_id)) return;
    setSelectedVoiceId(a.default_voice_id);
  }, [selectedAvatarId, avatars, voices]);

  useEffect(() => {
    // Keep selected person in sync with selected variant.
    if (!selectedAvatar) return;
    setSelectedPersonKey(getPersonKey(selectedAvatar));
    setCustomAvatarName(selectedAvatar.name ?? "");
  }, [selectedAvatar?.id]);

  useEffect(() => {
    if (!selectedAvatarId) return;
    const stillShown = filteredAvatars.some((a) => a.id === selectedAvatarId);
    if (stillShown) return;
    const fallback = filteredAvatars[0] ?? null;
    if (!fallback) {
      setSelectedAvatarId(null);
      return;
    }
    setSelectedAvatarId(fallback.id);
    if (
      fallback.default_voice_id &&
      voices.some((v) => v.voice_id === fallback.default_voice_id)
    ) {
      setSelectedVoiceId(fallback.default_voice_id);
    }
    setSelectedPersonKey(getPersonKey(fallback));
  }, [filteredAvatars, selectedAvatarId, voices]);

  // Keep look switching comprehensive for a presenter across all gender buckets.
  const selectedPersonVariants = useMemo(() => {
    if (!selectedPersonKey) return [];
    return avatars.filter((a) => getPersonKey(a) === selectedPersonKey);
  }, [avatars, selectedPersonKey]);

  /** Looks tab: include studio + talking photos for the person; exclude group catalog rows. */
  const looksTabVariants = useMemo(
    () => selectedPersonVariants.filter((a) => a.kind !== "avatar_group"),
    [selectedPersonVariants],
  );

  const voiceNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const v of voices) {
      if (v.voice_id) m.set(v.voice_id, v.name);
    }
    return m;
  }, [voices]);

  // Save avatar function
  const handleSaveAvatar = async () => {
    if (!selectedAvatar || authStatus !== 'authenticated') {
      setSaveMessage({
        type: 'error',
        text: authStatus !== 'authenticated' ? 'Please log in to save avatars' : 'Please select an avatar first'
      });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const heygenData: HeyGenAvatarData = {
        avatar_id: selectedAvatar.id,
        avatar_name: selectedAvatar.name,
        gender: selectedAvatar.gender,
        preview_image_url: selectedAvatar.preview_image_url,
        // Save the voice the user actually selected in the Voice tab.
        default_voice_id: selectedVoiceId ?? selectedAvatar.default_voice_id,
        type: selectedAvatar.kind,
      };

      await avatarService.saveUserAvatar(heygenData, authFetch, customAvatarName.trim() || undefined);

      setSaveMessage({
        type: 'success',
        text: 'Avatar saved successfully! You can now access it anytime.'
      });

      // Refresh saved avatars list
      loadSavedAvatars();
    } catch (error) {
      console.error('Error saving avatar:', error);
      setSaveMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to save avatar'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Clear save message after 5 seconds
  useEffect(() => {
    if (saveMessage) {
      const timer = setTimeout(() => {
        setSaveMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [saveMessage]);

  // Load saved avatars when user is authenticated
  const loadSavedAvatars = async () => {
    if (authStatus !== 'authenticated') {
      setSavedAvatars([]);
      return;
    }

    setLoadingSavedAvatars(true);
    try {
      const userAvatars = await avatarService.getUserAvatars(authFetch);
      setSavedAvatars(userAvatars);
    } catch (error) {
      console.error('Error loading saved avatars:', error);
      setSavedAvatars([]);
    } finally {
      setLoadingSavedAvatars(false);
    }
  };

  useEffect(() => {
    loadSavedAvatars();
  }, [authStatus]);

  const handleDeleteSavedAvatar = async (
    e: React.MouseEvent<HTMLButtonElement>,
    savedAvatar: SavedAvatar,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(
      "Remove this avatar from your saved list? Existing generated videos will not be deleted.",
    );
    if (!confirmed) return;

    setDeletingAvatarId(savedAvatar.avatar_id);
    try {
      await avatarService.deleteUserAvatar(savedAvatar.avatar_id, authFetch);
      await loadSavedAvatars();
    } catch (error) {
      console.error("Error deleting saved avatar:", error);
      window.alert(error instanceof Error ? error.message : "Failed to delete avatar");
    } finally {
      setDeletingAvatarId(null);
    }
  };

  const handleRenameStart = (savedAvatar: SavedAvatar) => {
    setRenamingAvatarId(savedAvatar.avatar_id);
    setRenameValue(savedAvatar.name || savedAvatar.heygen_data?.avatar_name || "");
  };

  const handleRenameConfirm = async (avatarId: number) => {
    const trimmed = renameValue.trim();
    if (!trimmed) return;
    try {
      await avatarService.renameUserAvatar(avatarId, trimmed, authFetch);
      setSavedAvatars((prev) =>
        prev.map((a) => (a.avatar_id === avatarId ? { ...a, name: trimmed } : a))
      );
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to rename avatar");
    } finally {
      setRenamingAvatarId(null);
      setRenameValue("");
    }
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case "Avatar":
        return (
          <StudioAvatar
            avatars={filteredAvatars}
            presenterGender={presenterGender}
            onPresenterGenderChange={setPresenterGender}
            selectedAvatarId={selectedAvatarId}
            onSelectAvatarId={(avatarId) => {
              setSelectedAvatarId(avatarId);
              const picked = filteredAvatars.find((a) => a.id === avatarId);
              if (picked) setSelectedPersonKey(getPersonKey(picked));
            }}
            loading={heygenLoading}
            error={heygenError}
          />
        );

      // case "Face":
      //   return <Face />;

      // case "Hair":
      //   return <Hair />;

      case "Looks":
        return (
          <Clothing
            personKey={selectedPersonKey}
            selectedAvatarId={selectedAvatarId}
            variants={looksTabVariants}
            onSelectAvatarId={setSelectedAvatarId}
          />
        );

      // case "Accessories":
      //   return <Accessories />;

      case "Voice":
        return (
          <Voice
            voices={voices}
            selectedVoiceId={selectedVoiceId}
            onSelectVoiceId={(voiceId) => setSelectedVoiceId(voiceId)}
            loading={heygenLoading}
            error={heygenError}
          />
        );

      case "MyAvatars":
        return (
          <div className={styles.tabContent}>
            <div className={styles.section}>
              <h4>My Saved Avatars</h4>
              {authStatus === "authenticated" &&
              !loadingSavedAvatars &&
              savedAvatars.length > 0 ? (
                <p className={styles.savedSectionIntro}>
                  Tap a card to load that avatar and voice into the editor.
                </p>
              ) : null}

              {authStatus !== 'authenticated' ? (
                <p className={styles.savedLoginHint}>
                  Please log in to view your saved avatars.
                </p>
              ) : loadingSavedAvatars ? (
                <p className={styles.savedLoading}>
                  Loading your saved avatars...
                </p>
              ) : savedAvatars.length === 0 ? (
                <div className={styles.savedEmpty}>
                  <p>
                    You haven&apos;t saved any avatars yet.
                  </p>
                  <p>
                    Go to the <strong>Avatar</strong> tab to select and save your first avatar!
                  </p>
                </div>
              ) : (
                <div className={styles.imageOptions}>
                  {savedAvatars.map((savedAvatar) => {
                    const savedVoiceId =
                      savedAvatar.heygen_data?.default_voice_id ?? savedAvatar.voice_id ?? null;
                    const voiceLabel =
                      savedVoiceId != null && savedVoiceId !== ""
                        ? voiceNameById.get(savedVoiceId) ?? "Unknown voice"
                        : "Not set";

                    return (
                      <div
                        key={savedAvatar.avatar_id}
                        className={`${styles.imageOption} ${styles.savedAvatarCard} ${
                          selectedAvatarId === savedAvatar.heygen_data?.avatar_id ? styles.selected : ""
                        }`}
                      >
                        <button
                          type="button"
                          className={styles.savedAvatarSelectBtn}
                          onClick={() => {
                            if (savedAvatar.heygen_data) {
                              setSelectedAvatarId(savedAvatar.heygen_data.avatar_id);
                              const vid =
                                savedAvatar.heygen_data.default_voice_id ??
                                savedAvatar.voice_id ??
                                null;
                              if (vid) setSelectedVoiceId(vid);
                            }
                          }}
                          title={`${savedAvatar.name || "Saved Avatar"} · Saved`}
                        >
                          <div className={styles.savedAvatarMedia}>
                            {savedAvatar.heygen_data?.preview_image_url ? (
                              <img
                                src={savedAvatar.heygen_data.preview_image_url}
                                alt={savedAvatar.name || "Saved avatar"}
                                className={styles.optionImage}
                              />
                            ) : (
                              <div
                                className={styles.optionImage}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  background: "rgba(255,255,255,0.5)",
                                }}
                              >
                                <span style={{ color: "#8a9bb8", fontSize: "0.78rem" }}>
                                  No preview
                                </span>
                              </div>
                            )}
                          </div>
                          <span className={styles.optionLabel}>
                            {savedAvatar.name || savedAvatar.heygen_data?.avatar_name || "Saved Avatar"}
                          </span>
                          <span className={styles.savedVoiceLine}>
                            Voice: <strong>{voiceLabel}</strong>
                          </span>
                          <span className={styles.savedBadge}>Saved</span>
                        </button>

                        <button
                          type="button"
                          className={styles.savedAvatarDeleteBtn}
                          disabled={deletingAvatarId === savedAvatar.avatar_id}
                          onClick={(e) => handleDeleteSavedAvatar(e, savedAvatar)}
                          aria-label={`Remove ${savedAvatar.name || savedAvatar.heygen_data?.avatar_name || "saved avatar"} from saved list`}
                        >
                          {deletingAvatarId === savedAvatar.avatar_id ? "Removing..." : "Remove"}
                        </button>

                        {renamingAvatarId === savedAvatar.avatar_id ? (
                          <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
                            <input
                              type="text"
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleRenameConfirm(savedAvatar.avatar_id);
                                if (e.key === "Escape") setRenamingAvatarId(null);
                              }}
                              maxLength={100}
                              autoFocus
                              style={{
                                flex: 1,
                                padding: "4px 8px",
                                borderRadius: "4px",
                                border: "1px solid #c0cbe0",
                                fontSize: "0.78rem",
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleRenameConfirm(savedAvatar.avatar_id)}
                              style={{ fontSize: "0.78rem", padding: "4px 8px", borderRadius: "4px", border: "none", background: "#3B4F8E", color: "white", cursor: "pointer" }}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setRenamingAvatarId(null)}
                              style={{ fontSize: "0.78rem", padding: "4px 8px", borderRadius: "4px", border: "1px solid #c0cbe0", background: "white", cursor: "pointer" }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRenameStart(savedAvatar)}
                            style={{ fontSize: "0.75rem", marginTop: "4px", background: "none", border: "none", color: "#3B4F8E", cursor: "pointer", textDecoration: "underline" }}
                          >
                            Rename
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <DashboardNavBar />
      <div className={styles.page}>
        <main className={styles.main}>
          <h1 className={styles.pageTitle}>Choose Your AI Avatar</h1>

          <div className={styles.cardRow}>
            <div className={styles.previewCard}>
              <h3>Preview</h3>
              <div
                className={`${styles.previewImageWrap} ${styles.previewImageWrapFixed}`}
              >
                {heygenLoading ? (
                  <p className={styles.previewEmpty}>Loading avatars…</p>
                ) : heygenError ? (
                  <p className={styles.previewEmpty} style={{ color: "#c53030" }}>
                    {heygenError}
                  </p>
                ) : selectedAvatar?.preview_image_url ? (
                  <img
                    src={selectedAvatar.preview_image_url}
                    alt={selectedAvatar.name || "Selected avatar"}
                    className={styles.previewImage}
                  />
                ) : (
                  <p className={styles.previewEmpty}>
                    Select an avatar in the <strong>Avatar</strong> tab to see it here.
                  </p>
                )}
              </div>
              {selectedAvatar ? (
                <>
                  <p
                    style={{
                      marginTop: "12px",
                      fontSize: "0.9rem",
                      color: "#3B4F8E",
                      textAlign: "center",
                    }}
                  >
                    {selectedAvatar.name}
                    {selectedAvatar.kind === "talking_photo"
                      ? " · Photo avatar"
                      : selectedAvatar.kind === "avatar_group"
                        ? " · Group look"
                        : ""}
                  </p>

                  {/* Custom name input */}
                  <div style={{ marginTop: "12px" }}>
                    <input
                      type="text"
                      value={customAvatarName}
                      onChange={(e) => setCustomAvatarName(e.target.value)}
                      placeholder="Name your avatar"
                      maxLength={100}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: "6px",
                        border: "1px solid #c0cbe0",
                        fontSize: "0.85rem",
                        color: "#2d3a5a",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* Save Avatar Button */}
                  <div style={{ marginTop: "10px", textAlign: "center" }}>
                    <button
                      onClick={handleSaveAvatar}
                      disabled={isSaving || authStatus !== 'authenticated'}
                      style={{
                        backgroundColor: authStatus === 'authenticated' ? "#3B4F8E" : "#ccc",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "10px 20px",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        cursor: authStatus === 'authenticated' ? (isSaving ? "not-allowed" : "pointer") : "not-allowed",
                        opacity: isSaving ? 0.7 : 1,
                        width: "100%",
                      }}
                    >
                      {isSaving ? "Saving..." : "Save Avatar"}
                    </button>

                    {/* Feedback Messages */}
                    {saveMessage && (
                      <div
                        style={{
                          marginTop: "12px",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          fontSize: "0.85rem",
                          backgroundColor: saveMessage.type === 'success' ? "#d4edda" : "#f8d7da",
                          color: saveMessage.type === 'success' ? "#155724" : "#721c24",
                          border: `1px solid ${saveMessage.type === 'success' ? "#c3e6cb" : "#f5c6cb"}`,
                        }}
                      >
                        {saveMessage.text}
                      </div>
                    )}

                    {authStatus !== 'authenticated' && (
                      <p
                        style={{
                          marginTop: "8px",
                          fontSize: "0.8rem",
                          color: "#6B7FA8",
                          textAlign: "center",
                        }}
                      >
                        Log in to save your avatar choices
                      </p>
                    )}
                  </div>
                </>
              ) : null}
            </div>

            <div className={styles.customizationCard}>
              <div className={styles.tabs}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`${styles.mainTabButton} ${
                      currentTab === tab.id ? styles.activeMainTab : ""
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {renderTabContent()}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default AvatarCreation;
