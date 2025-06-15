"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar se o utilizador já aceitou os cookies
    const hasAccepted = Cookies.get("cookie-consent");
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    // Guarda a preferência por 365 dias
    Cookies.set("cookie-consent", "true", { expires: 365 });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <circle cx="12" cy="12" r="10" fill="#F9D5A7" />
            <circle cx="8" cy="9" r="1.5" fill="#8B4513" />
            <circle cx="16" cy="9" r="1.5" fill="#8B4513" />
            <path
              d="M7 14.5C7 14.5 9 17 12 17C15 17 17 14.5 17 14.5"
              stroke="#8B4513"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="9" cy="12" r="0.8" fill="#D2691E" />
            <circle cx="15" cy="12" r="0.8" fill="#D2691E" />
            <circle cx="12" cy="14" r="0.8" fill="#D2691E" />
          </svg>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Utilizamos cookies para melhorar a sua experiência no site. Eles são
            necessários para funcionalidades essenciais como autenticação,
            preferências e análise de uso. Ao continuar, concorda com a nossa{" "}
            <a href="/privacidade" className="text-primary hover:underline">
              Política de Privacidade
            </a>
            .
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleAccept} variant="outline" size="sm">
            Aceitar e Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
