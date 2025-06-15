import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Mail } from "lucide-react";

export const metadata = {
  title: "Sobre Nós | Relusa - O seu carro não recusa",
  description:
    "Conheça a história da Relusa, empresa de lavagem automóvel a seco em Vila Nova de Gaia. Fundada por Rafael Soares, oferecemos serviços de lavagem ecológica e profissional.",
};

export default function SobrePage() {
  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-6 text-gray-900 dark:text-white">
              Sobre a <span className="text-primary">Relusa</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Conheça a nossa história, missão e valores.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/founder.webp"
                alt="Rafael Soares - Fundador da Relusa"
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold font-poppins text-gray-900 dark:text-white">
                A Nossa História
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                A Relusa foi fundada em junho de 2023 por Rafael Soares, um
                programador que também gosta de automóveis com um olhar
                meticuloso para o detalhe e perfecionismo, que decidiu
                transformar a sua paixão num negócio de lavagens automóvel.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Combinando a sua experiência técnica com o amor por carros,
                identificou a oportunidade de criar um serviço de lavagem
                premium que fosse ao encontro do cliente, sem desperdício de
                água e com um nível de acabamento impecável que refletisse o seu
                perfecionismo.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Hoje, a Relusa atua em Vila Nova de Gaia como um serviço que &quot;dá
                mais brilho a Gaia&quot;, com atenção meticulosa aos detalhes e um
                compromisso inabalável com resultados que satisfazem até os
                clientes mais exigentes.
              </p>

              <div className="pt-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Rafael Soares
                </h3>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  &quot;A minha paixão por carros e detalhe levou-me a criar um
                  serviço que combina conveniência, qualidade e responsabilidade
                  ambiental.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                O que nos define
              </span>
              <h2 className="text-4xl font-bold font-poppins mt-2 text-gray-900 dark:text-white">
                A Nossa{" "}
                <span className="text-primary relative inline-block">
                  Missão e Valores
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-primary/10 rounded-full"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-6">
                    <span className="text-primary text-xl font-bold">M</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    Missão
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Proporcionar um serviço de lavagem automóvel de excelência,
                    conveniente e ecológico, que respeite o meio ambiente e
                    supere as expectativas dos nossos clientes em termos de
                    qualidade e atenção ao detalhe.
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-primary/10 rounded-full"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-6">
                    <span className="text-primary text-xl font-bold">V</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    Valores
                  </h3>
                  <ul className="space-y-4">
                    {[
                      {
                        title: "Excelência",
                        description:
                          "Comprometemo-nos com a mais alta qualidade em cada lavagem.",
                      },
                      {
                        title: "Sustentabilidade",
                        description:
                          "Utilizamos métodos e produtos ecológicos para minimizar o impacto ambiental.",
                      },
                      {
                        title: "Qualidade",
                        description:
                          "Utilizamos produtos de alta qualidade para garantir o melhor resultado.",
                      },
                      {
                        title: "Conveniência",
                        description:
                          "Facilitamos a vida dos nossos clientes, indo ao seu encontro.",
                      },
                      {
                        title: "Transparência",
                        description:
                          "Somos claros e honestos em todos os aspetos do nosso serviço.",
                      },
                    ].map((value, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 mr-3 mt-0.5 flex-shrink-0">
                          <span className="text-primary text-xs font-bold">
                            {index + 1}
                          </span>
                        </span>
                        <div>
                          <span className="font-medium text-primary block mb-1">
                            {value.title}
                          </span>
                          <span className="text-gray-600 dark:text-gray-300 text-sm">
                            {value.description}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Identity Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                A Nossa Identidade
              </span>
              <h2 className="text-4xl font-bold font-poppins mt-2 text-gray-900 dark:text-white">
                O Significado por Trás da{" "}
                <span className="text-primary relative inline-block">
                  A Nossa Marca
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Nome */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  O nome Relusa
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  O nome &quot;Relusa&quot; nasceu da combinação de duas ideias fundamentais para o nosso serviço:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 mr-3 mt-0.5">
                      <span className="text-primary text-xs font-bold">1</span>
                    </span>
                    <div>
                      <span className="text-gray-600 dark:text-gray-300">
                        <strong className="text-primary">Relusa</strong> vem da palavra &quot;reluzente&quot; - representando o brilho e o aspeto renovado que damos ao seu automóvel.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 mr-3 mt-0.5">
                      <span className="text-primary text-xs font-bold">2</span>
                    </span>
                    <div>
                      <span className="text-gray-600 dark:text-gray-300">
                        <strong className="text-primary">-lusa</strong> representa nossa origem portuguesa e o orgulho de ser uma empresa nacional 
                        <svg className="inline-block ml-1 h-4 w-6" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
                          <rect width="600" height="400" fill="#FF0000" />
                          <rect width="240" height="400" fill="#006600" />
                          <circle cx="240" cy="200" r="80" fill="#FFFF00" stroke="#000000" strokeWidth="1" />
                          <path d="M180,200 L240,120 L300,200 L240,280 Z" fill="#FF0000" />
                          <path d="M195,200 L240,140 L285,200 L240,260 Z" fill="#FFFFFF" />
                          <circle cx="240" cy="200" r="40" fill="#0000FF" stroke="#FFFFFF" strokeWidth="5" />
                          <path d="M240,160 L240,240 M200,200 L280,200" stroke="#FFFFFF" strokeWidth="10" />
                        </svg>.
                      </span>
                    </div>
                  </li>
                </ul>
                <p className="text-gray-600 dark:text-gray-300 mt-4">
                  O slogan &quot;O seu carro não recusa&quot; é um jogo de palavras que combina o nome da empresa com a promessa de um serviço irrecusável pela sua qualidade e conveniência.
                </p>
              </div>

              {/* Logo */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  O nosso logo
                </h3>
                <div className="flex justify-center mb-6">
                  <Image 
                    src="/logo_rounded.png" 
                    alt="Logo da Relusa" 
                    className="h-32 w-auto"
                    width={128}
                    height={128}
                  />
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Cada elemento do nosso logo foi cuidadosamente pensado para representar os valores da Relusa:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 mr-3 mt-0.5">
                      <span className="text-primary text-xs font-bold">1</span>
                    </span>
                    <div>
                      <span className="text-gray-600 dark:text-gray-300">
                        O <strong className="text-primary">carro estilizado</strong> representa o foco do nosso negócio e a paixão por automóveis.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 mr-3 mt-0.5">
                      <span className="text-primary text-xs font-bold">2</span>
                    </span>
                    <div>
                      <span className="text-gray-600 dark:text-gray-300">
                        A <strong className="text-primary">folha</strong> simboliza nosso compromisso com a sustentabilidade e práticas ecológicas.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 mr-3 mt-0.5">
                      <span className="text-primary text-xs font-bold">3</span>
                    </span>
                    <div>
                      <span className="text-gray-600 dark:text-gray-300">
                        As <strong className="text-primary">cinco gotas</strong> representam o brilho e a economia de água, lembrando que usamos apenas 1L por lavagem.
                      </span>
                    </div>
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-primary/5 rounded-xl">
                  <h4 className="text-lg font-semibold text-primary mb-2">
                    A Cor Verde
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    A escolha do verde como cor principal simboliza:
                  </p>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span className="text-gray-600 dark:text-gray-300">Sustentabilidade e consciência ambiental</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span className="text-gray-600 dark:text-gray-300">Pureza e limpeza</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span className="text-gray-600 dark:text-gray-300">Renovação e frescura</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-poppins mb-6 text-gray-900 dark:text-white">
              Área de Serviço
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Atualmente, prestamos serviço em Vila Nova de Gaia e arredores.
              Estamos em constante expansão para servir mais áreas.
            </p>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md flex items-center justify-center space-x-4">
              <MapPin size={24} className="text-primary" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Vila Nova de Gaia, Portugal
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-primary/10 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Pronto para experimentar a Relusa?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Agende agora a sua lavagem e descubra a diferença de um serviço
              profissional e ecológico.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/marcacoes" className="gap-2">
                  <Calendar size={18} />
                  Marcar Lavagem
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contactos" className="gap-2">
                  <Mail size={18} />
                  Contactar-nos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
