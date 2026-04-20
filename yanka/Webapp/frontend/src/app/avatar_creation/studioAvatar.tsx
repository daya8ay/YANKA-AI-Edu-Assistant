"use client";

import React, { useEffect, useMemo, useState, type CSSProperties } from "react";
import styles from "./avatar.module.css";

const AVATARS_PER_PAGE = 12;

export type PresenterGender = "male" | "female";

export type HeygenAvatarRow = {
  id: string;
  name: string;
  gender?: string | null;
  preview_image_url: string;
  default_voice_id: string | null;
  kind: "avatar" | "talking_photo";
};

function getPersonKey(a: Pick<HeygenAvatarRow, "id" | "name">): string {
  const name = (a.name ?? "").trim();
  const inIdx = name.toLowerCase().indexOf(" in ");
  if (inIdx > 0) return name.slice(0, inIdx).trim();

  const id = (a.id ?? "").trim();
  const usIdx = id.indexOf("_");
  if (usIdx > 0) return id.slice(0, usIdx).trim();

  return name || id;
}

function isLikelyTeacherPose(a: Pick<HeygenAvatarRow, "id" | "name">): boolean {
  const blob = `${a.id ?? ""} ${a.name ?? ""}`.toLowerCase();
  return (
    blob.includes("upper body") ||
    blob.includes("upper_body") ||
    blob.includes("half body") ||
    blob.includes("half_body") ||
    blob.includes("close up") ||
    blob.includes("close_up") ||
    blob.includes("expressive") ||
    blob.includes("office")
  );
}

function pickRepresentative(variants: HeygenAvatarRow[]): HeygenAvatarRow {
  // Prefer teacher-ish framing, then stable ordering by name/id.
  const teacher = variants.find(isLikelyTeacherPose);
  if (teacher) return teacher;
  return (
    [...variants].sort((a, b) => {
      const n = (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" });
      if (n !== 0) return n;
      return (a.id || "").localeCompare(b.id || "", undefined, { sensitivity: "base" });
    })[0] ?? variants[0]
  );
}

const StudioAvatar: React.FC<{
  avatars: HeygenAvatarRow[];
  presenterGender: PresenterGender;
  onPresenterGenderChange: (g: PresenterGender) => void;
  selectedAvatarId: string | null;
  onSelectAvatarId: (id: string) => void;
  loading?: boolean;
  error?: string | null;
}> = ({
  avatars,
  presenterGender,
  onPresenterGenderChange,
  selectedAvatarId,
  onSelectAvatarId,
  loading,
  error,
}) => {
  const [page, setPage] = useState(1);

  const presenterGenderSelectStyle: CSSProperties = {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  };

  const peopleCards = useMemo(() => {
    const groups = new Map<string, HeygenAvatarRow[]>();
    for (const v of avatars) {
      const key = getPersonKey(v);
      const arr = groups.get(key);
      if (arr) arr.push(v);
      else groups.set(key, [v]);
    }

    const cards = Array.from(groups.entries()).map(([personKey, variants]) => {
      const rep = pickRepresentative(variants);
      return { personKey, rep, variantsCount: variants.length };
    });

    cards.sort((a, b) =>
      a.personKey.localeCompare(b.personKey, undefined, { sensitivity: "base" }),
    );
    return cards;
  }, [avatars]);

  const totalPages = Math.max(1, Math.ceil(peopleCards.length / AVATARS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * AVATARS_PER_PAGE;
  const pageEnd = Math.min(pageStart + AVATARS_PER_PAGE, peopleCards.length);
  const pagePeople = peopleCards.slice(pageStart, pageEnd);

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  /** Jump to the page that contains the current selection when the list or selection changes (not when only `page` changes). */
  useEffect(() => {
    if (peopleCards.length === 0) {
      setPage(1);
      return;
    }
    if (selectedAvatarId) {
      const idx = peopleCards.findIndex((c) => c.rep.id === selectedAvatarId);
      if (idx !== -1) {
        setPage(Math.floor(idx / AVATARS_PER_PAGE) + 1);
        return;
      }
    }
    setPage(1);
  }, [peopleCards, selectedAvatarId]);

  return (
    <div className={styles.tabContent}>
      <div className={styles.section}>
        <h4>Avatar</h4>
        <label
          htmlFor="avatar-presenter-gender"
          style={{
            display: "block",
            marginTop: "12px",
            marginBottom: "6px",
            fontSize: "0.95rem",
            color: "#1E4386",
            fontWeight: 600,
          }}
        >
          Presenter gender
        </label>
        <select
          id="avatar-presenter-gender"
          value={presenterGender}
          onChange={(e) => onPresenterGenderChange(e.target.value as PresenterGender)}
          style={presenterGenderSelectStyle}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <p
          style={{
            color: "#6B7FA8",
            fontSize: "0.95rem",
            marginTop: "0",
            marginBottom: "16px",
          }}
        >
          Choose your Avatar. Showing only {" "}
          <strong>{presenterGender === "male" ? "male" : "female"}</strong> presenters.
        </p>

        {loading ? <p style={{ color: "#6B7FA8" }}>Loading avatars...</p> : null}
        {error ? <p style={{ color: "red" }}>{error}</p> : null}

        {!loading && !error && peopleCards.length === 0 ? (
          <p style={{ color: "#6B7FA8" }}>No avatars match this gender.</p>
        ) : null}

        {!loading && !error && peopleCards.length > 0 ? (
          <>
            <div className={styles.imageOptions}>
              {pagePeople.map(({ personKey, rep, variantsCount }) => (
                <button
                  key={personKey}
                  type="button"
                  onClick={() => onSelectAvatarId(rep.id)}
                  className={`${styles.imageOption} ${
                    selectedAvatarId === rep.id ? styles.selected : ""
                  }`}
                  title={`${personKey}${variantsCount > 1 ? ` (${variantsCount} outfits)` : ""}`}
                >
                  <img
                    src={rep.preview_image_url}
                    alt={personKey}
                    className={styles.optionImage}
                  />
                  <span className={styles.optionLabel}>{personKey}</span>
                  {rep.kind === "talking_photo" ? (
                    <span className={styles.optionKindBadge}>Photo</span>
                  ) : null}
                </button>
              ))}
            </div>

            {totalPages > 1 ? (
              <div className={styles.avatarPagination}>
                <button
                  type="button"
                  className={styles.avatarPaginationBtn}
                  disabled={safePage <= 1}
                  onClick={() =>
                    setPage((p) => Math.max(1, Math.min(totalPages, p) - 1))
                  }
                >
                  Previous
                </button>
                <span className={styles.avatarPaginationInfo}>
                  {pageStart + 1}–{pageEnd} of {peopleCards.length} · Page {safePage} /{" "}
                  {totalPages}
                </span>
                <button
                  type="button"
                  className={styles.avatarPaginationBtn}
                  disabled={safePage >= totalPages}
                  onClick={() =>
                    setPage((p) => Math.min(totalPages, Math.max(1, p) + 1))
                  }
                >
                  Next
                </button>
              </div>
            ) : (
              <p
                style={{
                  marginTop: "16px",
                  fontSize: "0.85rem",
                  color: "#6B7FA8",
                  textAlign: "center",
                }}
              >
                Showing all {peopleCards.length} presenter{peopleCards.length === 1 ? "" : "s"}
              </p>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default StudioAvatar;
