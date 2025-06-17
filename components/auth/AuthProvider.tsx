"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import type { User } from "@/lib/supabase/config";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
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
  const { user, loading, isAdmin, signOut, refreshUser } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Timeout de segurança adicional no provider
  useEffect(() => {
    if (loading) {
      // Limpar timeout anterior se existir
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Configurar novo timeout de 15 segundos
      timeoutRef.current = setTimeout(() => {
        console.warn("AuthProvider: Timeout de loading atingido");
        // Forçar refresh se ainda estiver em loading após 15 segundos
        if (loading) {
          refreshUser().catch((error) => {
            console.error("Erro ao forçar refresh após timeout:", error);
          });
        }
      }, 15000);
    } else {
      // Limpar timeout se não estiver mais em loading
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loading, refreshUser]);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
