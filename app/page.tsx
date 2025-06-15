import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import StatsSection from "@/components/sections/StatsSection";
import LoyaltyProgramSection from "@/components/sections/LoyaltyProgramSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import InstagramFeedSection from "@/components/sections/InstagramFeedSection";
import CTASection from "@/components/sections/CTASection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Relusa - Lavagem Automóvel a Seco | O seu carro não recusa",
  description: "Lavagens automóvel a seco em Vila Nova de Gaia. Interior, exterior, jantes e vidros com detalhe profissional e ecológico. Marque já a sua lavagem!",
  keywords: "lavagem a seco, carro, automóvel, ecológico, Vila Nova de Gaia, detalhe, interior, exterior, jantes, vidros, marcação online",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Relusa - Lavagem Automóvel a Seco | O seu carro não recusa",
    description: "Lavagens automóvel a seco em Vila Nova de Gaia. Interior, exterior, jantes e vidros com detalhe profissional e ecológico.",
    url: "https://relusa.pt",
    siteName: "Relusa",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "https://relusa.pt/hero.webp",
        width: 1200,
        height: 630,
        alt: "Relusa - Lavagem automóvel a seco",
      }
    ],
  }
};

export default function Home() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <HeroSection />

      {/* Serviços */}
      <ServicesSection />

      {/* Como Funciona */}
      <HowItWorksSection />
      
      {/* Estatísticas */}
      <StatsSection />
      
      {/* Programa de Fidelidade */}
      <LoyaltyProgramSection />

      {/* Testemunhos */}
      <TestimonialsSection />

      {/* Instagram Feed */}
      <InstagramFeedSection />

      {/* CTA Final */}
      <CTASection />
    </div>
  );
}
