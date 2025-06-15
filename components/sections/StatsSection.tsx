"use client";

import { useState, useEffect } from "react";
import { Droplets, Car, RefreshCw } from "lucide-react";

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

  return (
    <section
      id="stats"
      className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4 text-gray-900 dark:text-white">
            O Nosso <span className="text-primary">Impacto</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Estamos comprometidos com a qualidade do serviço e a preservação do
            meio ambiente. Todos os dados são atualizados em tempo real.
          </p>
          <div className="flex items-center justify-center mt-4 text-sm text-primary gap-2">
            <RefreshCw
              size={16}
              className={`${isLoading ? "animate-spin" : ""}`}
            />
            <span>Dados em tempo real</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: <Car size={36} className="text-primary" />,
              value: stats.totalBookings,
              label: "Lavagens Realizadas",
              suffix: "",
              description: "Veículos lavados com qualidade e eficiência",
            },
            {
              icon: <Droplets size={36} className="text-primary" />,
              value: stats.waterSaved,
              label: "Litros de Água Poupados",
              suffix: "L",
              description: "Água economizada com nossa tecnologia a seco",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`flex flex-col items-center p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="mb-6 bg-primary/10 p-4 rounded-full">
                {stat.icon}
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                  {isVisible ? formatNumber(stat.value) : "0"}
                </span>
                <span className="ml-1 text-2xl text-primary font-medium">
                  {stat.suffix}
                </span>
              </div>
              <p className="mt-3 text-lg font-medium text-gray-800 dark:text-gray-200 text-center">
                {stat.label}
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
