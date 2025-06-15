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
      className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4 text-gray-900 dark:text-white">
            Os Nossos <span className="text-primary">Serviços</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Oferecemos serviços de lavagem automóvel a seco, profissionais e
            ecológicos, adaptados às suas necessidades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {service.popular && (
                <div className="absolute top-4 right-4 bg-primary text-white px-4 py-1.5 rounded-full text-sm font-medium z-10 flex items-center gap-1.5 shadow-lg">
                  <Star size={14} className="fill-white" />
                  Mais Popular
                </div>
              )}

              <div className="relative h-56 w-full">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {service.description}
                    </p>
                  </div>
                  <div className="text-3xl font-bold text-primary bg-primary/10 dark:bg-primary/20 px-4 py-2 rounded-lg">
                    {service.price}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="bg-primary/10 dark:bg-primary/20 p-1.5 rounded-full">
                        <Check
                          size={16}
                          className="text-primary flex-shrink-0"
                        />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full gap-2 py-6 text-base font-medium"
                  asChild
                >
                  <Link href="/marcacoes">
                    Escolher <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 max-w-3xl mx-auto border border-primary/10 dark:border-primary/20 shadow-sm">
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
              <span className="font-bold text-primary">Promoção Especial:</span>{" "}
              Na 5ª lavagem, obtém 50% de desconto em qualquer serviço!
            </p>
            <Button variant="outline" size="lg" className="gap-2" asChild>
              <Link href="/marcacoes">
                Ver Todos os Serviços <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
