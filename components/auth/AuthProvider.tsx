"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase, performLogout } from "@/lib/supabase/config";
import type { User } from "@/lib/supabase/config";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Verificar sessão inicial
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Erro ao obter sessão inicial:", error);
          if (isMounted) {
            setLoading(false);
            setIsInitialized(true);
          }
          return;
        }

        if (session?.user && isMounted) {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (!userError && userData && isMounted) {
            setUser(userData as User);

            // Verificar se é admin
            const { data: adminData } = await supabase
              .from("admins")
              .select("*")
              .eq("user_id", session.user.id)
              .single();

            setIsAdmin(!!adminData);
          }
        }
      } catch (error) {
        console.error("Erro inesperado ao verificar sessão:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };

    if (!isInitialized) {
      getInitialSession();
    }

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      try {
        if (session?.user) {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (!userError && userData) {
            setUser(userData as User);

            // Verificar se é admin
            const { data: adminData } = await supabase
              .from("admins")
              .select("*")
              .eq("user_id", session.user.id)
              .single();

            setIsAdmin(!!adminData);
          }
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Erro ao processar mudança de autenticação:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [isInitialized]);

  const signOut = async () => {
    try {
      await performLogout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Fallback: forçar refresh mesmo assim
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
