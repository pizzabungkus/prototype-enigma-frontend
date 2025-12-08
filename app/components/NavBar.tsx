"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { TerraLogo, DanantaraLogo } from "./Logo";

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
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <TerraLogo />
          <div className="hidden lg:block w-px h-8 bg-neutral-300" />
          <span className="hidden lg:block text-sm font-medium text-neutral-700">Digital Reimbursement System</span>
        </div>
        
        <ul className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8 text-sm font-medium text-bni-blue">
          {tabs.map((t) => (
            <li key={t.key}><Link href={t.href} className="hover:text-bni-orange transition-colors">{t.label}</Link></li>
          ))}
        </ul>

        <div className="flex items-center gap-6">
          <DanantaraLogo height={42} className="hidden sm:block opacity-80 transition-all" />
          <div className="flex items-center gap-3 pl-6 border-l border-neutral-200">
            <span className="text-sm text-neutral-700 font-medium">{auth?.username || "Guest"}</span>
            <button aria-label="Logout" onClick={logout} className="h-9 w-9 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 text-neutral-500 hover:text-red-600 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10 17l-5-5 5-5" />
                <path d="M15 12H5" />
                <path d="M19 21V3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
