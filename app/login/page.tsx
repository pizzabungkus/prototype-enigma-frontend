"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { parseRole, isValidRole } from "../lib/roles";
import { useRouter } from "next/navigation";
import { TerraLogo, DanantaraLogo } from "../components/Logo";
import { useState } from "react";

export default function LoginPage() {
  const { setAuth } = useAuth();
  const { users } = useData();
  const router = useRouter();
  const [error, setError] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const username = String(fd.get("username") || "").trim();
    const password = String(fd.get("password") || "").trim();

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      // Strict role validation
      const roleStr = user.role.trim();
      
      console.log("LOGIN USER:", user.username, roleStr);

      if (!isValidRole(roleStr)) {
        setError(`Invalid role configured for user: ${roleStr}. Must be REQUESTER, APPROVAL, or AUDITOR.`);
        return;
      }

      setAuth({ username: user.username, role: roleStr });
      
      // Redirect based on role
      if (roleStr === "REQUESTER") {
        router.replace("/request");
      } else {
        router.replace("/approval");
      }
    } else {
      setError("Invalid credentials. Please check your username and password.");
    }
  };
  return (
    <div className="min-h-screen bg-background text-bni-blue">
      <header className="flex items-center justify-between px-8 py-6 border-b border-neutral-200">
        <div className="flex items-center gap-4">
          <TerraLogo size="large" />
          <div className="hidden md:block w-px h-10 bg-neutral-300" />
          <span className="hidden md:block text-lg font-medium text-neutral-700">Digital Reimbursement System</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-neutral-500 hidden sm:block">Powered by</span>
          <DanantaraLogo height={32} />
        </div>
      </header>

      <main className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-lg bg-surface shadow-[var(--shadow-card)] border border-border p-8">
          <h1 className="text-2xl font-semibold tracking-tight mb-6">Sign In</h1>
          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm mb-2">Username</label>
              <input
                type="text"
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-bni-blue focus:outline-none focus:ring-2 focus:ring-bni-orange"
                placeholder="e.g. Alice, Bob, Charlie"
                name="username"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Password</label>
              <input
                type="password"
                name="password"
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-bni-blue focus:outline-none focus:ring-2 focus:ring-bni-orange"
                placeholder="Enter password"
              />
            </div>
            {/* Role is now determined by the user data */}
            <div className="text-xs text-neutral-500">
              Try: Alice (REQUESTER), Bob (APPROVAL), Charlie (AUDITOR) - Pass: 123456
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-neutral-200 text-bni-blue px-4 py-3 font-medium hover:bg-neutral-300"
            >
              Login
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/dashboard" className="text-sm text-bni-orange">
              Continue to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
