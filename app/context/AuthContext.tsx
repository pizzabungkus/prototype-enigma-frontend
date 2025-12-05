"use client";
import { createContext, useContext, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Role, parseRole } from "../lib/roles";

type AuthState = {
  username: string;
  role: Role;
};

type AuthContextType = {
  auth: AuthState | null;
  setAuth: (state: AuthState) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuthState] = useState<AuthState | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("bni-auth");
    if (!raw) return null;
    try {
      const obj = JSON.parse(raw) as AuthState;
      return { username: obj.username, role: parseRole(obj.role) };
    } catch {
      return null;
    }
  });
  const router = useRouter();

  const setAuth = (state: AuthState) => {
    const next = { username: state.username, role: parseRole(state.role) };
    setAuthState(next);
    localStorage.setItem("bni-auth", JSON.stringify(next));
  };

  const logout = useCallback(() => {
    localStorage.removeItem("bni-auth");
    setAuthState(null);
    router.replace("/login");
  }, [router]);

  const value = useMemo(() => ({ auth, setAuth, logout }), [auth, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext missing");
  return ctx;
}
