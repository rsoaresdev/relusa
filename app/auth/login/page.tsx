"use client";

import { useState, useEffect } from "react";
import { AuthForm } from "@/components/auth";
import { motion } from "framer-motion";
import { Loader2, Lock } from "lucide-react";

export default function LoginPage() {
  const [view, setView] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Apenas definir loading como false - não redirecionar automaticamente
    setLoading(false);
  }, []);

  const toggleView = () => {
    setView((current) => (current === "login" ? "register" : "login"));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-8 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl"
        >
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            A verificar sessão...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-16 px-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
        <div className="absolute w-96 h-96 rounded-full bg-primary/30 blur-3xl -top-20 -left-20"></div>
        <div className="absolute w-96 h-96 rounded-full bg-blue-400/30 blur-3xl bottom-20 right-10"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100/50 dark:border-gray-700/50">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-blue-400 to-primary"></div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-8 md:p-10"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.3,
                }}
                className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center shadow-lg shadow-primary/20"
              >
                <Lock className="h-10 w-10 text-primary" />
              </motion.div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-3 font-poppins">
              {view === "login" ? "Bem-vindo de volta" : "Criar uma conta"}
            </h1>

            <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
              {view === "login"
                ? "Entre para aceder à sua conta e gerir as suas marcações"
                : "Registe-se para começar a agendar os seus serviços"}
            </p>

            <div className="h-1 w-24 bg-gradient-to-r from-primary/40 to-primary/80 mx-auto mb-8 rounded-full"></div>

            <motion.div
              key={view}
              initial={{ opacity: 0, x: view === "login" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AuthForm view={view} toggleView={toggleView} />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Ao continuar, concorda com os nossos{" "}
            <a
              href="/termos"
              className="text-primary hover:underline font-medium"
            >
              Termos de Serviço
            </a>{" "}
            e{" "}
            <a
              href="/privacidade"
              className="text-primary hover:underline font-medium"
            >
              Política de Privacidade
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
