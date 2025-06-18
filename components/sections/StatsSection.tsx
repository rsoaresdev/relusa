"use client";

import { useState, useEffect } from "react";
import { Droplets, Car, RefreshCw, Leaf } from "lucide-react";

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({
    totalBookings: 0,
    waterSaved: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Obter estatísticas da API
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/stats");
        const { success, data, error } = await response.json();

        if (!success) {
          throw new Error(error || "Erro ao procurar estatísticas");
        }

        setStats({
          totalBookings: data.totalBookings,
          waterSaved: data.waterSaved,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Observar quando a secção fica visível para animar
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

    const sectionRef = document.getElementById("stats");
    if (sectionRef) observer.observe(sectionRef);

    return () => observer.disconnect();
  }, []);

  // Função para formatar números grandes
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Calcular CO2 poupado (400g por lavagem)
  const co2Saved = stats.totalBookings * 0.4; // 400g = 0.4kg

  return (
    <section id="stats" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            O Nosso <span className="text-primary">Impacto</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Estamos comprometidos com a qualidade do serviço e a preservação do
            meio ambiente. Todos os dados são atualizados em tempo real.
          </p>
          <div className="flex items-center justify-center mt-6 text-sm text-primary gap-2">
            <RefreshCw
              size={16}
              className={`${isLoading ? "animate-spin" : ""}`}
            />
            <span>Dados em tempo real</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-7xl mx-auto">
          {[
            {
              icon: <Car size={28} className="text-primary" />,
              value: stats.totalBookings,
              label: "Lavagens Realizadas",
              suffix: "",
              description: "Veículos lavados com qualidade e eficiência",
            },
            {
              icon: <Droplets size={28} className="text-primary" />,
              value: stats.waterSaved,
              label: "Litros de Água Poupados",
              suffix: "L",
              description: "Água economizada com nossa tecnologia a seco",
            },
            {
              icon: <Leaf size={28} className="text-primary" />,
              value: co2Saved,
              label: "CO₂ Poupado",
              suffix: "kg",
              description: "Carbono não emitido vs lavagem tradicional",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`group p-10 rounded-2xl bg-card border border-border/50 hover:border-border shadow-sm hover:shadow-md transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 bg-primary/10 p-4 rounded-xl group-hover:bg-primary/15 transition-colors">
                  {stat.icon}
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl md:text-5xl font-bold text-foreground">
                      {isVisible ? formatNumber(stat.value) : "0"}
                    </span>
                    <span className="ml-1 text-2xl text-primary font-semibold">
                      {stat.suffix}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {stat.label}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
