"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { parseRole } from "../lib/roles";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { setAuth } = useAuth();
  const router = useRouter();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const username = String(fd.get("username") || "").trim() || "User";
    const role = parseRole(String(fd.get("role") || "Requester"));
    setAuth({ username, role });
    router.replace("/request");
  };
  return (
    <div className="min-h-screen bg-background text-bni-blue">
      <header className="flex items-center justify-between px-8 py-6 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <span className="sr-only">BNI</span>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-bni-orange" />
            <span className="text-xl font-semibold">BNI</span>
            <span>Digital Reimburmsement</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Danantara Indonesia</span>
          <div className="h-6 w-6 rounded-md bg-neutral-300" />
        </div>
      </header>

      <main className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-lg bg-surface shadow-[var(--shadow-card)] border border-border p-8">
          <h1 className="text-2xl font-semibold tracking-tight mb-6">Sign In</h1>
          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm mb-2">Username</label>
              <input
                type="text"
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-bni-blue focus:outline-none focus:ring-2 focus:ring-bni-orange"
                placeholder="Enter username"
                name="username"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Password</label>
              <input
                type="password"
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-bni-blue focus:outline-none focus:ring-2 focus:ring-bni-orange"
                placeholder="Enter password"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Role</label>
              <select name="role" className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bni-orange">
                <option>Requester</option>
                <option>Approval</option>
                <option>Auditor</option>
              </select>
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
