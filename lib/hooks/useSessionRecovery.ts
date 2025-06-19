"use client";

import { useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/config";

export const useSessionRecovery = () => {
  // Função para tentar recuperar a sessão
  const attemptSessionRecovery = useCallback(async () => {
    try {
      console.log("Tentando recuperar sessão...");

      // Primeiro, tentar obter a sessão atual
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Erro ao obter sessão:", error);
        return false;
      }

      if (!session) {
        console.log("Nenhuma sessão encontrada");
        return false;
      }

      // Verificar se a sessão está válida
      const now = Math.floor(Date.now() / 1000);
      const expiresAt = session.expires_at || 0;

      if (now >= expiresAt) {
        console.log("Sessão expirada, tentando refresh...");
        const { data: refreshData, error: refreshError } =
          await supabase.auth.refreshSession();

        if (refreshError) {
          console.error("Erro ao fazer refresh da sessão:", refreshError);
          return false;
        }

        if (refreshData.session) {
          console.log("Sessão recuperada com sucesso");
          return true;
        }
      } else {
        console.log("Sessão válida encontrada");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Erro na recuperação de sessão:", error);
      return false;
    }
  }, []);

  // Monitorizar eventos de rede
  useEffect(() => {
    const handleOnline = () => {
      console.log("Conectividade restaurada, tentando recuperar sessão");
      attemptSessionRecovery();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Aplicação voltou ao foco, verificando sessão");
        // Aguardar um pouco antes de verificar para dar tempo ao browser
        setTimeout(() => {
          attemptSessionRecovery();
        }, 1000);
      }
    };

    // Adicionar listeners
    window.addEventListener("online", handleOnline);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Verificação periódica (a cada 5 minutos quando a app está ativa)
    const periodicCheck = setInterval(() => {
      if (document.visibilityState === "visible") {
        attemptSessionRecovery();
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => {
      window.removeEventListener("online", handleOnline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(periodicCheck);
    };
  }, [attemptSessionRecovery]);

  return { attemptSessionRecovery };
};
