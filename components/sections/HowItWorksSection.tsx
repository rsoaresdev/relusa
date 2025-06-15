"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Droplets, Leaf, Timer, Car, CheckCircle, Award } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Agendamento",
    description:
      "Agende uma data e horário convenientes para a lavagem do seu veículo.",
    icon: <Timer className="text-primary" size={28} />,
  },
  {
    id: 2,
    title: "Chegada ao Local",
    description: "Deslocamo-nos até ao local indicado.",
    icon: <Car className="text-primary" size={28} />,
  },
  {
    id: 3,
    title: "Lavagem a Seco",
    description:
      "Realizamos a lavagem com produtos especiais de alta qualidade que não necessitam de água.",
    icon: <Droplets className="text-primary" size={28} />,
  },
  {
    id: 4,
    title: "Acabamento de Detalhe",
    description:
      "Finalizamos com detalhes que fazem toda a diferença na aparência.",
    icon: <CheckCircle className="text-primary" size={28} />,
  },
];

const benefits = [
  {
    title: "Ecológico",
    description:
      "Economiza até 300 litros de água por lavagem comparativamente à lavagem tradicional, usando apenas 1 litro no máximo.",
    icon: <Leaf className="text-white" size={24} />,
  },
  {
    title: "Conveniente",
    description:
      "Lavamos o seu carro onde estiver, sem necessidade de se deslocar.",
    icon: <Car className="text-white" size={24} />,
  },
  {
    title: "Profissional",
    description:
      "Utilizamos produtos de alta qualidade e eco-friendly que garantem um acabamento impecável e protegem a pintura do seu veículo.",
    icon: <Award className="text-white" size={24} />,
  },
];

export default function HowItWorksSection() {
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

    const sectionRef = document.getElementById("como-funciona");
    if (sectionRef) observer.observe(sectionRef);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="como-funciona" className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4 text-gray-900 dark:text-white">
            Como <span className="text-primary">Funciona</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A nossa lavagem a seco é um processo inovador e ecológico que deixa
            o seu carro impecável sem desperdício de água.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  {step.icon}
                </div>
                <span className="text-3xl font-bold text-primary">
                  {step.id}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Video/Image and Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Video/Image Section */}
          <div
            className={`relative rounded-2xl overflow-hidden shadow-xl transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="aspect-video relative">
              <Image
                src="/car-wash-process.webp"
                alt="Processo de lavagem a seco"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">
                    Lavagem a Seco Profissional
                  </h3>
                  <p className="text-sm text-gray-200">
                    Veja como transformamos o seu carro sem usar água
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div
            className={`space-y-8 transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Vantagens da Lavagem a Seco
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                A nossa tecnologia de lavagem a seco oferece inúmeras vantagens
                em relação às lavagens tradicionais, sendo mais ecológica e
                prática.
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-4 transition-all duration-700 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${(index + 4) * 150}ms` }}
                >
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {benefit.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                <strong>Nota:</strong> Para lavagens interiores, necessitamos
                apenas da chave do veículo, sem precisar de ligar o carro ou
                utilizar a ligação de 12V. O pagamento é efetuado no final, na
                entrega da chave.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
