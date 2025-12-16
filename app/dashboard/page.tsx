"use client";
import NavBar from "../components/NavBar";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DanantaraLogo } from "../components/Logo";

export default function DashboardPage() {
  const { auth } = useAuth();
  const router = useRouter();
  
  // Protect route
  useEffect(() => {
    if (!auth) {
      router.replace("/login");
    }
  }, [auth, router]);

  if (!auth) return null;

  const role = auth.role;

  // Define features based on role
  const features = [
    {
      key: "request",
      title: "New Request",
      description: "Create a new reimbursement request for your expenses.",
      href: "/request",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <path d="M12 5v14M5 12h14" />
        </svg>
      ),
      color: "bg-bni-orange",
      visible: role === "REQUESTER"
    },
    {
      key: "history",
      title: "History",
      description: "View status and history of your reimbursement requests.",
      href: "/history",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <path d="M12 8v4l3 3" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      ),
      color: "bg-bni-blue",
      visible: true // Everyone can see history
    },
    {
      key: "approval",
      title: "Approvals",
      description: "Review and approve pending reimbursement requests.",
      href: "/approval",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
      color: "bg-bni-teal",
      visible: role === "APPROVAL" || role === "AUDITOR"
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <NavBar />
      
      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-bni-blue mb-2">
            Welcome, <span className="text-bni-orange">{auth.username}</span>
          </h1>
          <p className="text-neutral-600 max-w-2xl">
            Manage your reimbursements efficiently with BNI TERRA. 
            Select an action below to get started.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.filter(f => f.visible).map((feature) => (
            <Link 
              key={feature.key} 
              href={feature.href}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-all duration-300"
            >
              <div className={`h-12 w-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2 group-hover:text-bni-blue transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {feature.description}
              </p>
              
              <div className="absolute right-6 top-6 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-400">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-neutral-200 py-6">
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between">
          <span className="text-xs text-neutral-400">
            © 2025 BNI TERRA Travel Reimbursement System
          </span>
          <div className="flex items-center gap-3 opacity-80  transition-all duration-500">
            <span className="text-xs font-medium text-neutral-500">Powered by</span>
            <DanantaraLogo height={34} />
          </div>
        </div>
      </footer>
    </div>
  );
}
