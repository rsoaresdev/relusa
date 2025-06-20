import { useState, useEffect, useRef } from "react";
import { supabase, User } from "@/lib/supabase/config";
import type { Session } from "@supabase/supabase-js";
import { useTabSync } from "./useTabSync";

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isInitialized = useRef(false);
  const syncTimeout = useRef<NodeJS.Timeout | null>(null);

  // Hook para sincronização entre tabs
  const { broadcastToOtherTabs } = useTabSync(
    // Callback para mudanças de estado de auth de outros tabs
    (authData) => {
      if (authData) {
        setUser(authData.user);
        setIsAdmin(authData.isAdmin);
        setLoading(false);
      }
    },
    // Callback para logout de outros tabs
    () => {
      setUser(null);
      setIsAdmin(false);
      setError(null);
      setLoading(false);
    }
  );

  // Função para sincronizar estado entre tabs
  const syncStateAcrossTabs = (data: {
    user: User | null;
    isAdmin: boolean;
  }) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "relusa-auth-state",
          JSON.stringify({
            user: data.user,
            isAdmin: data.isAdmin,
            timestamp: Date.now(),
          })
        );

        // Broadcast para outros tabs
        broadcastToOtherTabs("AUTH_STATE_CHANGE", data);
      } catch (error) {
        console.error("Erro ao sincronizar estado:", error);
      }
    }
  };

  // Função para ler estado de outros tabs
  const readStateFromOtherTabs = () => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("relusa-auth-state");
        if (stored) {
          const data = JSON.parse(stored);
          // Apenas usar dados recentes (menos de 1 minuto)
          if (Date.now() - data.timestamp < 60000) {
            return data;
          }
        }
      } catch (error) {
        console.error("Erro ao ler estado de outros tabs:", error);
      }
    }
    return null;
  };

  // Função para buscar dados do utilizador
  const fetchUserData = async (session: Session | null, skipSync = false) => {
    if (!session?.user) {
      setUser(null);
      setIsAdmin(false);
      setLoading(false);

      if (!skipSync) {
        syncStateAcrossTabs({ user: null, isAdmin: false });
      }
      return;
    }

    try {
      // Buscar dados do utilizador
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      // Se utilizador não existe, criar
      if (userError?.code === "PGRST116") {
        const newUser = {
          id: session.user.id,
          email: session.user.email || "",
          name:
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            "Utilizador",
          phone: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data: createdUser, error: createError } = await supabase
          .from("users")
          .insert([newUser])
          .select()
          .single();

        if (!createError && createdUser) {
          // Criar pontos de fidelidade
          await supabase.from("loyalty_points").insert([
            {
              user_id: session.user.id,
              points: 0,
              bookings_count: 0,
            },
          ]);

          setUser(createdUser as User);
        }
      } else if (!userError && userData) {
        setUser(userData as User);
      }

      // Verificar se é admin
      const { data: adminData } = await supabase
        .from("admins")
        .select("id")
        .eq("user_id", session.user.id)
        .single();

      const isUserAdmin = !!adminData;
      setIsAdmin(isUserAdmin);

      // Sincronizar com outros tabs
      if (!skipSync) {
        syncStateAcrossTabs({
          user: (userData as User) || null,
          isAdmin: isUserAdmin,
        });
      }
    } catch (error) {
      console.error("Erro ao buscar dados do utilizador:", error);
      setError("Erro ao carregar dados do utilizador");
    } finally {
      setLoading(false);
    }
  };

  // Função para refresh
  const refreshUser = async () => {
    setLoading(true);
    const { data } = await supabase.auth.getSession();
    await fetchUserData(data.session);
  };

  // Função de logout
  const signOut = async () => {
    setLoading(true);

    try {
      await supabase.auth.signOut();

      // Limpar localStorage
      if (typeof window !== "undefined") {
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (
            key.includes("supabase") ||
            key.includes("auth") ||
            key.includes("relusa-auth")
          ) {
            localStorage.removeItem(key);
          }
        });
      }

      setUser(null);
      setIsAdmin(false);
      setError(null);

      // Broadcast logout para outros tabs
      broadcastToOtherTabs("LOGOUT");

      // Redirecionar
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Erro no logout:", error);
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } finally {
      setLoading(false);
    }
  };

  // Inicialização
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // Primeiro, tentar ler estado de outros tabs se não foi inicializado ainda
        if (!isInitialized.current) {
          const otherTabState = readStateFromOtherTabs();
          if (otherTabState && otherTabState.user) {
            setUser(otherTabState.user);
            setIsAdmin(otherTabState.isAdmin);
            setLoading(false);
            isInitialized.current = true;
            return;
          }
        }

        const { data } = await supabase.auth.getSession();
        if (mounted) {
          await fetchUserData(data.session);
          isInitialized.current = true;
        }
      } catch (error) {
        console.error("Erro na inicialização:", error);
        if (mounted) {
          setError("Erro ao inicializar autenticação");
          setLoading(false);
        }
      }
    };

    initAuth();

    // Listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      // Debounce para evitar múltiplas chamadas rápidas
      if (syncTimeout.current) {
        clearTimeout(syncTimeout.current);
      }

      syncTimeout.current = setTimeout(async () => {
        if (event === "SIGNED_OUT") {
          setUser(null);
          setIsAdmin(false);
          setError(null);
          setLoading(false);
          broadcastToOtherTabs("LOGOUT");
        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          await fetchUserData(session);
        }
      }, 100); // Debounce de 100ms
    });

    // Listener para quando a tab volta ao foco (com debounce)
    let visibilityTimeout: NodeJS.Timeout | null = null;
    const handleVisibilityChange = () => {
      if (visibilityTimeout) {
        clearTimeout(visibilityTimeout);
      }

      visibilityTimeout = setTimeout(() => {
        if (document.visibilityState === "visible" && isInitialized.current) {
          // Verificar se há mudanças de estado em outros tabs
          const otherTabState = readStateFromOtherTabs();
          if (otherTabState) {
            const currentUserStr = JSON.stringify(user);
            const otherUserStr = JSON.stringify(otherTabState.user);

            if (
              currentUserStr !== otherUserStr ||
              isAdmin !== otherTabState.isAdmin
            ) {
              setUser(otherTabState.user);
              setIsAdmin(otherTabState.isAdmin);
            }
          }
        }
      }, 500); // Debounce de 500ms
    };

    if (typeof window !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();

      if (syncTimeout.current) {
        clearTimeout(syncTimeout.current);
      }

      if (visibilityTimeout) {
        clearTimeout(visibilityTimeout);
      }

      if (typeof window !== "undefined") {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      }
    };
  }, [broadcastToOtherTabs]); // Removido user e isAdmin das dependências para evitar loops

  return {
    user,
    loading,
    isAdmin,
    error,
    refreshUser,
    signOut,
  };
};
