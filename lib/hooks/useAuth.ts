import { useState, useEffect, useCallback, useRef } from "react";
import { supabase, User, clearUserCache } from "@/lib/supabase/config";
import { toast } from "sonner";

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Estado global simplificado para evitar múltiplas verificações
let globalAuthState = {
  user: null as User | null,
  isAdmin: false,
  lastCheck: 0,
  isInitializing: false,
};

const CACHE_DURATION = 30 * 1000; // 30 segundos
const LOADING_TIMEOUT = 10 * 1000; // 10 segundos timeout máximo

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef(true);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initializationRef = useRef(false);

  // Timeout de segurança para evitar loading infinito
  const startLoadingTimeout = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    loadingTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current && loading) {
        console.warn("Timeout de autenticação atingido, parando loading");
        setLoading(false);
        setError("Timeout na verificação de autenticação");
      }
    }, LOADING_TIMEOUT);
  }, [loading]);

  const clearLoadingTimeout = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  }, []);

  const fetchUserProfile = useCallback(
    async (
      userId: string
    ): Promise<{ user: User; isAdmin: boolean } | null> => {
      try {
        // Buscar dados do utilizador
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (userError || !userData) {
          console.error("Erro ao obter dados do utilizador:", userError);
          return null;
        }

        // Verificar se é admin
        const { data: adminData } = await supabase
          .from("admins")
          .select("id")
          .eq("user_id", userId)
          .single();

        return {
          user: userData as User,
          isAdmin: !!adminData,
        };
      } catch (error) {
        console.error("Erro ao buscar perfil do utilizador:", error);
        return null;
      }
    },
    []
  );

  const updateAuthState = useCallback(
    (newUser: User | null, newIsAdmin: boolean) => {
      if (!isMountedRef.current) return;

      setUser(newUser);
      setIsAdmin(newIsAdmin);
      setError(null);

      // Atualizar estado global
      globalAuthState.user = newUser;
      globalAuthState.isAdmin = newIsAdmin;
      globalAuthState.lastCheck = Date.now();
    },
    []
  );

  const validateAndLoadUser = useCallback(
    async (forceRefresh = false) => {
      if (!isMountedRef.current) return;

      // Evitar múltiplas inicializações simultâneas
      if (globalAuthState.isInitializing && !forceRefresh) {
        return;
      }

      // Usar cache se válido e não forçar refresh
      const now = Date.now();
      if (
        !forceRefresh &&
        globalAuthState.user &&
        now - globalAuthState.lastCheck < CACHE_DURATION
      ) {
        updateAuthState(globalAuthState.user, globalAuthState.isAdmin);
        return;
      }

      globalAuthState.isInitializing = true;
      startLoadingTimeout();

      try {
        setError(null);

        // Verificar sessão
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Erro ao verificar sessão:", sessionError);
          updateAuthState(null, false);
          return;
        }

        if (!session?.user) {
          updateAuthState(null, false);
          return;
        }

        // Buscar dados do utilizador
        const userProfile = await fetchUserProfile(session.user.id);

        if (userProfile) {
          updateAuthState(userProfile.user, userProfile.isAdmin);
        } else {
          updateAuthState(null, false);
        }
      } catch (error) {
        console.error("Erro na validação de utilizador:", error);
        if (isMountedRef.current) {
          setError("Erro ao verificar autenticação");
          updateAuthState(null, false);
        }
      } finally {
        globalAuthState.isInitializing = false;
        clearLoadingTimeout();
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    [
      updateAuthState,
      fetchUserProfile,
      startLoadingTimeout,
      clearLoadingTimeout,
    ]
  );

  const refreshUser = useCallback(async () => {
    if (!isMountedRef.current) return;
    setLoading(true);
    await validateAndLoadUser(true);
  }, [validateAndLoadUser]);

  const signOut = useCallback(async () => {
    try {
      // Limpar estado local e global
      updateAuthState(null, false);
      globalAuthState = {
        user: null,
        isAdmin: false,
        lastCheck: 0,
        isInitializing: false,
      };

      clearUserCache();
      clearLoadingTimeout();

      // Fazer logout no Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Erro ao fazer logout:", error);
      }

      // Limpar localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("supabase.auth.token");
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          if (supabaseUrl) {
            const key = `sb-${
              supabaseUrl.split("//")[1].split(".")[0]
            }-auth-token`;
            localStorage.removeItem(key);
          }
        } catch (error) {
          console.error("Erro ao limpar localStorage:", error);
        }
      }

      // Redirecionar para home
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Erro inesperado no logout:", error);
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  }, [updateAuthState, clearLoadingTimeout]);

  // Inicialização do hook
  useEffect(() => {
    isMountedRef.current = true;

    // Evitar dupla inicialização
    if (initializationRef.current) return;
    initializationRef.current = true;

    // Inicializar autenticação
    validateAndLoadUser();

    // Listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMountedRef.current) return;

      try {
        setError(null);

        if (event === "SIGNED_OUT" || !session?.user) {
          updateAuthState(null, false);
          setLoading(false);
        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          // Buscar dados do utilizador
          const userProfile = await fetchUserProfile(session.user.id);

          if (userProfile && isMountedRef.current) {
            updateAuthState(userProfile.user, userProfile.isAdmin);
          } else if (isMountedRef.current) {
            updateAuthState(null, false);
          }

          if (isMountedRef.current) {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Erro ao processar mudança de autenticação:", error);
        if (isMountedRef.current) {
          setError("Erro ao processar autenticação");
          setLoading(false);
        }
      }
    });

    return () => {
      isMountedRef.current = false;
      initializationRef.current = false;
      clearLoadingTimeout();
      subscription.unsubscribe();
    };
  }, []); // Dependências vazias para executar apenas uma vez

  return {
    user,
    loading,
    isAdmin,
    error,
    refreshUser,
    signOut,
  };
};
