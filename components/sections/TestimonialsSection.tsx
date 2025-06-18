"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dados de testemunhos (futuramente podem vir de um JSON ou API)
const testimonials = [
  /*
  {
    id: 1,
    name: "João Silva",
    location: "Vila Nova de Gaia",
    avatar: "/images/avatars/avatar-1.jpg",
    rating: 5,
    text: "Serviço impecável! O meu carro ficou como novo, tanto por dentro como por fora. A lavagem a seco é realmente eficaz e não deixa resíduos. Recomendo vivamente!",
    car: "Renault Clio",
  },
  {
    id: 2,
    name: "Ana Ferreira",
    location: "Porto",
    avatar: "/images/avatars/avatar-2.jpg",
    rating: 5,
    text: "Excelente serviço! Muito conveniente poder ter o carro lavado sem sair de casa. O Rafael é muito profissional e cuidadoso com todos os detalhes. Voltarei a usar o serviço com certeza.",
    car: "Peugeot 208",
  },
  {
    id: 3,
    name: "Miguel Costa",
    location: "Vila Nova de Gaia",
    avatar: "/images/avatars/avatar-3.jpg",
    rating: 4,
    text: "Fiquei surpreendido com o resultado da lavagem a seco. Não conhecia o método, mas o carro ficou impecável e sem gastar água. O atendimento foi 5 estrelas!",
    car: "Volkswagen Golf",
  },
  {
    id: 4,
    name: "Carolina Santos",
    location: "Maia",
    avatar: "/images/avatars/avatar-4.jpg",
    rating: 5,
    text: "Já é a terceira vez que utilizo o serviço da Relusa e continuo impressionada com a qualidade. O interior do meu carro nunca esteve tão limpo e cheiroso!",
    car: "BMW Série 1",
  },
  {
    id: 5,
    name: "Pedro Oliveira",
    location: "Vila Nova de Gaia",
    avatar: "/images/avatars/avatar-5.jpg",
    rating: 5,
    text: "Serviço de excelência! O Rafael é muito atencioso e faz um trabalho minucioso. Recomendo a todos que valorizam a limpeza e o cuidado com o seu automóvel.",
    car: "Mercedes Classe A",
  },
  */
  {
    id: 1,
    name: "-",
    location: "Vila Nova de Gaia",
    avatar: "https://placehold.co/124",
    rating: 5,
    text: "Ainda não temos testemunhos.",
    car: "-",
  },
];

export default function TestimonialsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Controlo de visibilidade para animação
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

    const sectionRef = document.getElementById("testimonials");
    if (sectionRef) observer.observe(sectionRef);

    return () => observer.disconnect();
  }, []);

  // Autoplay dos testemunhos
  useEffect(() => {
    if (autoplay && testimonials.length > 1) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay]);

  // Navegação
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    if (autoplay) {
      setAutoplay(false);
      setTimeout(() => setAutoplay(true), 10000);
    }
  };

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
    if (autoplay) {
      setAutoplay(false);
      setTimeout(() => setAutoplay(true), 10000);
    }
  };

  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            O Que <span className="text-primary">Dizem</span> Os Nossos Clientes
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A satisfação dos nossos clientes é a nossa maior recompensa. Veja o
            que dizem sobre o nosso serviço.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto relative">
          {/* Main Testimonial */}
          <div
            className={`bg-card border border-border/50 rounded-2xl shadow-sm p-8 md:p-12 transition-all duration-700 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="absolute top-8 right-8 text-primary/10">
              <Quote size={48} />
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-border/50">
                  <Image
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={`${
                        i < testimonials[currentIndex].rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>

                <blockquote className="text-foreground text-lg leading-relaxed">
                  &quot;{testimonials[currentIndex].text}&quot;
                </blockquote>

                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground">
                    {testimonials[currentIndex].name}
                  </h4>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>{testimonials[currentIndex].location}</span>
                    <span className="mx-2">•</span>
                    <span>{testimonials[currentIndex].car}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls - Only show if more than 1 testimonial */}
          {testimonials.length > 1 && (
            <>
              <div className="flex justify-center mt-8 space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPrev}
                  className="rounded-full"
                  aria-label="Testemunho anterior"
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNext}
                  className="rounded-full"
                  aria-label="Próximo testemunho"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center mt-6 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentIndex
                        ? "bg-primary w-8"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`Ir para testemunho ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
