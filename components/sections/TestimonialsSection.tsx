"use client";

import { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPublicReviews, Review } from "@/lib/supabase/config";

// Fallback testimonial when no reviews are available
const fallbackTestimonial: Review = {
  id: "fallback",
  user_id: "fallback",
  booking_id: "fallback",
  customer_name: "Cliente Relusa",
  car_model: "Aguardamos avaliações",
  rating: 5,
  comment: "Ainda não temos avaliações públicas. Seja o primeiro a avaliar!",
  allow_publication: true,
  is_approved: true,
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export default function TestimonialsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Carregar avaliações públicas
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const publicReviews = await getPublicReviews();
        setReviews(
          publicReviews.length > 0 ? publicReviews : [fallbackTestimonial]
        );
      } catch (error) {
        console.error("Erro ao carregar avaliações:", error);
        setReviews([fallbackTestimonial]);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

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
    if (autoplay && reviews.length > 1 && !loading) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
      }, 5000);
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, reviews.length, loading]);

  // Navegação
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
    if (autoplay) {
      setAutoplay(false);
      setTimeout(() => setAutoplay(true), 10000);
    }
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
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
          {loading ? (
            <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-8 md:p-12 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
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
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-border/50 bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                      <div className="text-primary text-2xl font-bold">
                        {reviews[currentIndex]?.customer_name?.charAt(0) || "R"}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={`${
                            i < (reviews[currentIndex]?.rating || 0)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>

                    <blockquote className="text-foreground text-lg leading-relaxed">
                      &quot;
                      {reviews[currentIndex]?.comment ||
                        "Avaliação em breve..."}
                      &quot;
                    </blockquote>

                    <div className="space-y-1">
                      <h4 className="font-semibold text-foreground">
                        {reviews[currentIndex]?.customer_name || "Cliente"}
                      </h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>Vila Nova de Gaia</span>
                        <span className="mx-2">•</span>
                        <span>
                          {reviews[currentIndex]?.car_model || "Veículo"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Navigation Controls - Only show if more than 1 testimonial */}
          {!loading && reviews.length > 1 && (
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
                {reviews.map((_, index) => (
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
