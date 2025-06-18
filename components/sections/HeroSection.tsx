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
    <section className="relative min-h-screen flex items-center pt-20 pb-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Content */}
          <div
            className={`space-y-8 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-primary">Lavagem automóvel</span>
                <br />a seco profissional
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Serviço de lavagem a seco em Vila Nova de Gaia.{" "}
                <span className="font-medium text-foreground">
                  O seu carro não recusa.
                </span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="text-base">
                <Link href="/marcacoes" className="gap-2">
                  <CalendarCheck className="h-5 w-5" />
                  Agendar Lavagem
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <Link href="/#servicos">Ver Serviços</Link>
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 pt-6 max-w-2xl mx-auto">
              {[
                {
                  icon: <Droplets className="text-white" size={20} />,
                  title: "Ecológico",
                  description: "Apenas 1L de água",
                  gradient: "from-blue-500/80 to-cyan-500/80",
                  bgColor: "bg-blue-500/80",
                },
                {
                  icon: <Clock className="text-white" size={20} />,
                  title: "Rápido",
                  description: "Pronto em 1 hora",
                  gradient: "from-green-500/80 to-emerald-500/80",
                  bgColor: "bg-green-500/80",
                },
                {
                  icon: <Award className="text-white" size={20} />,
                  title: "Qualidade",
                  description: "Produtos premium",
                  gradient: "from-purple-500/80 to-violet-500/80",
                  bgColor: "bg-purple-500/80",
                },
                {
                  icon: <Receipt className="text-white" size={20} />,
                  title: "Fatura",
                  description: "Para todos os serviços",
                  gradient: "from-orange-500/80 to-amber-500/80",
                  bgColor: "bg-orange-500/80",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`group relative p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/30 hover:bg-white/90 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 shadow-sm hover:shadow-md ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                    >
                      {feature.icon}
                    </div>
                    <div className="flex-1 px-4">
                      <h3 className="font-bold text-base text-gray-900 group-hover:text-gray-700 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Enhanced glow effect */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}
                  />

                  {/* Subtle border glow */}
                  <div
                    className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}
                    style={{
                      mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      maskComposite: "xor",
                    }}
                  />
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
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:max-w-none">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/20 to-primary/5 transform rotate-3"></div>
              <div className="relative h-full rounded-2xl overflow-hidden shadow-2xl border border-border/50">
                <Image
                  src="/hero.webp"
                  alt="Lavagem de carro a seco Relusa"
                  fill
                  className="object-cover"
                  priority
                />

                {/* Promotion Badge */}
                <div className="absolute top-6 right-6 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  5ª lavagem com 50% desconto!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
