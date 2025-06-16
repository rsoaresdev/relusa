import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/config";
import type { User } from "@/lib/supabase/config";

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (userError) {
        console.error("Erro ao obter dados do utilizador:", userError);
        return null;
      }

      // Verificar se é admin
      const { data: adminData } = await supabase
        .from("admins")
        .select("*")
        .eq("user_id", userId)
        .single();

      return {
        user: userData as User,
        isAdmin: !!adminData,
      };
    } catch (error) {
      console.error("Erro inesperado ao obter dados do utilizador:", error);
      return null;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      setError(null);
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Erro ao obter sessão:", sessionError);
        setError("Erro ao verificar autenticação");
        return;
      }

      if (session?.user) {
        const result = await fetchUserData(session.user.id);
        if (result) {
          setUser(result.user);
          setIsAdmin(result.isAdmin);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Erro ao atualizar dados do utilizador:", error);
      setError("Erro ao atualizar dados");
    }
  }, [fetchUserData]);

  // Função para verificar sessão quando a página volta a ficar visível
  const handleVisibilityChange = useCallback(async () => {
    if (!document.hidden && isInitialized) {
      // Página voltou a ficar visível, verificar se a sessão ainda é válida
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Erro ao verificar sessão após visibilidade:", error);
          return;
        }

        // Se não há sessão mas tínhamos um utilizador, limpar estado
        if (!session && user) {
          setUser(null);
          setIsAdmin(false);
          setError("Sessão expirou. Por favor, faça login novamente.");
        }

        // Se há sessão mas não temos utilizador, recarregar dados
        if (session && !user) {
          await refreshUser();
        }
      } catch (error) {
        console.error("Erro ao processar mudança de visibilidade:", error);
      }
    }
  }, [isInitialized, user, refreshUser]);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      if (isInitialized) return;

      try {
        setError(null);
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Erro ao obter sessão inicial:", sessionError);
          setError("Erro ao verificar autenticação");
          return;
        }

        if (session?.user && isMounted) {
          const result = await fetchUserData(session.user.id);
          if (result && isMounted) {
            setUser(result.user);
            setIsAdmin(result.isAdmin);
          }
        }
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error);
        setError("Erro ao inicializar");
      } finally {
        if (isMounted) {
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();

    // Listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      try {
        setError(null);

        if (session?.user) {
          const result = await fetchUserData(session.user.id);
          if (result && isMounted) {
            setUser(result.user);
            setIsAdmin(result.isAdmin);
          }
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Erro ao processar mudança de autenticação:", error);
        setError("Erro ao processar autenticação");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [isInitialized, fetchUserData]);

  // Adicionar listener para mudanças de visibilidade da página
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    }
  }, [handleVisibilityChange]);

  const signOut = useCallback(async () => {
    try {
      setError(null);
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      setError("Erro ao terminar sessão");
    }
  }, []);

  return {
    user,
    loading,
    isAdmin,
    error,
    signOut,
    refreshUser,
  };
};
