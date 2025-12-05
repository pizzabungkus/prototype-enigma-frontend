export type Role = "Requester" | "Approval" | "Auditor";

const synonyms: Record<string, Role> = {
  requester: "Requester",
  requestor: "Requester",
  approval: "Approval",
  approver: "Approval",
  approve: "Approval",
  auditor: "Auditor",
  audit: "Auditor",
};

export function parseRole(input: string | null | undefined): Role {
  const key = String(input || "Requester").trim().toLowerCase();
  return synonyms[key] || (key === "requester" ? "Requester" : key === "auditor" ? "Auditor" : "Approval");
}

