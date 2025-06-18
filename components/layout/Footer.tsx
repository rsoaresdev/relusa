"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Mail, MapPin, Phone, Heart } from "lucide-react";
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
      className="bg-muted/30 border-t border-border/50"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-5 space-y-6">
            <Link
              href="/"
              className="flex items-center space-x-3 group"
              aria-label="Relusa - Página Inicial"
            >
              <Image
                src="/svg_green.svg"
                alt="Logótipo Relusa"
                width={36}
                height={36}
                className="w-9 h-9 object-contain transition-transform group-hover:scale-105"
              />
              <span className="font-semibold text-xl text-foreground">
                Relusa
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Serviço de lavagem automóvel a seco, ecológico e profissional em
              Vila Nova de Gaia. O seu carro não recusa.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                {
                  href: "https://instagram.com/relusa.pt",
                  icon: <Instagram size={20} />,
                  label: "Instagram da Relusa",
                  external: true,
                },
                {
                  href: "mailto:geral@relusa.pt",
                  icon: <Mail size={20} />,
                  label: "Email da Relusa",
                  external: false,
                },
                {
                  href: "tel:+351932440827",
                  icon: <Phone size={20} />,
                  label: "Telemóvel da Relusa",
                  external: false,
                },
                {
                  href: "https://wa.me/351932440827",
                  icon: <FaWhatsapp className="w-5 h-5" />,
                  label: "WhatsApp da Relusa",
                  external: true,
                },
                {
                  href: "https://www.paypal.com/paypalme/sirramboia",
                  icon: <FaPaypal className="w-5 h-5" />,
                  label: "Paypal da Relusa",
                  external: true,
                },
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  {...(social.external && {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })}
                  className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            {footerLinks.map((group) => (
              <nav
                key={group.title}
                className="space-y-4"
                aria-labelledby={`footer-${group.title.toLowerCase()}-heading`}
              >
                <h3
                  id={`footer-${group.title.toLowerCase()}-heading`}
                  className="font-semibold text-foreground"
                >
                  {group.title}
                </h3>
                <ul className="space-y-3" role="list">
                  {group.links.map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-semibold text-foreground">Contactos</h3>
            <div className="space-y-4">
              {[
                {
                  icon: <MapPin size={18} className="text-primary" />,
                  content: "Vila Nova de Gaia, Portugal",
                  href: null,
                },
                {
                  icon: <Phone size={18} className="text-primary" />,
                  content: "(+351) 932 440 827",
                  href: "tel:+351932440827",
                },
                {
                  icon: <Mail size={18} className="text-primary" />,
                  content: "geral@relusa.pt",
                  href: "mailto:geral@relusa.pt",
                },
                {
                  icon: <Instagram size={18} className="text-primary" />,
                  content: "@relusa.pt",
                  href: "https://instagram.com/relusa.pt",
                },
              ].map((contact, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="mt-0.5 flex-shrink-0">{contact.icon}</div>
                  {contact.href ? (
                    <Link
                      href={contact.href}
                      {...(contact.href.startsWith("http") && {
                        target: "_blank",
                        rel: "noopener noreferrer",
                      })}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {contact.content}
                    </Link>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {contact.content}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Relusa. Todos os direitos reservados.
            </p>
            <p className="text-sm text-muted-foreground">
              Lavagem automóvel a seco em Vila Nova de Gaia
            </p>
          </div>

          {/* Custom message */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              Feito com{" "}
              <Heart
                size={16}
                className="text-red-500 fill-red-500 animate-pulse"
              />{" "}
              em Vila Nova de Gaia, por{" "}
              <Link
                href="https://github.com/rsoaresdev"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                Rafael Soares
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
