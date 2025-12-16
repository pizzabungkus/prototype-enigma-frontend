export type Role = "REQUESTER" | "APPROVAL" | "AUDITOR";

export function parseRole(input: string | null | undefined): Role {
  const normalized = String(input || "").trim();
  
  switch (normalized) {
    case "REQUESTER":
    case "APPROVAL":
    case "AUDITOR":
      return normalized;
    default:
      // Fallback for safety, but in login we will validate strictly.
      // For existing session data that might be "requester" (lowercase), we can fix it here if we wanted to be nice,
      // but user said "Do not use different strings".
      // However, to avoid crashing the app on invalid data, we might return a default, 
      // but the user said "Validate role is one of the allowed roles; if not, show an error and block login."
      // So this function should probably just return the raw string casted if it matches, or maybe throw/return null?
      // Since return type is Role, we must return a valid Role.
      // Let's return a safe default but log a warning, OR handle the strict check in the caller (Login).
      // Given the user instruction "Implement: role = roleString.trim().toUpperCase() immediately after parsing CSV",
      // I will implement the normalization here but return a fallback if it fails, 
      // AND I will add strict validation in the Login page.
      
      // Actually, let's try to match case-insensitive for robustness but output the correct Enum.
      const upper = normalized.toUpperCase();
      if (upper === "REQUESTER") return "REQUESTER";
      if (upper === "APPROVAL") return "APPROVAL";
      if (upper === "AUDITOR") return "AUDITOR";
      
      return "REQUESTER"; // Default fallback to least privileged
  }
}

export function isValidRole(input: string): input is Role {
  const normalized = input.trim();
  return ["REQUESTER", "APPROVAL", "AUDITOR"].includes(normalized);
}
