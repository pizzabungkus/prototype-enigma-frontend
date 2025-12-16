"use client";
import NavBar from "../components/NavBar";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useRouter } from "next/navigation";
import { DanantaraLogo } from "../components/Logo";

export default function ReimbursementFormPage() {
  const { auth } = useAuth();
  const { addReimbursement } = useData();
  const router = useRouter();
  
  // Protect route
  useEffect(() => {
    if (auth && auth.role !== "REQUESTER") router.replace("/approval");
  }, [auth, router]);

  const params = useSearchParams();
  const providerParam = params.get("provider") || "grab";
  
  // Form State
  const [provider, setProvider] = useState(providerParam.toLowerCase() === "bluebird" ? "Blue Bird" : "Grab");
  const [bookingCode, setBookingCode] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  
  // Cost State (Display values with formatting)
  const [travelCost, setTravelCost] = useState("");
  const [tollCost, setTollCost] = useState("");
  const [appFee, setAppFee] = useState("");
  const [totalCost, setTotalCost] = useState("");

  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Helper to format rupiah
  const formatRupiah = (value: string) => {
    // Remove non-digits
    const raw = value.replace(/\D/g, "");
    if (!raw) return "";
    // Format with dots
    return Number(raw).toLocaleString("id-ID");
  };

  const handleCostChange = (value: string, setter: (val: string) => void) => {
    setter(formatRupiah(value));
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(f);
  };

  const handleSubmit = () => {
    // Validation
    if (!bookingCode.trim()) {
      setNotification({ message: "Booking Code is required", type: "error" });
      return;
    }
    if (!description.trim()) {
      setNotification({ message: "Description is required", type: "error" });
      return;
    }
    if (!totalCost) {
      setNotification({ message: "Total Cost is required", type: "error" });
      return;
    }
    if (!photo) {
      setNotification({ message: "Photo proof is required", type: "error" });
      return;
    }

    // Prepare data
    // We use totalCost as the main amount. The other costs are just details (not stored in the simple CSV schema provided, but we can assume 'amount' = totalCost)
    // The CSV schema has: id, booking_code, provider, description, amount, status, requester_username, created_at
    // It doesn't seem to have fields for breakdown (travel, toll, app fee). I will just store totalCost as 'amount'.
    
    const rawAmount = totalCost.replace(/\D/g, "");

    addReimbursement({
      booking_code: bookingCode,
      provider: provider as "Grab" | "Blue Bird",
      description: description,
      total_biaya: rawAmount,
      requester_username: auth?.username || "Unknown",
      biaya_perjalanan: travelCost.replace(/\D/g, ""),
      biaya_tol: tollCost.replace(/\D/g, ""),
      biaya_jasa_aplikasi: appFee.replace(/\D/g, ""),
      photo: photo || ""
    });

    // Success UI
    setNotification({ message: "Reimbursement request submitted successfully!", type: "success" });
    
    // Clear form
    setBookingCode("");
    setDescription("");
    setPhoto(null);
    setTravelCost("");
    setTollCost("");
    setAppFee("");
    setTotalCost("");
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
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

        {notification && (
          <div className={`mt-4 p-4 rounded-lg ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {notification.message}
          </div>
        )}

        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm mb-2 text-[#1A1A1A]">Kode Booking</label>
              <input 
                type="text" 
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-surface px-4 py-3 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-bni-orange" 
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#1A1A1A]">Provider</label>
              <select 
                value={provider} 
                onChange={(e) => setProvider(e.target.value)} 
                className="w-full rounded-lg border border-neutral-300 bg-surface px-4 py-3 text-[#111827] focus:outline-none focus:ring-2 focus:ring-bni-orange"
              >
                <option>Grab</option>
                <option>Blue Bird</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#1A1A1A]">Lampiran Foto</label>
              <label className="rounded-lg border border-neutral-300 bg-surface p-6 flex items-center justify-center gap-3 text-[#1A1A1A] cursor-pointer hover:bg-neutral-50 transition-colors">
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
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-surface px-4 py-3 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-bni-orange" 
                rows={4} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input 
                value={travelCost}
                onChange={(e) => handleCostChange(e.target.value, setTravelCost)}
                className="rounded-lg border border-neutral-300 bg-surface px-4 py-3 text-[#111827] placeholder:text-[#9CA3AF]" 
                placeholder="Biaya perjalanan" 
              />
              <input 
                value={tollCost}
                onChange={(e) => handleCostChange(e.target.value, setTollCost)}
                className="rounded-lg border border-neutral-300 bg-surface px-4 py-3 text-[#111827] placeholder:text-[#9CA3AF]" 
                placeholder="Biaya tol" 
              />
              <input 
                value={appFee}
                onChange={(e) => handleCostChange(e.target.value, setAppFee)}
                className="rounded-lg border border-neutral-300 bg-surface px-4 py-3 text-[#111827] placeholder:text-[#9CA3AF]" 
                placeholder="Biaya jasa aplikasi" 
              />
              <input 
                value={totalCost}
                onChange={(e) => handleCostChange(e.target.value, setTotalCost)}
                className="rounded-lg border border-neutral-300 bg-surface px-4 py-3 text-[#111827] placeholder:text-[#9CA3AF] font-medium" 
                placeholder="Total biaya" 
              />
            </div>
            <button 
              onClick={handleSubmit}
              className="inline-flex items-center justify-center rounded-lg bg-bni-orange text-white px-6 py-3 font-medium hover:opacity-90 w-full md:w-auto"
            >
              Submit
            </button>
          </div>

          <div className="rounded-[var(--radius-lg)] bg-surface border border-border shadow-[var(--shadow-card)] p-6 h-fit">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Preview</h2>
            {photo ? (
              <div className="mt-4 h-48 w-full relative">
                <Image src={photo} alt="Preview" fill sizes="(max-width:768px) 100vw, 480px" className="rounded-lg border border-neutral-300 object-cover" />
              </div>
            ) : (
              <div className="mt-4 h-48 rounded-lg border border-neutral-300 bg-neutral-100 flex items-center justify-center text-neutral-400">
                No Photo Selected
              </div>
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
