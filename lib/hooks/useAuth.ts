import { useState, useEffect, useCallback, useRef } from "react";
import { supabase, User } from "@/lib/supabase/config";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";

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
  const mounted = useRef(true);

  // Função para buscar perfil do utilizador
  const fetchUserProfile = useCallback(
    async (
      userId: string
    ): Promise<{ user: User; isAdmin: boolean } | null> => {
      try {
        const [userResponse, adminResponse] = await Promise.all([
          supabase.from("users").select("*").eq("id", userId).single(),
          supabase.from("admins").select("id").eq("user_id", userId).single(),
        ]);

        // Se o utilizador não existe, criar um novo
        if (userResponse.error?.code === "PGRST116") {
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

  // Função para atualizar estado do auth
  const updateAuthState = useCallback(
    async (session: Session | null) => {
      if (!mounted.current) return;

      try {
        setError(null);

        if (!session?.user) {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const userProfile = await fetchUserProfile(session.user.id);

        if (mounted.current) {
          if (userProfile) {
            setUser(userProfile.user);
            setIsAdmin(userProfile.isAdmin);
          } else {
            setUser(null);
            setIsAdmin(false);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Erro ao atualizar estado de auth:", error);
        if (mounted.current) {
          setError("Erro ao verificar autenticação");
          setLoading(false);
        }
      }
    },
    [fetchUserProfile]
  );

  // Função para refresh do utilizador
  const refreshUser = useCallback(async () => {
    if (!mounted.current) return;

    try {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      await updateAuthState(data.session);
    } catch (error) {
      console.error("Erro ao refresh do utilizador:", error);
      if (mounted.current) {
        setError("Erro ao atualizar utilizador");
        setLoading(false);
      }
    }
  }, [updateAuthState]);

  // Função de logout
  const signOut = useCallback(async () => {
    try {
      // Limpar estado local primeiro
      setUser(null);
      setIsAdmin(false);
      setError(null);

      // Terminar sessão no Supabase
      await supabase.auth.signOut();

      // Limpar localStorage manualmente
      if (typeof window !== "undefined") {
        try {
          const keys = Object.keys(localStorage);
          keys.forEach((key) => {
            if (key.includes("supabase") || key.includes("auth")) {
              localStorage.removeItem(key);
            }
          });
        } catch (error) {
          console.error("Erro ao limpar localStorage:", error);
        }
      }

      // Redirecionar para home
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Erro no logout:", error);
      // Forçar redirecionamento mesmo com erro
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  }, []);

  // Effect principal para inicialização e listener de auth
  useEffect(() => {
    mounted.current = true;

    // Função para inicializar
    const initialize = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        await updateAuthState(data.session);
      } catch (error) {
        console.error("Erro na inicialização:", error);
        if (mounted.current) {
          setError("Erro ao inicializar autenticação");
          setLoading(false);
        }
      }
    };

    // Inicializar
    initialize();

    // Listener para mudanças de auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log("Auth state change:", event, !!session);

        if (!mounted.current) return;

        // Para eventos de logout, limpar estado imediatamente
        if (event === "SIGNED_OUT") {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Para outros eventos, atualizar estado
        await updateAuthState(session);
      }
    );

    // Cleanup
    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, [updateAuthState]);

  return {
    user,
    loading,
    isAdmin,
    error,
    refreshUser,
    signOut,
  };
};
