"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { parseCSV } from "../lib/initialData";

export type User = {
  id: string;
  username: string;
  password?: string;
  full_name: string;
  role: "REQUESTER" | "APPROVAL" | "AUDITOR";
};

export type Reimbursement = {
  id: string;
  booking_code: string;
  provider: "Grab" | "Blue Bird";
  description: string;
  requester_username: string;
  created_at: string;
  
  // Cost fields
  biaya_perjalanan: string; // was travel_cost
  biaya_tol: string;        // was toll_cost
  biaya_jasa_aplikasi: string; // was app_fee
  total_biaya: string;      // was amount

  // Approval fields
  status: "WAITING_APPROVAL" | "APPROVED" | "RETURNED" | "REJECTED";
  approved_by?: string;
  approved_at?: string;

  // Reimbursement info
  reimbursed_status?: "NOT_REIMBURSED" | "REIMBURSED";
  reimbursed_at?: string;
  reimbursed_by?: string;
  
  // Extra fields for logic
  return_reason?: string;
  returned_at?: string;
  photo?: string;
};

type DataContextType = {
  users: User[];
  reimbursements: Reimbursement[];
  addReimbursement: (r: Omit<Reimbursement, "id" | "status" | "created_at" | "reimbursed_status" | "approved_by" | "approved_at">) => void;
  updateReimbursement: (id: string, updates: Partial<Reimbursement>) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);

  // Load from CSV on mount
  useEffect(() => {
    async function loadData() {
        try {
            // Check local storage first for reimbursements to persist edits
            const stored = localStorage.getItem("reimbursements_data");
            
            // Load Users
            const usersRes = await fetch('/data/users.csv');
            const usersText = await usersRes.text();
            const parsedUsers = parseCSV<User>(usersText);
            
            // Normalize Roles immediately
            const normalizedUsers = parsedUsers.map(u => ({
                ...u,
                role: (u.role || "").trim().toUpperCase() as "REQUESTER" | "APPROVAL" | "AUDITOR"
            }));
            
            setUsers(normalizedUsers);

            // Load Reimbursements
            if (stored) {
                 setReimbursements(JSON.parse(stored));
            } else {
                 const rRes = await fetch('/data/reimbursements.csv');
                 const rText = await rRes.text();
                 setReimbursements(parseCSV<Reimbursement>(rText));
            }
        } catch (error) {
            console.error("Failed to load CSV data", error);
        }
    }
    loadData();
  }, []);

  // Save to localStorage whenever reimbursements change
  useEffect(() => {
    if (reimbursements.length > 0) {
      localStorage.setItem("reimbursements_data", JSON.stringify(reimbursements));
    }
  }, [reimbursements]);

  const addReimbursement = (r: Omit<Reimbursement, "id" | "status" | "created_at" | "reimbursed_status" | "approved_by" | "approved_at">) => {
    const newReimbursement: Reimbursement = {
      ...r,
      id: String(reimbursements.length + 1),
      status: "WAITING_APPROVAL",
      created_at: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      reimbursed_status: "NOT_REIMBURSED",
      approved_by: "",
      approved_at: ""
    };
    setReimbursements([...reimbursements, newReimbursement]);
  };

  const updateReimbursement = (id: string, updates: Partial<Reimbursement>) => {
    setReimbursements(prev => 
      prev.map(r => r.id === id ? { ...r, ...updates } : r)
    );
  };

  return (
    <DataContext.Provider value={{ users, reimbursements, addReimbursement, updateReimbursement }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
