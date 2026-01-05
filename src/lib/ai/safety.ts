// List of keywords that trigger an immediate red-flag warning
const RED_FLAG_KEYWORDS = [
  "suicide",
  "kill myself",
  "chest pain",
  "heart attack",
  "stroke",
  "difficulty breathing",
  "severe bleeding",
  "unconscious",
  "poison",
  "overdose",
  "seizure",
  "anaphylaxis",
  "broken bone",
  "head injury",
  "vision loss",
  "paralysis",
];

export interface SafetyCheckResult {
  isSafe: boolean;
  warningType?: "EMERGENCY" | "SENSITIVE";
  message?: string;
  action?: string;
}

export function checkSafety(query: string): SafetyCheckResult {
  const lowerQuery = query.toLowerCase();

  // Check for emergency keywords
  const foundKeyword = RED_FLAG_KEYWORDS.find((keyword) =>
    lowerQuery.includes(keyword)
  );

  if (foundKeyword) {
    return {
      isSafe: false,
      warningType: "EMERGENCY",
      message: `Your query contains keywords related to a potential medical emergency: "${foundKeyword}".`,
      action: "Please call emergency services immediately or visit the nearest hospital.",
    };
  }

  // Default safe
  return { isSafe: true };
}
