"use client";

import React, { useEffect, useMemo, useState } from "react";
import DashboardNavBar from "@/components/DashboardNavBar";
import Footer from "@/components/Footer"; // ✅ Import Footer component
import styles from "./avatar.module.css";
// import Face from "./face";
// import Hair from "./hair";
import Clothing from "./clothing";
// import Accessories from "./accessories";
import Voice from "./voice";
import StudioAvatar, { type PresenterGender } from "./studioAvatar";
import AvatarChat from "./AvatarChat";
import { useAuth } from "@/hooks/useAuth";
import { avatarService, type HeyGenAvatarData, type SavedAvatar } from "@/services/avatarService";

type HeygenAvatar = {
  id: string;
  name: string;
  gender?: string | null;
  preview_image_url: string;
  default_voice_id: string | null;
  kind: "avatar" | "talking_photo";
};

function getPersonKey(a: Pick<HeygenAvatar, "id" | "name">): string {
  // Prefer the name prefix before " in " (e.g. "Aditya in Blue shirt" => "Aditya")
  const name = (a.name ?? "").trim();
  const inIdx = name.toLowerCase().indexOf(" in ");
  if (inIdx > 0) return name.slice(0, inIdx).trim();

  // Fallback: avatar_id prefix before first underscore (e.g. "Aditya_public_1" => "Aditya")
  const id = (a.id ?? "").trim();
  const usIdx = id.indexOf("_");
  if (usIdx > 0) return id.slice(0, usIdx).trim();

  return name || id;
}

function avatarMatchesPresenterGender(
  avatar: Pick<HeygenAvatar, "gender">,
  filter: PresenterGender,
): boolean {
  const g = (avatar.gender ?? "").toLowerCase().trim();
  if (!g) return true;
  if (g === "male" || g === "man" || g === "m") return filter === "male";
  if (g === "female" || g === "woman" || g === "f") return filter === "female";
  return true;
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

  // Saved avatars state
  const [savedAvatars, setSavedAvatars] = useState<SavedAvatar[]>([]);
  const [loadingSavedAvatars, setLoadingSavedAvatars] = useState(false);

  // Auth hook
  const { authStatus, authFetch } = useAuth();

  const tabs = [
    { id: "Avatar", label: "Avatar" },
    { id: "Clothing", label: "Clothing" },
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
      } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        setHeygenError(message);
      } finally {
        setHeygenLoading(false);
      }
    }

    loadHeygenLists();
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

  const selectedPersonVariants = useMemo(() => {
    if (!selectedPersonKey) return [];
    return filteredAvatars.filter((a) => getPersonKey(a) === selectedPersonKey);
  }, [filteredAvatars, selectedPersonKey]);

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
        default_voice_id: selectedAvatar.default_voice_id,
        type: selectedAvatar.kind,
      };

      await avatarService.saveUserAvatar(heygenData, authFetch);

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

      case "Clothing":
        return (
          <Clothing
            personKey={selectedPersonKey}
            selectedAvatarId={selectedAvatarId}
            variants={selectedPersonVariants}
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

              {authStatus !== 'authenticated' ? (
                <p style={{ color: "#6B7FA8", textAlign: "center", padding: "20px" }}>
                  Please log in to view your saved avatars.
                </p>
              ) : loadingSavedAvatars ? (
                <p style={{ color: "#6B7FA8", textAlign: "center", padding: "20px" }}>
                  Loading your saved avatars...
                </p>
              ) : savedAvatars.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <p style={{ color: "#6B7FA8", marginBottom: "12px" }}>
                    You haven&apos;t saved any avatars yet.
                  </p>
                  <p style={{ color: "#6B7FA8", fontSize: "0.9rem" }}>
                    Go to the <strong>Avatar</strong> tab to select and save your first avatar!
                  </p>
                </div>
              ) : (
                <div className={styles.imageOptions}>
                  {savedAvatars.map((savedAvatar) => (
                    <button
                      key={savedAvatar.avatar_id}
                      type="button"
                      onClick={() => {
                        if (savedAvatar.heygen_data) {
                          // Set the selected avatar based on saved data
                          setSelectedAvatarId(savedAvatar.heygen_data.avatar_id);
                          if (savedAvatar.heygen_data.default_voice_id) {
                            setSelectedVoiceId(savedAvatar.heygen_data.default_voice_id);
                          }
                        }
                      }}
                      className={`${styles.imageOption} ${
                        selectedAvatarId === savedAvatar.heygen_data?.avatar_id ? styles.selected : ""
                      }`}
                      title={`${savedAvatar.name || 'Saved Avatar'} (Saved)`}
                    >
                      {savedAvatar.heygen_data?.preview_image_url ? (
                        <img
                          src={savedAvatar.heygen_data.preview_image_url}
                          alt={savedAvatar.name || 'Saved avatar'}
                          className={styles.optionImage}
                        />
                      ) : (
                        <div className={styles.optionImage} style={{
                          backgroundColor: "#f0f0f0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <span style={{ color: "#999", fontSize: "0.8rem" }}>No Image</span>
                        </div>
                      )}
                      <span className={styles.optionLabel}>
                        {savedAvatar.name || savedAvatar.heygen_data?.avatar_name || 'Saved Avatar'}
                      </span>
                      <span className={styles.optionKindBadge} style={{ backgroundColor: "#28a745" }}>
                        Saved
                      </span>
                    </button>
                  ))}
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
                    {selectedAvatar.kind === "talking_photo" ? " · Photo avatar" : ""}
                  </p>

                  {/* Save Avatar Button */}
                  <div style={{ marginTop: "16px", textAlign: "center" }}>
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

      <AvatarChat />
      <Footer />
    </>
  );
};

export default AvatarCreation;
