"use client";
import NavBar from "../components/NavBar";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function RequestTabPage() {
  const { auth } = useAuth();
  const router = useRouter();
  if (auth && auth.role !== "Requester") {
    router.replace("/approval");
    return null;
  }
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-bni-blue">Request</h1>
        <p className="mt-2 text-neutral-700">Choose a provider to start a reimbursement request.</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link href="/reimbursement?provider=bluebird" className="group rounded-[var(--radius-lg)] bg-surface border border-border shadow-[var(--shadow-card)] p-6 flex items-center gap-4 hover:shadow-lg transition">
            <div className="h-12 w-12 rounded-lg border border-neutral-300 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-bni-blue">
                <path d="M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L5.5 20l2-7L2 9h7z"/>
              </svg>
            </div>
            <div>
              <div className="text-lg font-semibold text-bni-blue">Blue Bird Group</div>
              <div className="text-sm text-neutral-600">Corporate taxi provider</div>
            </div>
          </Link>
          <Link href="/reimbursement?provider=grab" className="group rounded-[var(--radius-lg)] bg-surface border border-border shadow-[var(--shadow-card)] p-6 flex items-center gap-4 hover:shadow-lg transition">
            <div className="h-12 w-12 rounded-lg border border-neutral-300 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-bni-green">
                <path d="M4 12c2-4 6-4 8 0s6 4 8 0"/>
              </svg>
            </div>
            <div>
              <div className="text-lg font-semibold text-bni-blue">Grab</div>
              <div className="text-sm text-neutral-600">Ride-hailing provider</div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
