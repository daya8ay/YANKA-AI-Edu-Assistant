"use client";

import React, { useMemo } from "react";
import styles from "./avatar.module.css";

type Variant = {
  id: string;
  name: string;
  preview_image_url: string;
  kind: "avatar" | "talking_photo" | "avatar_group";
};

/** e.g. "Aditya in Blue shirt" → "Blue shirt" */
function outfitLabelFromName(name: string): string | null {
  const m = name.match(/\bin\s+([A-Za-z]+)\s+(.+)$/i);
  if (!m) return null;
  const colorRaw = m[1].trim();
  const garmentRaw = m[2].trim();
  if (!garmentRaw) return null;
  const color = colorRaw.charAt(0).toUpperCase() + colorRaw.slice(1).toLowerCase();
  const garment = garmentRaw.toLowerCase();
  return `${color} ${garment}`;
}

/**
 * Labels for studio looks that are not "in Color garment" outfits — e.g. office front/side,
 * upper body, etc. Strips the presenter prefix when the name starts with it.
 */
function poseOrLookLabel(personKey: string, name: string): string {
  const pk = (personKey || "").trim();
  const raw = (name || "").trim();
  if (!raw) return "Look";

  const lower = raw.toLowerCase();
  const pkLower = pk.toLowerCase();
  if (pk && lower.startsWith(pkLower)) {
    let rest = raw.slice(pk.length).trim();
    rest = rest.replace(/^[-–—:]\s*/u, "").trim();
    if (rest) return rest;
  }
  return raw;
}

function poseHint(a: Pick<Variant, "id" | "name">): string {
  const blob = `${a.id} ${a.name}`.toLowerCase();
  for (const key of ["front", "side", "left", "right"]) {
    if (blob.includes(` ${key}`) || blob.includes(`_${key}`) || blob.includes(`(${key})`)) return key;
  }
  if (blob.includes("upper body") || blob.includes("upper_body")) return "upper_body";
  if (blob.includes("half body") || blob.includes("half_body")) return "half_body";
  return "";
}

function pickVariantForPose(candidates: Variant[], currentPose: string): Variant | null {
  if (candidates.length === 0) return null;
  if (!currentPose) return candidates[0]!;
  const poseMatch = candidates.find((c) => poseHint(c) === currentPose);
  return poseMatch ?? candidates[0]!;
}

const Clothing: React.FC<{
  personKey: string | null;
  selectedAvatarId: string | null;
  variants: Variant[];
  onSelectAvatarId: (id: string | null) => void;
}> = ({ personKey, selectedAvatarId, variants, onSelectAvatarId }) => {
  const current = variants.find((v) => v.id === selectedAvatarId) ?? null;
  const currentPose = current ? poseHint(current) : "";
  const currentLabel = current ? outfitLabelFromName(current.name) : null;

  const rowsWithOutfit = useMemo(() => {
    return variants
      .map((v) => {
        const label = outfitLabelFromName(v.name);
        return label ? { v, label } : null;
      })
      .filter(Boolean) as { v: Variant; label: string }[];
  }, [variants]);

  const poseLookVariants = useMemo(() => {
    if (!personKey) return [];
    return variants
      .filter((v) => outfitLabelFromName(v.name) == null)
      .map((v) => ({
        v,
        label: poseOrLookLabel(personKey, v.name),
      }))
      .sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
      );
  }, [variants, personKey]);

  const labels = useMemo(() => {
    const set = new Set<string>();
    for (const row of rowsWithOutfit) set.add(row.label);
    return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  }, [rowsWithOutfit]);

  const byLabel = useMemo(() => {
    const m = new Map<string, Variant[]>();
    for (const { v, label } of rowsWithOutfit) {
      const arr = m.get(label);
      if (arr) arr.push(v);
      else m.set(label, [v]);
    }
    return m;
  }, [rowsWithOutfit]);

  const hasAnyOptions = labels.length > 0 || poseLookVariants.length > 0;

  return (
    <div className={styles.tabContent}>
      <div className={styles.section}>
        <h4>Looks</h4>
        {!personKey ? (
          <p style={{ color: "#6B7FA8" }}>
            Select an avatar in the <strong>Avatar</strong> tab first.
          </p>
        ) : (
          <p style={{ color: "#6B7FA8" }}>
            Looks for <strong>{personKey}</strong>
          </p>
        )}
      </div>

      {personKey && !hasAnyOptions ? (
        <div className={styles.section}>
          <p style={{ color: "#6B7FA8" }}>No look options found for this presenter.</p>
        </div>
      ) : null}

      {personKey && hasAnyOptions ? (
        <div className={styles.section}>
          <div className={styles.styleOptions}>
            {labels.map((label) => {
              const chosen = pickVariantForPose(byLabel.get(label) ?? [], currentPose);
              const isActive = currentLabel === label;
              return (
                <button
                  key={`outfit-${label}`}
                  type="button"
                  onClick={() => chosen && onSelectAvatarId(chosen.id)}
                  disabled={!chosen}
                  className={`${styles.styleOption} ${isActive ? styles.selected : ""}`}
                >
                  {label}
                </button>
              );
            })}
            {poseLookVariants.map(({ v, label }) => {
              const isActive = selectedAvatarId === v.id;
              return (
                <button
                  key={`pose-${v.id}`}
                  type="button"
                  onClick={() => onSelectAvatarId(v.id)}
                  className={`${styles.styleOption} ${isActive ? styles.selected : ""}`}
                  title={v.name}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Clothing;
