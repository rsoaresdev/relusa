"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, CheckCircle } from "lucide-react";

export default function CTASection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const sectionRef = document.getElementById("cta");
    if (sectionRef) observer.observe(sectionRef);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="cta" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div
          className={`max-w-5xl mx-auto bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column - Content */}
            <div className="p-8 md:p-12 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">
                  Pronto para uma lavagem impecável?
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Agende agora a sua lavagem e desfrute de um serviço
                  profissional, ecológico e conveniente.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  "Serviço ao domicílio em Vila Nova de Gaia",
                  "Lavagem ecológica com produtos de qualidade",
                  "Processo rápido e eficiente",
                  "Emissão de fatura incluída",
                  "5ª lavagem com 50% de desconto",
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 transition-all duration-700 ${
                      isVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-10"
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={12} className="text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <Button size="lg" className="w-full gap-2" asChild>
                  <Link href="/marcacoes">
                    <Calendar size={18} />
                    Agendar Lavagem
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full gap-2"
                  asChild
                >
                  <Link href="/contactos">
                    Contactar-nos
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Highlight */}
            <div className="bg-primary/5 p-8 md:p-12 flex items-center justify-center border-l border-border/50">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Calendar size={32} className="text-primary" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-foreground">
                    Agende Hoje
                  </h3>
                  <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    Disponibilidade limitada. Garanta já o seu agendamento e
                    tenha o seu carro impecável.
                  </p>
                </div>

                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-sm font-medium text-primary">
                    Promoção: 5ª lavagem com 50% desconto!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
