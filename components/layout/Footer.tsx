"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { FaWhatsapp, FaPaypal } from "react-icons/fa";

const footerLinks = [
  {
    title: "Empresa",
    links: [
      { label: "Sobre Nós", href: "/sobre", id: "about" },
      { label: "Serviços", href: "/#servicos", id: "services-company" },
      { label: "Como Funciona", href: "/#como-funciona", id: "how-it-works" },
      { label: "Contactos", href: "/contactos", id: "contacts" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Termos de Uso", href: "/termos", id: "terms" },
      { label: "Política de Privacidade", href: "/privacidade", id: "privacy" },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e informações */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center space-x-2"
              aria-label="Relusa - Página Inicial"
            >
              <Image
                src="/svg_green.svg"
                alt="Logótipo Relusa"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <span className="font-poppins font-bold text-2xl text-gray-900 dark:text-white">
                Relusa
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Serviço de lavagem automóvel a seco, ecológico e profissional em
              Vila Nova de Gaia.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link
                href="https://instagram.com/relusa.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                aria-label="Instagram da Relusa"
              >
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="mailto:geral@relusa.pt"
                className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                aria-label="Email da Relusa"
              >
                <Mail size={20} />
                <span className="sr-only">Email</span>
              </Link>
              <Link
                href="tel:+351932440827"
                className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                aria-label="Telemóvel da Relusa"
              >
                <Phone size={20} />
                <span className="sr-only">Telemóvel</span>
              </Link>
              <Link
                href="https://wa.me/351932440827"
                className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                aria-label="WhatsApp da Relusa"
              >
                <FaWhatsapp className="w-5 h-5" />
              </Link>
              <Link
                href="https://www.paypal.com/paypalme/sirramboia"
                className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                aria-label="Paypal da Relusa"
              >
                <FaPaypal className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <nav
              key={group.title}
              className="space-y-4"
              aria-labelledby={`footer-${group.title.toLowerCase()}-heading`}
            >
              <h3
                id={`footer-${group.title.toLowerCase()}-heading`}
                className="font-medium text-gray-900 dark:text-white"
              >
                {group.title}
              </h3>
              <ul
                className="space-y-2"
                role="list"
                aria-labelledby={`footer-${group.title.toLowerCase()}-heading`}
              >
                {group.links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contactos */}
          <div className="space-y-4">
            <h3
              id="footer-contactos-heading"
              className="font-medium text-gray-900 dark:text-white"
            >
              Contactos
            </h3>
            <ul
              className="space-y-3"
              role="list"
              aria-labelledby="footer-contactos-heading"
            >
              <li className="flex items-start space-x-3">
                <MapPin
                  size={18}
                  className="text-primary mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  Vila Nova de Gaia, Portugal
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone
                  size={18}
                  className="text-primary flex-shrink-0"
                  aria-hidden="true"
                />
                <a
                  href="tel:+351932440827"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm"
                  aria-label="Ligar para Relusa: +351 932 440 827"
                >
                  (+351) 932 440 827
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail
                  size={18}
                  className="text-primary flex-shrink-0"
                  aria-hidden="true"
                />
                <a
                  href="mailto:geral@relusa.pt"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm"
                  aria-label="Enviar email para: geral@relusa.pt"
                >
                  geral@relusa.pt
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Instagram
                  size={18}
                  className="text-primary flex-shrink-0"
                  aria-hidden="true"
                />
                <a
                  href="https://instagram.com/relusa.pt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm"
                  aria-label="Instagram da Relusa: @relusa.pt"
                >
                  @relusa.pt
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-6">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            © {currentYear} Relusa. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
