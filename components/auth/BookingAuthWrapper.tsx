"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { supabase, performLogout } from "@/lib/supabase/config";
import { toast } from "sonner";
import AuthForm from "./AuthForm";
import BookingForm from "../forms/BookingForm";
import UserDashboard from "../dashboard/UserDashboard";

export default function BookingAuthWrapper() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<
    "login" | "register" | "booking" | "dashboard"
  >("login");
  const searchParams = useSearchParams();
  const mountedRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Função para verificar sessão quando a página volta a ficar visível
  const handleVisibilityChange = useCallback(async () => {
    if (!document.hidden && !loading) {
      // Página voltou a ficar visível, verificar se a sessão ainda é válida
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Erro ao verificar sessão após visibilidade:", error);
          return;
        }

        // Se não há sessão mas tínhamos uma sessão, limpar estado
        if (!data.session && session) {
          setSession(null);
          setView("login");
          toast.error("Sessão expirou. Por favor, faça login novamente.");
        }

        // Se há sessão mas não temos sessão local, recarregar
        if (data.session && !session) {
          setSession(data.session);
          setView("dashboard");
        }
      } catch (error) {
        console.error("Erro ao processar mudança de visibilidade:", error);
      }
    }
  }, [loading, session]);

  useEffect(() => {
    mountedRef.current = true;

    // Timeout de segurança principal - 8 segundos
    timeoutRef.current = setTimeout(() => {
      if (mountedRef.current && loading) {
        console.warn("BookingAuthWrapper: Timeout de loading atingido");
        setLoading(false);
      }
    }, 8000);

    // Verificar se há erros na URL
    const error = searchParams.get("error");
    if (error) {
      if (error === "auth_failed") {
        toast.error("Erro na autenticação. Tente novamente.");
      } else if (error === "callback_failed") {
        toast.error("Erro no processamento do login. Tente novamente.");
      }
    }

    // Verificar se há tokens OAuth na URL (implicit flow)
    const hasOAuthTokens =
      searchParams.get("access_token") ||
      searchParams.get("refresh_token") ||
      window.location.hash.includes("access_token");

    // Função para verificar e processar a sessão
    const processSession = async (currentSession: any) => {
      if (!mountedRef.current) return;

      if (currentSession?.user) {
        // Verificar se o utilizador existe na BD
        const { data: existingUser } = await supabase
          .from("users")
          .select("*")
          .eq("id", currentSession.user.id)
          .single();

        // Se não existe, criar
        if (!existingUser) {
          await supabase.from("users").insert([
            {
              id: currentSession.user.id,
              email: currentSession.user.email || "",
              name:
                currentSession.user.user_metadata?.full_name ||
                currentSession.user.user_metadata?.name ||
                "Utilizador",
              phone: "",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);

          // Criar pontos de fidelidade
          await supabase.from("loyalty_points").insert([
            {
              user_id: currentSession.user.id,
              points: 0,
              bookings_count: 0,
            },
          ]);
        }

        if (mountedRef.current) {
          setSession(currentSession);
          setView("dashboard");
          setLoading(false);

          // Limpar timeout de segurança
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }

          // Se há tokens OAuth na URL, limpar a URL
          if (hasOAuthTokens) {
            window.history.replaceState({}, document.title, "/marcacoes");
          }
        }
      } else {
        if (mountedRef.current) {
          setSession(null);
          setView("login");
          setLoading(false);

          // Limpar timeout de segurança
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        }
      }
    };

    // Verificação inicial com retry para OAuth
    const checkInitialSession = async (retryCount = 0) => {
      try {
        // Se há tokens OAuth na URL, aguardar mais tempo para o Supabase processar
        if (hasOAuthTokens && retryCount === 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          if (mountedRef.current) {
            setLoading(false);
            // Limpar timeout de segurança
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
          }
          return;
        }

        await processSession(data.session);

        // Se não há sessão e é a primeira tentativa, tentar novamente após um delay
        // Isso ajuda com OAuth callbacks que podem demorar a processar
        if (!data.session && retryCount < 2 && hasOAuthTokens) {
          setTimeout(() => {
            if (mountedRef.current) {
              checkInitialSession(retryCount + 1);
            }
          }, 1000);
        }
      } catch (error) {
        console.error("Erro ao verificar sessão inicial:", error);
        if (mountedRef.current) {
          setLoading(false);
          // Limpar timeout de segurança
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        }
      }
    };

    checkInitialSession();

    // Listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mountedRef.current) {
        await processSession(session);
      }
    });

    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      subscription.unsubscribe();
    };
  }, [searchParams]);

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

  const handleLogout = async () => {
    try {
      await performLogout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Fallback: forçar refresh mesmo assim
      window.location.href = "/";
    }
  };

  const toggleView = () => {
    setView(view === "login" ? "register" : "login");
  };

  const goToBookingForm = () => setView("booking");
  const goToDashboard = () => setView("dashboard");

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            A verificar autenticação...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return (
      <div className="max-w-md mx-auto">
        <AuthForm view={view as "login" | "register"} toggleView={toggleView} />
      </div>
    );
  }

  // Authenticated
  return (
    <div>
      {view === "dashboard" ? (
        <UserDashboard
          session={session}
          onLogout={handleLogout}
          onNewBooking={goToBookingForm}
        />
      ) : (
        <BookingForm session={session} onCancel={goToDashboard} />
      )}
    </div>
  );
}
