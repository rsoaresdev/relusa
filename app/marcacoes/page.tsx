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
import BookingAuthWrapper from "@/components/auth/BookingAuthWrapper";

export const metadata = {
  title: "Marcações | Relusa - O seu carro não recusa",
  description:
    "Agende a sua lavagem automóvel a seco em Vila Nova de Gaia. Serviço profissional e ecológico ao seu local.",
};

export default function MarcacoesPage() {
  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-6 text-gray-900 dark:text-white">
              Marcações <span className="text-primary">Online</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Agende a sua lavagem de forma rápida e simples.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold font-poppins mb-6 text-gray-900 dark:text-white text-center">
                  Agende a Sua Lavagem
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
                  Para agendar, faça login ou crie uma conta. Acumule pontos e
                  ganhe 50% de desconto na 5ª lavagem!
                </p>

                {/* Componente de autenticação e formulário de marcação */}
                <BookingAuthWrapper />

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                      Prefere agendar por outro meio?
                    </h3>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Button variant="outline" asChild>
                        <Link href="mailto:geral@relusa.pt" className="gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link
                          href="https://instagram.com/relusa.pt"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gap-2"
                        >
                          <Instagram className="w-4 h-4" />
                          Instagram
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link
                          href="tel:+351932440827"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          Chamada
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link
                          href="/contactos"
                          rel="noopener noreferrer"
                          className="gap-2"
                        >
                          <UserRoundPen className="w-4 h-4" />
                          Formulário de contacto
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold font-poppins mb-12 text-gray-900 dark:text-white text-center">
              Perguntas Frequentes
            </h2>

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
                {
                  question:
                    "Será necessário ligar o veículo ou utilizar a entrada de 12v?",
                  answer:
                    "Não, não será necessário ligar o veículo ou utilizar a entrada de 12v.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    {item.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.answer}
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
