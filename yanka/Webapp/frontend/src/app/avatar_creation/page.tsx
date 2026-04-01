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

  const tabs = [
    { id: "Avatar", label: "Avatar" },
    // { id: "Face", label: "Face" },
    // { id: "Hair", label: "Hair" },
    { id: "Clothing", label: "Clothing" },
    // { id: "Accessories", label: "Accessories" },
    { id: "Voice", label: "Voice" },
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
