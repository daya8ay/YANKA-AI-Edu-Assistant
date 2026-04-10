"use client";

import React, { useMemo } from "react";
import styles from "./avatar.module.css";

type Variant = {
  id: string;
  name: string;
  preview_image_url: string;
  kind: "avatar" | "talking_photo";
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

  return (
    <div className={styles.tabContent}>
      <div className={styles.section}>
        <h4>Outfit</h4>
        {!personKey ? (
          <p style={{ color: "#6B7FA8" }}>
            Select an avatar in the <strong>Avatar</strong> tab first.
          </p>
        ) : (
          <p style={{ color: "#6B7FA8" }}>
            Outfit options for <strong>{personKey}</strong>. Tap an option to switch the clothing.
          </p>
        )}
      </div>

      {personKey && labels.length === 0 ? (
        <div className={styles.section}>
          <p style={{ color: "#6B7FA8" }}>
            No outfit options found for this presenter.
          </p>
        </div>
      ) : null}

      {labels.length > 0 ? (
        <div className={styles.section}>
          <h4>Looks</h4>
          <div className={styles.styleOptions}>
            {labels.map((label) => {
              const chosen = pickVariantForPose(byLabel.get(label) ?? [], currentPose);
              const isActive = currentLabel === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => chosen && onSelectAvatarId(chosen.id)}
                  disabled={!chosen}
                  className={`${styles.styleOption} ${isActive ? styles.selected : ""}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {currentPose ? (
            <p style={{ marginTop: "12px", color: "#6B7FA8", fontSize: "0.9rem" }}>
              Pose preserved when possible: <strong>{currentPose}</strong>
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default Clothing;
