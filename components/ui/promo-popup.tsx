"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Gift, PartyPopper } from "lucide-react";
import Cookies from "js-cookie";

export function PromoPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar se o popup já foi mostrado
    const hasShown = Cookies.get("promo-popup-shown");
    if (!hasShown) {
      // Pequeno delay para não mostrar imediatamente ao carregar a página
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    // Guarda que o popup já foi mostrado (por 30 dias)
    Cookies.set("promo-popup-shown", "true", { expires: 30 });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Gift className="w-16 h-16 text-primary" />
              <PartyPopper className="w-8 h-8 text-yellow-500 absolute -top-2 -right-2 transform rotate-12" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Oferta Especial!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Na sua 5ª lavagem, oferecemos-lhe 50% de desconto! 🎉
          </p>
          <div className="bg-primary/5 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 dark:text-gray-200">
              Acumule pontos a cada lavagem e na 5ª aproveite este desconto
              incrível. Quanto mais lava, mais poupa!
            </p>
          </div>
          <Button onClick={handleClose} className="w-full">
            Entendi, obrigado!
          </Button>
        </div>
      </div>
    </div>
  );
}
