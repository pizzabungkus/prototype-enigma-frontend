"use client";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <AuthProvider>{children}</AuthProvider>
    </DataProvider>
  );
}

