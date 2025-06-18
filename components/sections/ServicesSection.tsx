"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Star } from "lucide-react";

const services = [
  {
    id: "completo",
    title: "Pack Completo",
    price: "18€",
    originalPrice: "22€",
    description: "Lavagem interior e exterior completa",
    image: "/limpeza-completa.webp",
    features: [
      "Lavagem exterior a seco",
      "Limpeza de jantes",
      "Aspiração completa",
      "Limpeza de vidros",
      "Limpeza de painéis",
      "Brilho de pneus",
      "Polimento de faróis",
      "Acabamento cerâmico",
      "Ambientador",
    ],
    popular: true,
    savings: "4€",
  },
  {
    id: "exterior",
    title: "Lavagem Exterior",
    price: "12€",
    description: "Apenas lavagem exterior do veículo",
    image: "/lavagem-exterior.webp",
    features: [
      "Lavagem exterior a seco",
      "Limpeza de jantes",
      "Limpeza de vidros exteriores",
      "Polimento de faróis",
      "Brilho de pneus",
      "Acabamento cerâmico",
    ],
    popular: false,
  },
];

export default function ServicesSection() {
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

    const sectionRef = document.getElementById("servicos");
    if (sectionRef) observer.observe(sectionRef);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="servicos"
      className="py-24 bg-gradient-to-b from-muted/50 to-background"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Os Nossos <span className="text-primary">Serviços</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Escolha o serviço que melhor se adapta às suas necessidades. Todos
            incluem produtos premium e garantia de qualidade.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`group relative rounded-3xl overflow-hidden bg-card border border-border/50 hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-700 flex flex-col ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Badge Container */}
              <div className="absolute top-6 right-6 z-10 flex flex-col gap-2">
                {service.popular && (
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
                    <Star size={16} className="fill-current" />
                    Mais Popular
                  </div>
                )}
              </div>

              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                {/* Overlay gradient for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              <div className="p-8 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <div className="ml-6 text-right">
                    {service.originalPrice ? (
                      <div className="space-y-1">
                        <div className="text-3xl font-bold text-primary bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
                          {service.price}
                        </div>
                        <div className="text-sm text-muted-foreground line-through opacity-70">
                          {service.originalPrice}
                        </div>
                      </div>
                    ) : (
                      <div className="text-3xl font-bold text-primary bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
                        {service.price}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-8 flex-1">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <Check size={12} className="text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Button at bottom */}
                <div className="mt-auto">
                  <Button
                    className="w-full gap-2 h-12 text-base font-medium"
                    variant={
                      service.id === "exterior" ? "secondary" : "default"
                    }
                    asChild
                  >
                    <Link href="/marcacoes">
                      Escolher Serviço
                      <ArrowRight size={18} />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Promotion Section */}
        <div className="mt-20 text-center">
          <div className="relative bg-gradient-to-br from-primary/5 via-primary/3 to-primary/5 border border-primary/10 rounded-3xl p-12 max-w-4xl mx-auto shadow-sm overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/3 rounded-full blur-3xl"></div>

            <div className="relative space-y-8">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center border border-primary/20">
                <Star className="text-primary" size={32} />
              </div>

              <div className="space-y-4 max-w-3xl mx-auto">
                <h3 className="text-3xl font-bold text-foreground">
                  <span className="text-primary">Programa de Fidelidade</span>
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Na 5ª lavagem, obtém{" "}
                  <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                    50% de desconto
                  </span>{" "}
                  em qualquer serviço! Cada marcação conta para o seu programa
                  de fidelidade e todos os clientes são automaticamente
                  incluídos.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 text-primary font-medium">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span>Desconto aplicado automaticamente</span>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
