"use client";

import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import BookingAuthWrapper from "./BookingAuthWrapper";

const BookingAuthWrapperFallback = () => {
  const [showRefresh, setShowRefresh] = useState(false);

  useEffect(() => {
    // Mostrar botão de refresh após 10 segundos
    const timer = setTimeout(() => {
      setShowRefresh(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="text-center max-w-md">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          A carregar sistema de marcações...
        </p>
        {showRefresh && (
          <div className="space-y-2">
            <p className="text-xs text-gray-400">
              O carregamento está a demorar mais do que o esperado.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="gap-2"
            >
              <RefreshCw size={16} />
              Recarregar página
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function BookingAuthWrapperSuspense() {
  return (
    <Suspense fallback={<BookingAuthWrapperFallback />}>
      <BookingAuthWrapper />
    </Suspense>
  );
}
