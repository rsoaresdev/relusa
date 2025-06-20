"use client";

import { useEffect, useCallback } from "react";

interface TabSyncData {
  type: "AUTH_STATE_CHANGE" | "LOGOUT" | "LOGIN";
  data?: any;
  timestamp: number;
  tabId: string;
}

export const useTabSync = (
  onAuthStateChange?: (data: any) => void,
  onLogout?: () => void
) => {
  const tabId =
    typeof window !== "undefined"
      ? sessionStorage.getItem("tab-id") || Math.random().toString(36)
      : "";

  useEffect(() => {
    if (typeof window !== "undefined" && tabId) {
      sessionStorage.setItem("tab-id", tabId);
    }
  }, [tabId]);

  const broadcastToOtherTabs = useCallback(
    (type: TabSyncData["type"], data?: any) => {
      if (typeof window === "undefined") return;

      const message: TabSyncData = {
        type,
        data,
        timestamp: Date.now(),
        tabId,
      };

      try {
        localStorage.setItem("tab-sync-message", JSON.stringify(message));
        // Remove imediatamente para triggerar o evento em outros tabs
        setTimeout(() => {
          localStorage.removeItem("tab-sync-message");
        }, 100);
      } catch (error) {
        console.error("Erro ao broadcast para outros tabs:", error);
      }
    },
    [tabId]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "tab-sync-message" && e.newValue) {
        try {
          const message: TabSyncData = JSON.parse(e.newValue);

          // Ignorar mensagens da própria tab
          if (message.tabId === tabId) return;

          // Ignorar mensagens antigas (mais de 5 segundos)
          if (Date.now() - message.timestamp > 5000) return;

          switch (message.type) {
            case "AUTH_STATE_CHANGE":
              if (onAuthStateChange) {
                onAuthStateChange(message.data);
              }
              break;
            case "LOGOUT":
              if (onLogout) {
                onLogout();
              }
              break;
          }
        } catch (error) {
          console.error("Erro ao processar mensagem de sincronização:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [tabId, onAuthStateChange, onLogout]);

  return {
    broadcastToOtherTabs,
    tabId,
  };
};
