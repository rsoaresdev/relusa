"use client";

import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import type { User } from "@/lib/supabase/config";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext deve ser usado dentro de um AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { user, loading, isAdmin, error, signOut, refreshUser } = useAuth();

  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin, error, signOut, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
