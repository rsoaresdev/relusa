"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Calendar,
  User,
  Star,
  FileText,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import ProfileDropdown from "./ProfileDropdown";

const navigation = [
  { name: "Início", href: "/" },
  { name: "Serviços", href: "/#servicos" },
  { name: "Como Funciona", href: "/#como-funciona" },
  { name: "Sobre Nós", href: "/sobre" },
  { name: "Contactos", href: "/contactos" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading, isAdmin, signOut } = useAuthContext();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-12 flex items-center justify-center">
              <Image
                src="/svg_green.svg"
                alt="Relusa Logo"
                width={40}
                height={48}
                className="max-w-full max-h-full transition-transform group-hover:scale-105 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-foreground">Relusa</span>
              <span className="text-xs text-muted-foreground font-medium -mt-0.5">
                O seu carro não recusa
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {item.name}
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Mostrar botão imediatamente, mesmo durante loading */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Button
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-6"
                  asChild
                >
                  <Link href="/marcacoes">
                    <Calendar size={18} />
                    Nova Marcação
                  </Link>
                </Button>
                <ProfileDropdown />
              </div>
            ) : (
              <Button
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-6"
                asChild
                disabled={loading}
              >
                <Link href="/marcacoes">
                  <Calendar size={18} />
                  {loading ? "A carregar..." : "Fazer Marcação"}
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-foreground" />
            ) : (
              <Menu size={24} className="text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-6 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-4 space-y-3">
                {user ? (
                  <>
                    <Button
                      size="lg"
                      className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg font-semibold"
                      asChild
                    >
                      <Link
                        href="/marcacoes"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Calendar size={18} />
                        Nova Marcação
                      </Link>
                    </Button>

                    {/* Separador para as opções do perfil */}
                    <div className="border-t border-border/50 pt-3 mt-4">
                      <p className="text-sm font-medium text-muted-foreground mb-2 px-4">
                        Olá, {user.name?.split(" ")[0] || "Cliente"}
                      </p>

                      <div className="space-y-1">
                        <Link
                          href="/perfil"
                          className="flex items-center gap-2 px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <User size={18} />O Meu Perfil
                        </Link>

                        <Link
                          href="/perfil/marcacoes"
                          className="flex items-center gap-2 px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Calendar size={18} />
                          As Minhas Marcações
                        </Link>

                        <Link
                          href="/perfil/avaliacoes"
                          className="flex items-center gap-2 px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Star size={18} />
                          As Minhas Avaliações
                        </Link>

                        <Link
                          href="/perfil/faturas"
                          className="flex items-center gap-2 px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <FileText size={18} />
                          As Minhas Faturas
                        </Link>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2 px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <LayoutDashboard size={18} />
                            Administração
                          </Link>
                        )}

                        <button
                          onClick={() => {
                            signOut();
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-2 px-4 py-3 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50 rounded-lg transition-colors w-full text-left"
                        >
                          <LogOut size={18} />
                          Terminar sessão
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <Button
                    size="lg"
                    className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg font-semibold"
                    asChild
                    disabled={loading}
                  >
                    <Link
                      href="/marcacoes"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Calendar size={18} />
                      {loading ? "A carregar..." : "Fazer Marcação"}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
