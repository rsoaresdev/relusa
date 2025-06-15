"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";

const menuItems = [
  { label: "Início", href: "/" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Como Funciona", href: "/#como-funciona" },
  { label: "Sobre Nós", href: "/sobre" },
  { label: "Contactos", href: "/contactos" },
  { label: "Marcações", href: "/marcacoes", highlight: true },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/svg_green.svg"
              alt="Relusa"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
            />
            <span className="font-poppins font-bold text-2xl text-gray-900 dark:text-white">
              Relusa
            </span>
          </Link>

          {/* Menu desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative font-medium text-sm transition-colors hover:text-primary ${
                  item.highlight
                    ? "text-primary font-semibold"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
            ))}
            <div className="ml-2">
              <ProfileDropdown />
            </div>
          </nav>

          {/* Menu mobile - apenas botão de menu */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg py-4 px-4 border-t border-gray-200 dark:border-gray-800 animate-in slide-in-from-top">
          <nav className="flex flex-col space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`px-4 py-2 rounded-md transition-colors ${
                  item.highlight
                    ? "text-primary font-semibold"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {/* ProfileDropdown apenas no menu mobile */}
            <div className="px-4 py-2">
              <ProfileDropdown />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
