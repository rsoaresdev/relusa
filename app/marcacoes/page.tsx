import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Car,
  MapPin,
  Mail,
  Instagram,
  Phone,
  UserRoundPen,
} from "lucide-react";
import BookingAuthWrapperSuspense from "@/components/auth/BookingAuthWrapperSuspense";

export const metadata = {
  title: "Marcações | Relusa - O seu carro não recusa",
  description:
    "Agende a sua lavagem automóvel a seco em Vila Nova de Gaia. Serviço profissional e ecológico ao seu local.",
};

export default function MarcacoesPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      {/* Header Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Marcações <span className="text-primary">Online</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Agende a sua lavagem de forma rápida e simples.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Calendar className="text-primary" size={24} />,
                  title: "Agendamento Simples",
                  description:
                    "Escolha a data e horário que melhor se adequa à sua disponibilidade.",
                },
                {
                  icon: <Clock className="text-primary" size={24} />,
                  title: "Economia de Tempo",
                  description:
                    "Nós vamos até si, sem necessidade de deslocações.",
                },
                {
                  icon: <Car className="text-primary" size={24} />,
                  title: "Serviço Personalizado",
                  description: "Escolha entre lavagem exterior ou completa.",
                },
                {
                  icon: <MapPin className="text-primary" size={24} />,
                  title: "Cobertura Local",
                  description: "Disponível em Vila Nova de Gaia e arredores.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group p-8 rounded-2xl bg-card border border-border/50 hover:border-border shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
              <div className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    Agende a Sua Lavagem
                  </h2>
                  <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                    Para agendar, faça login ou crie uma conta. As marcações são
                    realizadas exclusivamente através do website. Acumule pontos
                    e ganhe 50% de desconto na 5ª lavagem!
                  </p>
                </div>

                {/* Auth & Booking Form Component */}
                <BookingAuthWrapperSuspense />

                {/* Contact Options */}
                <div className="mt-12 pt-8 border-t border-border/50">
                  <div className="text-center space-y-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Para outras questões, contacte-nos
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Atenção: As marcações só podem ser feitas através do
                        website após login
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        {
                          href: "mailto:geral@relusa.pt",
                          icon: <Mail className="w-4 h-4" />,
                          label: "Email",
                        },
                        {
                          href: "https://instagram.com/relusa.pt",
                          icon: <Instagram className="w-4 h-4" />,
                          label: "Instagram",
                          external: true,
                        },
                        {
                          href: "tel:+351932440827",
                          icon: <Phone className="w-4 h-4" />,
                          label: "Chamada",
                        },
                        {
                          href: "/contactos",
                          icon: <UserRoundPen className="w-4 h-4" />,
                          label: "Formulário",
                        },
                      ].map((contact, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          asChild
                          className="h-12"
                        >
                          <Link
                            href={contact.href}
                            {...(contact.external && {
                              target: "_blank",
                              rel: "noopener noreferrer",
                            })}
                            className="gap-2 flex-col h-auto py-3"
                          >
                            {contact.icon}
                            <span className="text-xs">{contact.label}</span>
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Perguntas Frequentes
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "Como funciona o processo de agendamento?",
                  answer:
                    "Basta criar uma conta, escolher o tipo de serviço, data, horário e local. Após a submissão, receberá uma confirmação por email quando o agendamento for aprovado.",
                },
                {
                  question: "Quanto tempo demora a lavagem?",
                  answer:
                    "Uma lavagem completa (interior e exterior) demora aproximadamente 1 hora. A lavagem apenas exterior demora cerca de 30 minutos.",
                },
                {
                  question: "Onde estacionar o veículo?",
                  answer:
                    "O veículo deverá ser estacionado no local indicado pelo cliente, em Vila Nova de Gaia e arredores. Deve ser um local seguro, de preferencia à sombra.",
                },
                {
                  question: "Como funciona o programa de fidelidade?",
                  answer:
                    "A cada lavagem, acumula 1 ponto. A cada 5 lavagens, terá automaticamente um desconto de 50%.",
                },
                {
                  question: "Posso cancelar a minha marcação?",
                  answer:
                    "Sim, pode cancelar até 4 horas antes do horário agendado, sem qualquer custo adicional.",
                },
                {
                  question: "Como funcionará o acesso ao veículo?",
                  answer:
                    "De modo a poder realizar a limpeza interior, o cliente deverá fornecer a chave do veículo no inicio do serviço, e a mesma será devolvida no ato do pagamento.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-card border border-border/50 hover:border-border transition-colors"
                >
                  <h3 className="font-semibold text-foreground mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
