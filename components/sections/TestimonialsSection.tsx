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
    if (autoplay) {
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
    <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4 text-gray-900 dark:text-white">
            O Que <span className="text-primary">Dizem</span> Os Nossos Clientes
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A satisfação dos nossos clientes é a nossa maior recompensa. Veja o
            que dizem sobre o nosso serviço.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto relative">
          {/* Main Testimonial */}
          <div
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-all duration-700 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="absolute top-6 right-8 text-primary/20">
              <Quote size={60} />
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-primary/20">
                  <Image
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={`${
                        i < testimonials[currentIndex].rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg italic">
                  &quot;{testimonials[currentIndex].text}&quot;
                </p>

                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {testimonials[currentIndex].name}
                  </h4>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>{testimonials[currentIndex].location}</span>
                    <span className="mx-2">•</span>
                    <span>{testimonials[currentIndex].car}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center mt-8 space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrev}
              className="rounded-full"
            >
              <ChevronLeft size={20} />
              <span className="sr-only">Anterior</span>
            </Button>

            <div className="flex items-center space-x-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentIndex === idx
                      ? "bg-primary w-6"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                  aria-label={`Ir para testemunho ${idx + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="rounded-full"
            >
              <ChevronRight size={20} />
              <span className="sr-only">Próximo</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
