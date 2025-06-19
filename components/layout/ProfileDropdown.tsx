"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  User,
  LogOut,
  Settings,
  ChevronDown,
  LayoutDashboard,
  FileText,
  Calendar,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuthContext } from "../auth/AuthProvider";

export default function ProfileDropdown() {
  const { user, loading, isAdmin, signOut, refreshUser } = useAuthContext();
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Timeout de segurança para o loading do perfil (mais tolerante)
  useEffect(() => {
    if (loading) {
      // Limpar timeout anterior
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }

      // Configurar timeout de 30 segundos para o ProfileDropdown (mais tempo)
      loadingTimeoutRef.current = setTimeout(() => {
        if (loading) {
          console.warn(
            "ProfileDropdown: Timeout de loading atingido, tentando refresh"
          );
          refreshUser().catch((error) => {
            console.error("Erro ao refresh do ProfileDropdown:", error);
          });
        }
      }, 30000); // 30 segundos em vez de 8
    } else {
      // Limpar timeout se não estiver mais em loading
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    }

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [loading, refreshUser]);

  if (loading) {
    return (
      <Button
        size="sm"
        variant="outline"
        className="flex items-center gap-2 min-w-[120px]"
        disabled
      >
        <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></span>
        <span className="text-sm">A carregar...</span>
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
              aria-label="O meu perfil"
            >
              <Settings size={16} className="mr-2" />O Meu Perfil
            </Button>
          </Link>

          <Link href="/perfil/marcacoes" className="w-full">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm"
              tabIndex={0}
              aria-label="As minhas marcações"
            >
              <Calendar size={16} className="mr-2" />
              As Minhas Marcações
            </Button>
          </Link>

          <Link href="/perfil/avaliacoes" className="w-full">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm"
              tabIndex={0}
              aria-label="As minhas avaliações"
            >
              <Star size={16} className="mr-2" />
              As Minhas Avaliações
            </Button>
          </Link>

          <Link href="/perfil/faturas" className="w-full">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm"
              tabIndex={0}
              aria-label="As minhas faturas"
            >
              <FileText size={16} className="mr-2" />
              As Minhas Faturas
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
            onClick={signOut}
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
