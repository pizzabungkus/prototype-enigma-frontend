"use client";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import { useMemo, useState } from "react";

type Row = {
  id: string;
  date: string;
  bookingCode: string;
  provider: "Grab" | "Blue Bird";
  description: string;
  amount: number;
  status: "Waiting Approval" | "Approved" | "Returned" | "Rejected";
  requester: string;
  assignedTo?: string;
};

const DATA: Row[] = [
  { id: "1", date: "2025-12-04", bookingCode: "RB-111", provider: "Grab", description: "Client visit", amount: 121000, status: "Waiting Approval", requester: "Alice", assignedTo: "Manager" },
  { id: "2", date: "2025-12-03", bookingCode: "BB-222", provider: "Blue Bird", description: "Branch audit", amount: 98000, status: "Approved", requester: "Alice", assignedTo: "Manager" },
  { id: "3", date: "2025-12-02", bookingCode: "RB-333", provider: "Grab", description: "Workshop", amount: 54000, status: "Returned", requester: "Bob", assignedTo: "Auditor" },
  { id: "4", date: "2025-12-01", bookingCode: "BB-444", provider: "Blue Bird", description: "Training", amount: 76000, status: "Waiting Approval", requester: "Carol", assignedTo: "Manager" },
];

export default function HistoryPage() {
  const { auth } = useAuth();
  const [provider, setProvider] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const rows = useMemo(() => {
    let r = DATA;
    if (auth?.role === "Requester") r = r.filter((x) => x.requester === (auth.username || ""));
    if (auth?.role === "Approval") r = r.filter((x) => x.assignedTo === (auth.username || "Manager") || x.status !== "Waiting Approval");
    if (auth?.role === "Auditor") r = r;
    if (provider) r = r.filter((x) => x.provider === provider);
    if (status) r = r.filter((x) => x.status === status);
    if (from) r = r.filter((x) => x.date >= from);
    if (to) r = r.filter((x) => x.date <= to);
    return r;
  }, [auth, provider, status, from, to]);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-bni-blue">History</h1>
        <div className="mt-6 rounded-[var(--radius-lg)] bg-surface border border-border shadow-[var(--shadow-card)] p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="date"
                value={from}
                onChange={(e)=>setFrom(e.target.value)}
                className={`${from ? "text-[#111827]" : "text-[#9CA3AF]"} w-full rounded-full border border-[#E5E7EB] bg-white px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-bni-blue placeholder:text-[#9CA3AF]`}
                placeholder="mm/dd/yyyy"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#4B5563]">📅</span>
            </div>
            <div className="relative">
              <input
                type="date"
                value={to}
                onChange={(e)=>setTo(e.target.value)}
                className={`${to ? "text-[#111827]" : "text-[#9CA3AF]"} w-full rounded-full border border-[#E5E7EB] bg-white px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-bni-blue placeholder:text-[#9CA3AF]`}
                placeholder="mm/dd/yyyy"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#4B5563]">📅</span>
            </div>
            <div className="relative">
              <select
                value={provider}
                onChange={(e)=>setProvider(e.target.value)}
                className={`${provider ? "text-[#111827]" : "text-[#9CA3AF]"} appearance-none w-full rounded-full border border-[#E5E7EB] bg-white px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-bni-blue`}
              >
                <option value="">All</option>
                <option value="Grab">Grab</option>
                <option value="Blue Bird">Blue Bird</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#4B5563]">▾</span>
            </div>
            <div className="relative">
              <select
                value={status}
                onChange={(e)=>setStatus(e.target.value)}
                className={`${status ? "text-[#111827]" : "text-[#9CA3AF]"} appearance-none w-full rounded-full border border-[#E5E7EB] bg-white px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-bni-blue`}
              >
                <option value="">All</option>
                <option value="Waiting Approval">Waiting Approval</option>
                <option value="Approved">Approved</option>
                <option value="Returned">Returned</option>
                <option value="Rejected">Rejected</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#4B5563]">▾</span>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left">
                <tr className="text-[#111827]">
                  <th className="py-3">Date</th>
                  <th className="py-3">Booking Code</th>
                  <th className="py-3">Provider</th>
                  <th className="py-3">Description</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[#111827]">
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-neutral-200">
                    <td className="py-3 px-2">{r.date}</td>
                    <td className="py-3 px-2">{r.bookingCode}</td>
                    <td className="py-3 px-2">{r.provider}</td>
                    <td className="py-3 px-2 text-[#1F2937]">{r.description}</td>
                    <td className="py-3 px-2">Rp{r.amount.toLocaleString()}</td>
                    <td className="py-3 px-2">
                      <span className={
                        r.status === "Approved" ? "rounded px-2 py-1 bg-bni-green/10 text-bni-green" :
                        r.status === "Returned" ? "rounded px-2 py-1 bg-bni-orange/10 text-bni-orange" :
                        "rounded px-2 py-1 bg-neutral-200 text-[#374151]"
                      }>{r.status}</span>
                    </td>
                    <td className="py-3 px-2">
                      <button className="rounded-lg border border-bni-blue/30 text-bni-blue bg-white px-3 py-1 hover:bg-bni-blue/5">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
