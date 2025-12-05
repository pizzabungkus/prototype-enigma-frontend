"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { auth, logout } = useAuth();
  const role = auth?.role;

  const tabs = [
    { key: "request", label: "Request", href: "/request" },
    { key: "history", label: "History", href: "/history" },
    { key: "approval", label: "Approval", href: "/approval" },
  ].filter((t) => {
    if (role === "Requester") return t.key === "request" || t.key === "history";
    if (role === "Approval") return t.key === "approval" || t.key === "history";
    if (role === "Auditor") return t.key === "approval" || t.key === "history";
    return t.key === "history";
  });

  return (
    <nav className="sticky top-0 z-10 bg-surface/90 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-4 grid grid-cols-3 items-center">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded bg-bni-orange" />
          <div className="flex flex-col">
            <span className="font-semibold text-bni-blue">BNI</span>
            <span className="text-xs text-neutral-600">BNI Digital Reimbursement System</span>
          </div>
        </div>
        <ul className="justify-center hidden md:flex items-center gap-8 text-sm font-medium text-bni-blue">
          {tabs.map((t) => (
            <li key={t.key}><Link href={t.href} className="hover:text-bni-orange">{t.label}</Link></li>
          ))}
        </ul>
        <div className="flex items-center justify-end gap-3">
          <span className="text-sm text-neutral-700">Welcome{auth?.username ? `, ${auth.username}` : ""}</span>
          <button aria-label="Logout" onClick={logout} className="h-8 w-8 rounded-md border border-neutral-300 flex items-center justify-center hover:bg-neutral-100">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 17l-5-5 5-5" />
              <path d="M15 12H5" />
              <path d="M19 21V3" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
