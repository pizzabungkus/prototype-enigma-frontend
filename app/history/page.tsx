"use client";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import { useData, Reimbursement } from "../context/DataContext";
import { useMemo, useState } from "react";
import Image from "next/image";

export default function HistoryPage() {
  const { auth } = useAuth();
  const { reimbursements } = useData();
  const [provider, setProvider] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [selectedReimbursement, setSelectedReimbursement] = useState<Reimbursement | null>(null);

  const rows = useMemo(() => {
    let r = reimbursements;
    if (auth?.role === "REQUESTER") r = r.filter((x) => x.requester_username === (auth.username || ""));
    // For Approval/Auditor, they can see all (or filtered by assignments if we had that logic, but prototype said "View History" generally)
    
    if (provider) r = r.filter((x) => x.provider === provider);
    if (status) r = r.filter((x) => x.status === status);
    if (from) r = r.filter((x) => x.created_at >= from);
    if (to) r = r.filter((x) => x.created_at <= to);
    return r;
  }, [auth, reimbursements, provider, status, from, to]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  const formatRupiah = (val: string | number | undefined) => {
    if (!val) return "Rp0";
    return "Rp" + Number(val).toLocaleString("id-ID");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="mx-auto max-w-6xl px-6 py-10 print:hidden">
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
                <option value="WAITING_APPROVAL">Waiting Approval</option>
                <option value="APPROVED">Approved</option>
                <option value="RETURNED">Returned</option>
                <option value="REJECTED">Rejected</option>
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
                    <td className="py-3 px-2">{r.created_at}</td>
                    <td className="py-3 px-2">{r.booking_code}</td>
                    <td className="py-3 px-2">{r.provider}</td>
                    <td className="py-3 px-2 text-[#1F2937]">{r.description}</td>
                    <td className="py-3 px-2">{formatRupiah(r.total_biaya)}</td>
                    <td className="py-3 px-2">
                      <span className={
                        r.status === "APPROVED" ? "rounded px-2 py-1 bg-bni-green/10 text-bni-green" :
                        r.status === "RETURNED" ? "rounded px-2 py-1 bg-bni-orange/10 text-bni-orange" :
                        "rounded px-2 py-1 bg-neutral-200 text-[#374151]"
                      }>{r.status.replace("_", " ")}</span>
                    </td>
                    <td className="py-3 px-2">
                      <button 
                        onClick={() => setSelectedReimbursement(r)}
                        className="rounded-lg border border-bni-blue/30 text-bni-blue bg-white px-3 py-1 hover:bg-bni-blue/5"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Overlay */}
      {selectedReimbursement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 print:p-0 print:bg-white print:absolute">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl relative print:max-w-none print:max-h-none print:shadow-none print:rounded-none print:w-full">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4 print:hidden">
              <h2 className="text-lg font-semibold text-[#1A1A1A]">Request Details</h2>
              <button 
                onClick={() => setSelectedReimbursement(null)}
                className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Header for Print only */}
              <div className="hidden print:block mb-6 border-b pb-4">
                 <h1 className="text-2xl font-bold text-[#1A1A1A]">Reimbursement Request</h1>
                 <p className="text-sm text-neutral-500">Printed on {new Date().toLocaleDateString()}</p>
              </div>

              {/* Status Badge */}
              <div className="flex justify-center gap-3">
                 <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
                    selectedReimbursement.status === "APPROVED" ? "bg-green-100 text-green-800 border-green-200" :
                    selectedReimbursement.status === "RETURNED" ? "bg-orange-100 text-orange-800 border-orange-200" :
                    "bg-gray-100 text-gray-800 border-gray-200"
                  }`}>
                    Status: {selectedReimbursement.status.replace("_", " ")}
                  </span>
                  
                  {/* Reimbursement Status Badge */}
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
                    selectedReimbursement.reimbursed_status === "REIMBURSED" ? "bg-blue-100 text-blue-800 border-blue-200" :
                    "bg-neutral-100 text-neutral-600 border-neutral-200"
                  }`}>
                    Reimbursement: {selectedReimbursement.reimbursed_status?.replace("_", " ") || "NOT REIMBURSED"}
                  </span>
              </div>

              {/* Main Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-[#1A1A1A] mb-1 font-medium">Booking Code</div>
                  <div className="font-medium text-[#1A1A1A]">{selectedReimbursement.booking_code}</div>
                </div>
                <div>
                  <div className="text-[#1A1A1A] mb-1 font-medium">Provider</div>
                  <div className="font-medium text-[#1A1A1A]">{selectedReimbursement.provider}</div>
                </div>
                <div>
                  <div className="text-[#1A1A1A] mb-1 font-medium">Requester</div>
                  <div className="font-medium text-[#1A1A1A]">{selectedReimbursement.requester_username}</div>
                </div>
                <div>
                  <div className="text-[#1A1A1A] mb-1 font-medium">Requested Date</div>
                  <div className="font-medium text-[#1A1A1A]">{formatDate(selectedReimbursement.created_at)}</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="text-sm text-[#1A1A1A] font-medium mb-1">Description</div>
                <div className="text-sm text-[#1A1A1A] bg-neutral-50 p-3 rounded-lg border border-neutral-100 print:bg-white print:border-neutral-300">
                  {selectedReimbursement.description}
                </div>
              </div>

               {/* Return Reason (if returned) */}
               {selectedReimbursement.status === "RETURNED" && selectedReimbursement.return_reason && (
                <div>
                  <div className="text-sm text-red-600 font-medium mb-1">Return Reason</div>
                  <div className="text-sm text-[#1A1A1A] bg-red-50 p-3 rounded-lg border border-red-100 print:border-red-300">
                    {selectedReimbursement.return_reason}
                  </div>
                </div>
              )}

              {/* Approval Info Section */}
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100 print:bg-white print:border-neutral-300">
                <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3 border-b border-neutral-200 pb-2">Approval Info</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-[#1A1A1A] mb-1 font-medium">Approved By</div>
                    <div className="font-medium text-[#1A1A1A]">{selectedReimbursement.approved_by || "-"}</div>
                  </div>
                  <div>
                    <div className="text-[#1A1A1A] mb-1 font-medium">Approved At</div>
                    <div className="font-medium text-[#1A1A1A]">{formatDate(selectedReimbursement.approved_at)}</div>
                  </div>
                </div>
              </div>

              {/* Reimbursement Status Section */}
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100 print:bg-white print:border-neutral-300">
                <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3 border-b border-neutral-200 pb-2">Reimbursement Status</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-[#1A1A1A] mb-1 font-medium">Status</div>
                    <div className="font-medium text-[#1A1A1A]">
                      {selectedReimbursement.reimbursed_status === "REIMBURSED" ? "REIMBURSED" : "Not reimbursed yet"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#1A1A1A] mb-1 font-medium">Processed At</div>
                    <div className="font-medium text-[#1A1A1A]">{formatDate(selectedReimbursement.reimbursed_at)}</div>
                  </div>
                  {selectedReimbursement.reimbursed_status === "REIMBURSED" && selectedReimbursement.reimbursed_by && (
                    <div className="col-span-2">
                      <div className="text-[#1A1A1A] mb-1 font-medium">Processed By</div>
                      <div className="font-medium text-[#1A1A1A]">{selectedReimbursement.reimbursed_by}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="border-t border-neutral-200 pt-4">
                <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">Cost Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#1A1A1A]">Biaya Perjalanan</span>
                    <span className="font-medium text-[#1A1A1A]">{formatRupiah(selectedReimbursement.biaya_perjalanan || "0")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1A1A1A]">Biaya Tol</span>
                    <span className="font-medium text-[#1A1A1A]">{formatRupiah(selectedReimbursement.biaya_tol || "0")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1A1A1A]">Biaya Jasa Aplikasi</span>
                    <span className="font-medium text-[#1A1A1A]">{formatRupiah(selectedReimbursement.biaya_jasa_aplikasi || "0")}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-neutral-100 mt-2">
                    <span className="font-semibold text-[#1A1A1A]">Total Biaya</span>
                    <span className="font-bold text-bni-blue text-lg print:text-black">{formatRupiah(selectedReimbursement.total_biaya)}</span>
                  </div>
                </div>
              </div>

              {/* Timeline / Audit Trail */}
              <div className="border-t border-neutral-200 pt-4">
                <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">Audit Trail</h3>
                <div className="text-xs text-[#1A1A1A] space-y-1">
                  <div className="flex gap-2">
                    <span className="font-medium w-24">Requested:</span>
                    <span>{formatDate(selectedReimbursement.created_at)} by {selectedReimbursement.requester_username}</span>
                  </div>
                  {selectedReimbursement.approved_at && (
                    <div className="flex gap-2">
                      <span className="font-medium w-24">Approved:</span>
                      <span>{formatDate(selectedReimbursement.approved_at)} by {selectedReimbursement.approved_by}</span>
                    </div>
                  )}
                  {selectedReimbursement.status === "RETURNED" && (
                     <div className="flex gap-2 text-orange-700">
                      <span className="font-medium w-24">Returned:</span>
                      <span>{selectedReimbursement.returned_at ? formatDate(selectedReimbursement.returned_at) : "See reason above"}</span>
                    </div>
                  )}
                  {selectedReimbursement.reimbursed_status === "REIMBURSED" && (
                    <div className="flex gap-2 text-blue-700">
                      <span className="font-medium w-24">Reimbursed:</span>
                      <span>{formatDate(selectedReimbursement.reimbursed_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Photo */}
              <div className="break-inside-avoid">
                <div className="text-sm text-[#1A1A1A] font-medium mb-2">Attachment</div>
                {selectedReimbursement.photo ? (
                  <div className="relative h-64 w-full rounded-lg overflow-hidden border border-neutral-200 print:h-96">
                    <Image 
                      src={selectedReimbursement.photo} 
                      alt="Receipt" 
                      fill 
                      className="object-contain bg-neutral-50"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24 rounded-lg bg-neutral-100 border border-neutral-200 text-[#1A1A1A] text-sm">
                    No attachment
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 border-t border-neutral-200 bg-white px-6 py-4 flex gap-3 print:hidden">
              <button 
                onClick={handlePrint}
                className="flex-1 rounded-lg bg-bni-blue text-white py-3 font-medium hover:bg-bni-blue/90 transition-colors flex items-center justify-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9V2h12v7" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <path d="M6 14h12v8H6z" />
                </svg>
                Print / Save PDF
              </button>
              <button 
                onClick={() => setSelectedReimbursement(null)}
                className="flex-1 rounded-lg bg-neutral-100 text-[#1A1A1A] py-3 font-medium hover:bg-neutral-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
