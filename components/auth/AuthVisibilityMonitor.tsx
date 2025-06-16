"use client";

import { useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/config";
import { toast } from "sonner";

interface AuthVisibilityMonitorProps {
  onSessionExpired?: () => void;
  onSessionRestored?: () => void;
  showToasts?: boolean;
}

/**
 * Componente para monitorizar a visibilidade da página e revalidar a autenticação
 * quando o utilizador volta ao separador após estar ausente.
 *
 * Isto resolve o problema de quando mudas de separador e voltas,
 * os dados de autenticação ficarem inacessíveis.
 */
export default function AuthVisibilityMonitor({
  onSessionExpired,
  onSessionRestored,
  showToasts = true,
}: AuthVisibilityMonitorProps) {
  const handleVisibilityChange = useCallback(async () => {
    // Só verificar quando a página volta a ficar visível
    if (document.hidden) return;

    try {
      // Verificar se a sessão ainda é válida
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error(
          "Erro ao verificar sessão após mudança de visibilidade:",
          error
        );
        return;
      }

      // Obter estado atual da sessão do localStorage
      const storedSession = localStorage.getItem("supabase.auth.token");
      const hasStoredSession = storedSession && storedSession !== "null";

      // Se não há sessão mas havia dados armazenados, a sessão expirou
      if (!session && hasStoredSession) {
        if (showToasts) {
          toast.error("Sessão expirou. Por favor, faça login novamente.");
        }
        onSessionExpired?.();
      }

      // Se há sessão mas não havia dados armazenados, a sessão foi restaurada
      if (session && !hasStoredSession) {
        if (showToasts) {
          toast.success("Sessão restaurada com sucesso.");
        }
        onSessionRestored?.();
      }

      // Verificar se o token está próximo do vencimento (menos de 5 minutos)
      if (session?.expires_at) {
        const expiresAt = new Date(session.expires_at * 1000);
        const now = new Date();
        const timeUntilExpiry = expiresAt.getTime() - now.getTime();
        const fiveMinutes = 5 * 60 * 1000;

        if (timeUntilExpiry < fiveMinutes && timeUntilExpiry > 0) {
          // Tentar renovar o token automaticamente
          try {
            const { error: refreshError } =
              await supabase.auth.refreshSession();
            if (refreshError) {
              console.error("Erro ao renovar sessão:", refreshError);
            } else {
              console.log("Sessão renovada automaticamente");
            }
          } catch (refreshError) {
            console.error("Erro inesperado ao renovar sessão:", refreshError);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao processar mudança de visibilidade:", error);
    }
  }, [onSessionExpired, onSessionRestored, showToasts]);

  useEffect(() => {
    // Só adicionar o listener no cliente
    if (typeof window === "undefined") return;

    // Adicionar listener para mudanças de visibilidade
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Também adicionar listeners para focus/blur da janela como backup
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  // Este componente não renderiza nada
  return null;
}
