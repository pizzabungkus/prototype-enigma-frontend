"use client";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";

type Item = {
  id: string;
  bookingCode: string;
  provider: "Grab" | "Blue Bird";
  description: string;
  requester: string;
  date: string;
  amount: number;
};

const INCOMING: Item[] = [
  { id: "1", bookingCode: "RB-3269889-84786504", provider: "Grab", description: "Kunjungan Digital Innovation", requester: "Alice", date: "2025-12-04", amount: 121000 },
  { id: "2", bookingCode: "BB-9922711-4477", provider: "Blue Bird", description: "Audit cabang", requester: "Bob", date: "2025-12-03", amount: 98000 },
];

export default function ApprovalPage() {
  const { auth } = useAuth();
  const role = auth?.role || "Approval";
  const selected = INCOMING[0];

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-bni-blue">Approval</h1>

        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-[var(--radius-lg)] bg-surface border border-border shadow-[var(--shadow-card)] p-6">
            <div className="text-sm font-medium text-neutral-700 mb-3">Incoming Requests</div>
            <div className="space-y-2">
              {INCOMING.map((item) => (
                <div key={item.id} className={`w-full text-left rounded-lg border px-4 py-3 border-neutral-300`}>
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-bni-blue">{item.bookingCode}</div>
                    <span className="text-sm text-neutral-600">{item.provider}</span>
                  </div>
                  <div className="text-sm text-neutral-700">{item.description}</div>
                  <div className="text-xs text-neutral-500">Requester: {item.requester} • {item.date} • Rp{item.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[var(--radius-lg)] bg-surface border border-border shadow-[var(--shadow-card)] p-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-neutral-600">Booking Code</div>
                  <div className="font-medium text-bni-blue">{selected.bookingCode}</div>
                </div>
                <div>
                  <div className="text-neutral-600">Provider</div>
                  <div className="font-medium text-bni-blue">{selected.provider}</div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
                <div>
                  <div className="text-neutral-600">Tanggal</div>
                  <div className="font-medium">{selected.date}</div>
                  <div className="mt-4 text-neutral-600">Total</div>
                  <div className="font-semibold text-bni-blue">Rp{selected.amount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-neutral-600">Requester</div>
                  <div className="font-medium">{selected.requester}</div>
                </div>
              </div>
            </div>

            <div className="rounded-[var(--radius-lg)] bg-surface border border-border shadow-[var(--shadow-card)] p-6">
              <div className="text-sm text-neutral-600 mb-3">Lampiran Foto Kegiatan</div>
              <div className="aspect-[3/4] w-full rounded-lg border border-neutral-300 bg-neutral-100" />
            </div>

            <div className="flex items-center gap-3">
              {role === "Approval" && (
                <button className="rounded-lg bg-bni-green text-white px-6 py-3 font-medium">Approve</button>
              )}
              <textarea placeholder="Return Reason" className="flex-1 rounded-lg border border-neutral-300 bg-surface px-4 py-3" />
              <button className="rounded-lg bg-bni-orange text-white px-6 py-3 font-medium">Return Ticket</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

