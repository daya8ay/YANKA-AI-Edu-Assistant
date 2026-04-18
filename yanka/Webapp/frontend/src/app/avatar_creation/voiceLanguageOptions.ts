/**
 * Used by avatar Voice tab languages.
 */
export const VIDEO_VOICE_LANGUAGE_OPTIONS = [
  { value: "arabic", label: "Arabic" },
  // { value: "bangla", label: "Bangla" },
  { value: "bulgarian", label: "Bulgarian" },
  // { value: "catalan", label: "Catalan" },
  { value: "chinese", label: "Chinese" },
  { value: "croatian", label: "Croatian" },
  { value: "czech", label: "Czech" },
  { value: "danish", label: "Danish" },
  { value: "dutch", label: "Dutch" },
  { value: "english", label: "English" },
  // { value: "estonian", label: "Estonian" },
  { value: "filipino", label: "Filipino" },
  // { value: "finnish", label: "Finnish" },
  { value: "french", label: "French" },
  // { value: "georgian", label: "Georgian" },
  { value: "german", label: "German" },
  { value: "greek", label: "Greek" },
  // { value: "gujarati", label: "Gujarati" },
  // { value: "hebrew", label: "Hebrew" },
  { value: "hindi", label: "Hindi" },
  { value: "hungarian", label: "Hungarian" },
  { value: "indonesian", label: "Indonesian" },
  { value: "italian", label: "Italian" },
  { value: "japanese", label: "Japanese" },
  // { value: "kannada", label: "Kannada" },
  // { value: "korean", label: "Korean" },
  // { value: "latvian", label: "Latvian" },
  // { value: "lithuanian", label: "Lithuanian" },
  // { value: "malay", label: "Malay" },
  // { value: "marathi", label: "Marathi" },
  // { value: "multilingual", label: "Multilingual" },
  // { value: "nepali", label: "Nepali" },
  // { value: "norwegian", label: "Norwegian" },
  { value: "persian", label: "Persian" },
  { value: "polish", label: "Polish" },
  { value: "portuguese", label: "Portuguese" },
  // { value: "romanian", label: "Romanian" },
  { value: "russian", label: "Russian" },
  // { value: "sinhala", label: "Sinhala" },
  { value: "slovak", label: "Slovak" },
  { value: "spanish", label: "Spanish" },
  // { value: "swahili", label: "Swahili" },
  // { value: "swedish", label: "Swedish" },
  // { value: "tamil", label: "Tamil" },
  { value: "telugu", label: "Telugu" },
  // { value: "thai", label: "Thai" },
  { value: "turkish", label: "Turkish" },
  { value: "ukrainian", label: "Ukrainian" },
  // { value: "urdu", label: "Urdu" },
  { value: "vietnamese", label: "Vietnamese" },
] as const;

export type VideoVoiceLanguage = (typeof VIDEO_VOICE_LANGUAGE_OPTIONS)[number]["value"];

const VIDEO_KEYS = new Set<string>(VIDEO_VOICE_LANGUAGE_OPTIONS.map((o) => o.value));

/**
 * Exact HeyGen `language` strings (lowercased, trimmed) → our `value` key.
 */
const HEYGEN_LANGUAGE_TO_KEY: Record<string, VideoVoiceLanguage> = {
  arabic: "arabic",
  ar: "arabic",
  // bangla: "bangla",
  bulgarian: "bulgarian",
  // catalan: "catalan",
  chinese: "chinese",
  croatian: "croatian",
  czech: "czech",
  danish: "danish",
  dutch: "dutch",
  english: "english",
  en: "english",
  // estonian: "estonian",
  filipino: "filipino",
  // finnish: "finnish",
  french: "french",
  fr: "french",
  // georgian: "georgian",
  german: "german",
  greek: "greek",
  // gujarati: "gujarati",
  // hebrew: "hebrew",
  hindi: "hindi",
  hungarian: "hungarian",
  indonesian: "indonesian",
  italian: "italian",
  japanese: "japanese",
  // kannada: "kannada",
  // kiswahili: "swahili",
  // swahili: "swahili",
  // korean: "korean",
  // latvian: "latvian",
  // lithuanian: "lithuanian",
  // malay: "malay",
  // marathi: "marathi",
  // multilingual: "multilingual",
  // nepali: "nepali",
  // norwegian: "norwegian",
  persian: "persian",
  polish: "polish",
  portuguese: "portuguese",
  pt: "portuguese",
  // romanian: "romanian",
  russian: "russian",
  // sinhala: "sinhala",
  slovak: "slovak",
  spanish: "spanish",
  es: "spanish",
  // swedish: "swedish",
  // tamil: "tamil",
  telugu: "telugu",
  // thai: "thai",
  turkish: "turkish",
  turkey: "turkish",
  ukrainian: "ukrainian",
  // urdu: "urdu",
  vietnamese: "vietnamese",
  tagalog: "filipino",
  zh: "chinese",
  "zh-cn": "chinese",
};

/**
 * Map HeyGen `voice.language` strings to a `VIDEO_VOICE_LANGUAGE_OPTIONS` value.
 * Returns null for empty / unknown / unlisted (e.g. future HeyGen labels).
 */
export function normalizeVoiceLanguageToVideoKey(
  raw: string | null | undefined,
): VideoVoiceLanguage | null {
  if (raw == null) return null;
  const t = String(raw).trim().replace(/\s+/g, " ");
  if (t === "") return null;
  const lower = t.toLowerCase();
  if (lower === "unknown") return null;

  const direct = HEYGEN_LANGUAGE_TO_KEY[lower];
  if (direct) return direct;

  // HeyGen sometimes uses "Mandarin …" or mixed Chinese labels
  if (lower.includes("mandarin")) return "chinese";

  if (lower.startsWith("filipino")) return "filipino";

  return null;
}

export function isVideoVoiceLanguage(value: string): value is VideoVoiceLanguage {
  return VIDEO_KEYS.has(value);
}
