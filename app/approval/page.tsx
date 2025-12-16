"use client";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useState } from "react";

export default function ApprovalPage() {
  const { auth } = useAuth();
  const { reimbursements, updateReimbursement } = useData();
  const role = auth?.role || "APPROVAL";

  const incomingRequests = reimbursements.filter(
    (r) => r.status === "WAITING_APPROVAL"
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState("");

  const selected = selectedId
    ? incomingRequests.find((r) => r.id === selectedId) || incomingRequests[0]
    : incomingRequests[0];

  const handleApprove = () => {
    if (selected) {
      updateReimbursement(selected.id, { 
        status: "APPROVED",
        approved_by: auth?.username || "Unknown",
        approved_at: new Date().toISOString()
      });
      setSelectedId(null);
    }
  };

  const handleReturn = () => {
    if (selected && returnReason) {
      updateReimbursement(selected.id, { 
        status: "RETURNED", 
        return_reason: returnReason,
        returned_at: new Date().toISOString()
      });
      setReturnReason("");
      setSelectedId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-bni-blue">Approval</h1>

        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-[var(--radius-lg)] bg-surface border border-border shadow-[var(--shadow-card)] p-6">
            <div className="text-sm font-medium text-neutral-700 mb-3">Incoming Requests</div>
            <div className="space-y-2">
              {incomingRequests.length === 0 ? (
                <div className="text-neutral-500 text-sm">No pending requests.</div>
              ) : (
                incomingRequests.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full text-left rounded-lg border px-4 py-3 cursor-pointer transition-colors ${selected?.id === item.id ? "border-bni-teal bg-bni-teal/5" : "border-neutral-300 hover:border-bni-blue"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-bni-blue">{item.booking_code}</div>
                      <span className="text-sm text-neutral-600">{item.provider}</span>
                    </div>
                    <div className="text-sm text-neutral-700">{item.description}</div>
                    <div className="text-xs text-neutral-900">Requester: {item.requester_username} • {item.created_at} • Rp{Number(item.total_biaya).toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {selected ? (
            <div className="space-y-6">
              <div className="rounded-[var(--radius-lg)] bg-surface border border-border shadow-[var(--shadow-card)] p-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-neutral-900 font-medium mb-1">Booking Code</div>
                    <div className="font-semibold text-bni-blue">{selected.booking_code}</div>
                  </div>
                  <div>
                    <div className="text-neutral-900 font-medium mb-1">Provider</div>
                    <div className="font-semibold text-bni-blue">{selected.provider}</div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <div className="text-neutral-900 font-medium mb-1">Tanggal</div>
                    <div className="font-semibold text-[#1A1A1A]">{selected.created_at}</div>
                    <div className="mt-4 text-neutral-900 font-medium mb-1">Total</div>
                    <div className="font-bold text-bni-blue text-lg">Rp{Number(selected.total_biaya).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-neutral-900 font-medium mb-1">Requester</div>
                    <div className="font-semibold text-[#1A1A1A]">{selected.requester_username}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-[var(--radius-lg)] bg-surface border border-border shadow-[var(--shadow-card)] p-6">
                <div className="text-sm font-semibold text-[#1A1A1A] mb-3">Lampiran Foto Kegiatan</div>
                <div className="aspect-[3/4] w-full rounded-lg border border-neutral-300 bg-neutral-100 flex items-center justify-center text-neutral-400">
                  No Image
                </div>
              </div>

              {/* Action Buttons - HIDDEN FOR AUDITOR */}
              {role !== "AUDITOR" && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleApprove}
                      className="flex-1 rounded-lg bg-bni-green text-white px-6 py-3 font-medium hover:bg-opacity-90 transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-2 pt-4 border-t border-neutral-200">
                    <textarea 
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      placeholder="Return Reason (required to return)" 
                      className="flex-1 rounded-lg border border-neutral-300 bg-surface px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-bni-orange" 
                    />
                    <button 
                      onClick={handleReturn}
                      disabled={!returnReason}
                      className="rounded-lg bg-bni-orange text-white px-6 py-3 font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Return Ticket
                    </button>
                  </div>
                </div>
              )}
              {role === "AUDITOR" && (
                 <div className="rounded-lg bg-neutral-100 p-4 text-center text-neutral-500 italic">
                   Auditor Mode: Read Only
                 </div>
              )}
            </div>
          ) : (
             <div className="text-neutral-500">Select a request to view details.</div>
          )}
        </section>
      </main>
    </div>
  );
}

