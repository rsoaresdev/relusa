import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Mail } from "lucide-react";

export const metadata = {
  title: "Sobre Nós | Relusa - O seu carro não recusa",
  description:
    "Conheça a história da Relusa, empresa de lavagem automóvel a seco em Vila Nova de Gaia. Fundada por Rafael Soares, oferecemos serviços de lavagem ecológica e profissional.",
  alternates: {
    canonical: "/sobre",
  },
};

export default function SobrePage() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      {/* Header */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sobre a <span className="text-primary">Relusa</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Conheça a nossa história, missão e valores.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-border/50">
                <Image
                  src="/founder.webp"
                  alt="Rafael Soares - Fundador da Relusa"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">
                A Nossa História
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  A Relusa foi fundada em junho de 2023 por Rafael Soares, um
                  programador que também gosta de automóveis com um olhar
                  meticuloso para o detalhe e perfecionismo, que decidiu
                  transformar a sua paixão num negócio de lavagens automóvel.
                </p>
                <p>
                  Combinando a sua experiência técnica com o amor por carros,
                  identificou a oportunidade de criar um serviço de lavagem
                  premium que fosse ao encontro do cliente, sem desperdício de
                  água e com um nível de acabamento impecável que refletisse o
                  seu perfecionismo.
                </p>
                <p>
                  Hoje, a Relusa atua em Vila Nova de Gaia como um serviço que
                  &quot;dá mais brilho a Gaia&quot;, com atenção meticulosa aos
                  detalhes e um compromisso inabalável com resultados que
                  satisfazem até os clientes mais exigentes.
                </p>
              </div>

              <div className="pt-6 p-6 bg-muted/50 rounded-xl border border-border/50">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Rafael Soares
                </h3>
                <p className="text-muted-foreground italic leading-relaxed">
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
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                O que nos define
              </span>
              <h2 className="text-4xl font-bold mt-4 mb-4">
                A Nossa <span className="text-primary">Missão e Valores</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Mission */}
              <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-2xl font-bold">M</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">
                    Missão
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Proporcionar um serviço de lavagem automóvel de excelência,
                    conveniente e ecológico, que respeite o meio ambiente e
                    supere as expectativas dos nossos clientes em termos de
                    qualidade e atenção ao detalhe.
                  </p>
                </div>
              </div>

              {/* Values */}
              <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-2xl font-bold">V</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">
                    Valores
                  </h3>
                  <div className="space-y-4">
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
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-primary text-xs font-bold">
                            {index + 1}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="font-medium text-primary block">
                            {value.title}
                          </span>
                          <span className="text-muted-foreground text-sm leading-relaxed">
                            {value.description}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Identity Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                A Nossa Identidade
              </span>
              <h2 className="text-4xl font-bold mt-4">
                O Significado por Trás da{" "}
                <span className="text-primary">Nossa Marca</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Nome */}
              <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm">
                <h3 className="text-2xl font-semibold text-foreground mb-6">
                  O nome Relusa
                </h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    O nome{" "}
                    <span className="font-semibold text-primary">Relusa</span>{" "}
                    surge da junção de <strong>&quot;RE&quot;</strong>{" "}
                    (repetição, renovação) com <strong>&quot;LUSA&quot;</strong>{" "}
                    (portuguesa, lusitana).
                  </p>
                  <p>
                    Representa a nossa missão de renovar e dar nova vida aos
                    veículos dos nossos clientes, mantendo sempre a identidade e
                    qualidade portuguesa que nos caracteriza.
                  </p>
                </div>
              </div>

              {/* Slogan */}
              <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm">
                <h3 className="text-2xl font-semibold text-foreground mb-6">
                  &quot;O seu carro não recusa&quot;
                </h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    O nosso slogan é um jogo de palavras que combina o nome da
                    marca com uma promessa de qualidade.
                  </p>
                  <p>
                    Significa que o seu carro não vai recusar o nosso serviço
                    porque sabe que vai ficar impecável, e também que nós nunca
                    recusamos um desafio quando se trata de deixar o seu veículo
                    perfeito.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-card rounded-2xl p-12 border border-border/50 shadow-sm">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground">
                  Pronto para conhecer o nosso trabalho?
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Entre em contacto connosco e descubra porque é que os nossos
                  clientes recomendam o nosso serviço.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link href="/marcacoes" className="gap-2">
                      <Calendar size={18} />
                      Agendar Lavagem
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
          </div>
        </div>
      </section>
    </div>
  );
}
