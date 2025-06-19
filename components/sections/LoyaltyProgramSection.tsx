"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Award, CheckCircle, Gift, ArrowRight } from "lucide-react";

export default function LoyaltyProgramSection() {
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

    const sectionRef = document.getElementById("fidelidade");
    if (sectionRef) observer.observe(sectionRef);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="fidelidade" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4 text-gray-900 dark:text-white">
            Programa de <span className="text-primary">Fidelidade</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Recompensamos a sua fidelidade. A cada lavagem, está mais próximo de
            um desconto especial.
          </p>
        </div>

        <div
          className={`max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-blue-50 dark:from-gray-800 dark:to-gray-800/80 rounded-2xl p-8 md:p-12 shadow-lg border border-primary/10 dark:border-primary/20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-shrink-0 flex items-center justify-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse"></div>
                <Award size={64} className="text-primary z-10" />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                5ª Lavagem com 50% de Desconto!
              </h3>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                A cada lavagem que faz connosco, acumula pontos no nosso
                programa de fidelidade. Na 5ª lavagem, oferecemos-lhe um
                desconto de 50% aplicado automaticamente.
              </p>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isVisible
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-95"
                      }`}
                      style={{
                        transitionDelay: `${i * 150}ms`,
                        backgroundColor: i < 5 ? "#0ea5e9" : "#e2e8f0",
                        color: "white",
                      }}
                    >
                      {i < 4 ? <CheckCircle size={20} /> : <Gift size={20} />}
                    </div>
                  ))}
                </div>

                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div
                    className="h-2 bg-primary rounded-full"
                    style={{ width: "80%" }}
                  ></div>
                </div>

                <div className="flex justify-between mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <span>1ª Lavagem</span>
                  <span>5ª Lavagem = Desconto!</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link href="/marcacoes" className="gap-2">
                    Começar Agora <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/marcacoes">Saber Mais</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div
            className={`inline-block bg-primary/10 dark:bg-primary/20 px-6 py-3 rounded-full transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <p className="text-primary font-medium">
              Não acumulamos apenas pontos, acumulamos a sua satisfação!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
