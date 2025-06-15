import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-400 to-red-500"></div>
          
          <div className="p-8 md:p-10">
            <div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6 shadow-md">
              <AlertTriangle
                size={36}
                className="text-red-500 dark:text-red-400"
              />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-3 font-poppins">
              Erro na autenticação
            </h2>

            <div className="h-1 w-16 bg-red-400 mx-auto mb-6 rounded-full"></div>

            <p className="text-gray-600 dark:text-gray-300 text-center mb-8 leading-relaxed">
              Ocorreu um erro na autenticação. Por favor, tente novamente.
            </p>

            <div className="space-y-4">
              <Link
                href="/auth/login"
                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300 py-6 rounded-xl shadow-lg hover:shadow-primary/20 flex items-center justify-center text-white font-medium"
              >
                <RefreshCw size={18} className="mr-2" />
                Tentar novamente
              </Link>

              <Link
                href="/"
                className="w-full border-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 py-6 rounded-xl flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium"
              >
                <Home size={18} className="mr-2" />
                Ir para o início
              </Link>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">
              Se o problema persistir, por favor <a href="/contactos" className="text-primary font-semibold underline">contacte o nosso suporte</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
