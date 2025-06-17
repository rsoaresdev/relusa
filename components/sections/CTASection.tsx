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
    <section id="cta" className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <div
          className={`max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Column - Content */}
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold font-poppins mb-4 text-gray-900 dark:text-white">
                Pronto para uma lavagem impecável?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Agende agora a sua lavagem e desfrute de um serviço
                profissional, ecológico e conveniente.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "Serviço ao domicílio em Vila Nova de Gaia",
                  "Lavagem ecológica com produtos de qualidade",
                  "Processo rápido e eficiente",
                  "Emissão de fatura incluída",
                  "5ª lavagem com 50% de desconto",
                ].map((item, index) => (
                  <li
                    key={index}
                    className={`flex items-center space-x-3 transition-all duration-700 ${
                      isVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-10"
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <CheckCircle
                      size={18}
                      className="text-primary flex-shrink-0"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="space-y-4">
                <Button size="lg" className="w-full gap-2" asChild>
                  <Link href="/marcacoes">
                    <Calendar className="mr-1" size={18} />
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
                    Contactar-nos <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Gradient */}
            <div className="bg-gradient-to-br from-primary to-blue-700 p-8 md:p-12 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm">
                  <Calendar size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Agende Hoje</h3>
                <p className="mb-6 max-w-xs mx-auto">
                  Disponibilidade limitada. Garanta já o seu agendamento e tenha
                  o seu carro impecável.
                </p>
                <div className="inline-block rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium">
                  Promoção: 5ª lavagem com 50% de desconto!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
