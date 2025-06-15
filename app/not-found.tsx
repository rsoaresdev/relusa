"use client";

import Link from "next/link";
import { Frown, Home, LifeBuoy, RefreshCw } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 animate-fadeIn">
      <div className="text-center max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="relative mb-6">
          <h1 className="text-8xl font-extrabold text-primary mb-2 animate-pulse">404</h1>
          <div className="absolute top-1/2 right-1/4 transform -translate-y-1/2">
            <Frown size={60} className="text-primary animate-bounce" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Ups! Página Não Encontrada
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Parece que esta página decidiu tirar férias ou nunca existiu. 
          Talvez tenha sido abduzida por aliens?
        </p>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-all transform hover:scale-105 shadow-md"
          >
            <Home size={18} />
            Voltar à Página Inicial
          </Link>
          
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-full font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          >
            <RefreshCw size={18} className="animate-spin-slow" />
            Tentar Novamente
          </button>
          
          <div className="pt-2">
            <Link
              href="/contactos"
              className="flex items-center justify-center gap-2 text-primary hover:underline"
            >
              <LifeBuoy size={16} />
              Contactar Suporte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}