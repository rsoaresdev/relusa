"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "./AuthProvider";

interface AuthDebugProps {
  enabled?: boolean;
}

export const AuthDebug = ({ enabled = false }: AuthDebugProps) => {
  const { user, loading, isAdmin, error } = useAuthContext();
  const [tabId, setTabId] = useState<string>("");
  const [authState, setAuthState] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = sessionStorage.getItem("tab-id") || "unknown";
      setTabId(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("relusa-auth-state");
      if (stored) {
        try {
          setAuthState(JSON.parse(stored));
        } catch (error) {
          console.error("Erro ao ler estado de auth:", error);
        }
      }
    }
  }, [user, loading, isAdmin]);

  if (!enabled || process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono max-w-sm z-50">
      <div className="mb-2 font-bold text-yellow-400">Auth Debug</div>
      <div className="space-y-1">
        <div>Tab ID: {tabId.slice(0, 8)}...</div>
        <div>Loading: {loading ? "true" : "false"}</div>
        <div>User: {user ? user.name : "null"}</div>
        <div>Admin: {isAdmin ? "true" : "false"}</div>
        <div>Error: {error || "null"}</div>
        {authState && (
          <div className="mt-2 pt-2 border-t border-gray-600">
            <div className="text-yellow-400">LocalStorage:</div>
            <div>User: {authState.user?.name || "null"}</div>
            <div>Admin: {authState.isAdmin ? "true" : "false"}</div>
            <div>
              Age: {Math.round((Date.now() - authState.timestamp) / 1000)}s
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
