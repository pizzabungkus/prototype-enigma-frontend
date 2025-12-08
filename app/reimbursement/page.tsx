"use client";
import NavBar from "../components/NavBar";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DanantaraLogo } from "../components/Logo";

export default function ReimbursementFormPage() {
  const { auth } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (auth && auth.role !== "Requester") router.replace("/approval");
  }, [auth, router]);
  const params = useSearchParams();
  const providerParam = params.get("provider") || "grab";
  const [provider, setProvider] = useState(providerParam.toLowerCase() === "bluebird" ? "Blue Bird" : "Grab");
  const [photo, setPhoto] = useState<string | null>(null);
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(f);
  };
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">BNI TERRA – Travel Reimbursement System</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-500 font-medium">Powered by</span>
            <DanantaraLogo height={42} />
          </div>
        </div>

        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm mb-2 text-[#1A1A1A]">Kode Booking</label>
              <input type="text" className="w-full rounded-lg border border-neutral-300 bg-surface px-4 py-3 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-bni-orange" />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#1A1A1A]">Provider</label>
              <select value={provider} onChange={(e)=>setProvider(e.target.value)} className="w-full rounded-lg border border-neutral-300 bg-surface px-4 py-3 text-[#111827] focus:outline-none focus:ring-2 focus:ring-bni-orange">
                <option>Grab</option>
                <option>Blue Bird</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#1A1A1A]">Lampiran Foto</label>
              <label className="rounded-lg border border-neutral-300 bg-surface p-6 flex items-center justify-center gap-3 text-[#1A1A1A] cursor-pointer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 17v-8a2 2 0 0 1 2-2h3l2-2h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
                <span className="text-sm text-[#1A1A1A]">Upload activity photo</span>
                <input type="file" accept="image/*" onChange={onFile} className="hidden" />
              </label>
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#1A1A1A]">Keterangan Reimbursement</label>
              <textarea className="w-full rounded-lg border border-neutral-300 bg-surface px-4 py-3 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-bni-orange" rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input className="rounded-lg border border-neutral-300 bg-surface px-4 py-3 text-[#111827] placeholder:text-[#9CA3AF]" placeholder="Biaya perjalanan" />
              <input className="rounded-lg border border-neutral-300 bg-surface px-4 py-3 text-[#111827] placeholder:text-[#9CA3AF]" placeholder="Biaya tol" />
              <input className="rounded-lg border border-neutral-300 bg-surface px-4 py-3 text-[#111827] placeholder:text-[#9CA3AF]" placeholder="Biaya jasa aplikasi" />
              <input className="rounded-lg border border-neutral-300 bg-surface px-4 py-3 text-[#111827] placeholder:text-[#9CA3AF]" placeholder="Total biaya" />
            </div>
            <button className="inline-flex items-center justify-center rounded-lg bg-bni-orange text-white px-6 py-3 font-medium hover:opacity-90">Submit</button>
          </div>

          <div className="rounded-[var(--radius-lg)] bg-surface border border-border shadow-[var(--shadow-card)] p-6">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Preview</h2>
            {photo ? (
              <div className="mt-4 h-48 w-full relative">
                <Image src={photo} alt="Preview" fill sizes="(max-width:768px) 100vw, 480px" className="rounded-lg border border-neutral-300 object-cover" />
              </div>
            ) : (
              <div className="mt-4 h-48 rounded-lg border border-neutral-300 bg-neutral-100" />
            )}
            <div className="mt-6 text-sm text-[#1A1A1A]">
              <div className="font-medium text-[#1A1A1A]">Ketentuan Settlement</div>
              <ul className="mt-2 space-y-2">
                <li>Settlement max 3×24 hours after E-Receipt.</li>
                <li>Must receive email notification as proof.</li>
                <li className="text-red-600 font-medium">Late or invalid settlement may cause salary deduction.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
