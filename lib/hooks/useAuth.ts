import { useState, useEffect, useCallback, useRef } from "react";
import { supabase, User, clearUserCache } from "@/lib/supabase/config";

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Estado global com controle mais rigoroso
const globalAuthState = {
  user: null as User | null,
  isAdmin: false,
  lastCheck: 0,
  isInitializing: false,
  initialized: false,
};

const CACHE_DURATION = 60 * 1000; // 1 minuto
const LOADING_TIMEOUT = 5 * 1000; // 5 segundos timeout máximo

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(globalAuthState.user);
  const [loading, setLoading] = useState(!globalAuthState.initialized);
  const [isAdmin, setIsAdmin] = useState(globalAuthState.isAdmin);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef(true);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Timeout de segurança mais agressivo
  const startLoadingTimeout = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    loadingTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        console.warn("Timeout de autenticação atingido");
        setLoading(false);
        globalAuthState.initialized = true;
      }
    }, LOADING_TIMEOUT);
  }, []);

  const clearTimeouts = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  const fetchUserProfile = useCallback(
    async (
      userId: string
    ): Promise<{ user: User; isAdmin: boolean } | null> => {
      try {
        // Obter dados em paralelo para melhor performance
        const [userResponse, adminResponse] = await Promise.all([
          supabase.from("users").select("*").eq("id", userId).single(),
          supabase.from("admins").select("id").eq("user_id", userId).single(),
        ]);

        // Se o utilizador não existe, criar
        if (userResponse.error?.code === "PGRST116") {
          // Obter dados da sessão atual para criar o utilizador
          const { data: sessionData } = await supabase.auth.getSession();
          const sessionUser = sessionData.session?.user;

          if (sessionUser) {
            const newUser = {
              id: userId,
              email: sessionUser.email || "",
              name:
                sessionUser.user_metadata?.full_name ||
                sessionUser.user_metadata?.name ||
                "Utilizador",
              phone: "",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };

            // Criar utilizador
            const { data: createdUser, error: createError } = await supabase
              .from("users")
              .insert([newUser])
              .select()
              .single();

            if (createError) {
              console.error("Erro ao criar utilizador:", createError);
              return null;
            }

            // Criar pontos de fidelidade
            await supabase.from("loyalty_points").insert([
              {
                user_id: userId,
                points: 0,
                bookings_count: 0,
              },
            ]);

            return {
              user: createdUser as User,
              isAdmin: !!adminResponse.data,
            };
          }
        }

        if (userResponse.error || !userResponse.data) {
          console.error(
            "Erro ao obter dados do utilizador:",
            userResponse.error
          );
          return null;
        }

        return {
          user: userResponse.data as User,
          isAdmin: !!adminResponse.data,
        };
      } catch (error) {
        console.error("Erro ao procurar perfil do utilizador:", error);
        return null;
      }
    },
    []
  );

  const updateAuthState = useCallback(
    (newUser: User | null, newIsAdmin: boolean, skipGlobalUpdate = false) => {
      if (!isMountedRef.current) return;

      setUser(newUser);
      setIsAdmin(newIsAdmin);
      setError(null);
      setLoading(false);

      if (!skipGlobalUpdate) {
        globalAuthState.user = newUser;
        globalAuthState.isAdmin = newIsAdmin;
        globalAuthState.lastCheck = Date.now();
        globalAuthState.initialized = true;
      }
    },
    []
  );

  const validateAndLoadUser = useCallback(
    async (forceRefresh = false) => {
      if (!isMountedRef.current) return;

      // Evitar múltiplas inicializações
      if (globalAuthState.isInitializing && !forceRefresh) {
        return;
      }

      // Usar cache se válido
      const now = Date.now();
      if (
        !forceRefresh &&
        globalAuthState.initialized &&
        globalAuthState.user &&
        now - globalAuthState.lastCheck < CACHE_DURATION
      ) {
        updateAuthState(globalAuthState.user, globalAuthState.isAdmin, true);
        return;
      }

      globalAuthState.isInitializing = true;

      if (!forceRefresh) {
        startLoadingTimeout();
      }

      try {
        setError(null);
        if (forceRefresh) setLoading(true);

        // Verificar sessão com timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Session timeout")), 3000)
        );

        const { data, error: sessionError } = (await Promise.race([
          sessionPromise,
          timeoutPromise,
        ])) as any;

        if (sessionError) {
          console.error("Erro ao verificar sessão:", sessionError);
          updateAuthState(null, false);
          return;
        }

        if (!data.session?.user) {
          updateAuthState(null, false);
          return;
        }

        // Procurar dados do utilizador
        const userProfile = await fetchUserProfile(data.session.user.id);

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
        clearTimeouts();
      }
    },
    [updateAuthState, fetchUserProfile, startLoadingTimeout, clearTimeouts]
  );

  const refreshUser = useCallback(async () => {
    if (!isMountedRef.current) return;
    await validateAndLoadUser(true);
  }, [validateAndLoadUser]);

  const signOut = useCallback(async () => {
    try {
      clearTimeouts();

      // Limpar estado imediatamente
      updateAuthState(null, false);
      globalAuthState.user = null;
      globalAuthState.isAdmin = false;
      globalAuthState.lastCheck = 0;
      globalAuthState.initialized = true;

      clearUserCache();

      // Fazer logout no Supabase
      await supabase.auth.signOut();

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

      // Redirecionar
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Erro no logout:", error);
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  }, [updateAuthState, clearTimeouts]);

  // Inicialização do hook
  useEffect(() => {
    isMountedRef.current = true;

    // Se já foi inicializado, usar estado global
    if (globalAuthState.initialized) {
      updateAuthState(globalAuthState.user, globalAuthState.isAdmin, true);
      return;
    }

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
        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          const userProfile = await fetchUserProfile(session.user.id);

          if (userProfile && isMountedRef.current) {
            updateAuthState(userProfile.user, userProfile.isAdmin);
          } else if (isMountedRef.current) {
            updateAuthState(null, false);
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
      clearTimeouts();
      subscription.unsubscribe();
    };
  }, [validateAndLoadUser, updateAuthState, fetchUserProfile, clearTimeouts]);

  return {
    user,
    loading,
    isAdmin,
    error,
    refreshUser,
    signOut,
  };
};
