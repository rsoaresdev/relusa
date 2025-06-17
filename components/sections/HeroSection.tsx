"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Droplets,
  Clock,
  CalendarCheck,
  Award,
  Receipt,
} from "lucide-react";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary/25 blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-blue-500/25 blur-2xl animate-pulse"></div>
        <div className="absolute top-40 left-1/4 w-48 h-48 rounded-full bg-green-500/25 blur-2xl animate-pulse"></div>
        <div className="absolute bottom-40 right-1/4 w-56 h-56 rounded-full bg-primary/25 blur-2xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div
            className={`space-y-8 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold font-poppins text-gray-900 dark:text-white leading-tight">
                <span className="text-primary">Lavagem automóvel</span> a seco
                profissional e ecológica
              </h1>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
                Serviço de lavagem a seco em Vila Nova de Gaia.{" "}
                <span className="relative inline-block">
                  <span className="font-medium">O seu carro não recusa.</span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-pulse"></span>
                </span>
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/marcacoes" className="gap-2">
                  <CalendarCheck className="h-4 w-4" />
                  Agendar Lavagem <ArrowRight size={16} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/#servicos">Ver Serviços</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
              {[
                {
                  icon: <Droplets className="text-primary" size={24} />,
                  title: "Ecológico",
                  description: "Apenas 1L de água por lavagem",
                },
                {
                  icon: <Clock className="text-primary" size={24} />,
                  title: "Rápido",
                  description: "Pronto em apenas 1 hora",
                },
                {
                  icon: <Award className="text-primary" size={24} />,
                  title: "Qualidade",
                  description: "Só usamos produtos premium de alta qualidade",
                },
                {
                  icon: <Receipt className="text-primary" size={24} />,
                  title: "Fatura",
                  description: "Emitimos fatura para todos os serviços",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center p-4 rounded-xl bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-700 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="mb-3">{feature.icon}</div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/hero.webp"
                alt="Lavagem de carro a seco Relusa"
                fill
                className="object-cover brightness-75"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

              {/* Promotion badge */}
              <div className="absolute top-6 right-6 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                5ª lavagem com 50% desconto!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
