"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  LogOut,
  Settings,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  supabase,
  getCurrentUser,
  User as UserType,
  isUserAdmin,
  performLogout,
} from "@/lib/supabase/config";

export default function ProfileDropdown() {
  const [user, setUser] = useState<UserType | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchUserData = async () => {
    try {
      // Verificar primeiro se temos uma sessão ativa
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Se temos sessão, procurar os dados do utilizador
      const userData = await getCurrentUser();

      if (userData) {
        setUser(userData);
        // Verificar se o utilizador é administrador
        const adminStatus = await isUserAdmin(userData.id);
        setIsAdmin(adminStatus);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Erro ao obter dados do utilizador:", error);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    // Só executar se ainda não foi inicializado
    if (!isInitialized) {
      fetchUserData();
    }

    // Configurar listener para alterações de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          // Só refetch se realmente mudou a sessão
          if (session?.user) {
            await fetchUserData();
          }
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [isInitialized]);

  const handleLogout = async () => {
    try {
      await performLogout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Fallback: forçar refresh mesmo assim
      window.location.href = "/";
    }
  };

  if (loading) {
    return (
      <Button
        size="sm"
        variant="outline"
        className="flex items-center gap-2"
        disabled
      >
        <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></span>
        <span className="sr-only">A carregar...</span>
      </Button>
    );
  }

  if (!user) {
    return (
      <Link href="/marcacoes">
        <Button size="sm" variant="outline" className="flex items-center gap-2">
          <User size={16} />
          Entrar
        </Button>
      </Link>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          aria-label="Perfil"
          tabIndex={0}
        >
          <User size={16} />
          <span className="max-w-[100px] truncate">{user.name}</span>
          <ChevronDown size={14} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="end">
        <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <p className="font-medium text-sm">{user.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {user.email}
          </p>
        </div>
        <div className="p-2 flex flex-col gap-1">
          <Link href="/perfil" className="w-full">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm"
              tabIndex={0}
              aria-label="Configurações de perfil"
            >
              <Settings size={16} className="mr-2" />
              Configurações
            </Button>
          </Link>

          {isAdmin && (
            <Link href="/admin" className="w-full">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm"
                tabIndex={0}
                aria-label="Painel de Administração"
              >
                <LayoutDashboard size={16} className="mr-2" />
                Administração
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
            tabIndex={0}
            aria-label="Terminar sessão"
          >
            <LogOut size={16} className="mr-2" />
            Terminar sessão
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
