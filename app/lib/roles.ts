export type Role = "REQUESTER" | "APPROVAL" | "AUDITOR";

const synonyms: Record<string, Role> = {
  requester: "REQUESTER",
  requestor: "REQUESTER",
  approval: "APPROVAL",
  approver: "APPROVAL",
  approve: "APPROVAL",
  auditor: "AUDITOR",
  audit: "AUDITOR",
};

export function parseRole(input: string | null | undefined): Role {
  const key = String(input || "REQUESTER").trim().toLowerCase();
  return synonyms[key] || (key === "requester" ? "REQUESTER" : key === "auditor" ? "AUDITOR" : "APPROVAL");
}
