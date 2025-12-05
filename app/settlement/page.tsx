import NavBar from "../components/NavBar";

export default function SettlementPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <NavBar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-bni-blue">Settlement</h1>

        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="rounded-[var(--radius-lg)] bg-white border border-neutral-200 shadow-[var(--shadow-card)] p-6">
              <h2 className="text-lg font-semibold text-bni-blue">Option A: Fill in manually</h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <input className="rounded-lg border border-neutral-300 bg-white px-4 py-3" placeholder="Tanggal" />
                <input className="rounded-lg border border-neutral-300 bg-white px-4 py-3" placeholder="Biaya perjalanan" />
                <input className="rounded-lg border border-neutral-300 bg-white px-4 py-3" placeholder="Biaya tol" />
                <input className="rounded-lg border border-neutral-300 bg-white px-4 py-3" placeholder="Biaya lain" />
              </div>
            </div>

            <div className="rounded-[var(--radius-lg)] bg-white border border-neutral-200 shadow-[var(--shadow-card)] p-6">
              <h2 className="text-lg font-semibold text-bni-blue">Option B: Enter Booking Code</h2>
              <div className="mt-4 flex gap-3">
                <input className="flex-1 rounded-lg border border-neutral-300 bg-white px-4 py-3" placeholder="Input booking code" />
                <button className="rounded-lg bg-bni-orange text-white px-5 py-3 font-medium">Settle</button>
              </div>
            </div>
          </div>

          <div className="rounded-[var(--radius-lg)] bg-white border border-neutral-200 shadow-[var(--shadow-card)] p-6">
            <h2 className="text-lg font-semibold text-bni-blue">Ketentuan</h2>
            <ul className="mt-4 space-y-3 text-sm text-neutral-700">
              <li>Settlement max 3×24 hours after E-Receipt.</li>
              <li>Ensure email notification is received.</li>
              <li className="text-red-600 font-medium">Payroll deduction if settlement is late or absent.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

