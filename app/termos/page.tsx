import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Shield,
  Scale,
  Clock,
  CreditCard,
  Award,
  AlertTriangle,
  FileEdit,
  Mail,
  Car,
  Star,
} from "lucide-react";

export const metadata = {
  title: "Termos de Uso | Relusa - O seu carro não recusa",
  description:
    "Termos e condições de utilização dos serviços da Relusa, empresa de lavagem automóvel a seco em Vila Nova de Gaia.",
  alternates: {
    canonical: "/termos",
  },
};

export default function TermosPage() {
  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-6 text-gray-900 dark:text-white">
              Termos de Uso
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Última atualização: 17 de junho de 2025
            </p>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-6 border-b border-gray-200 dark:border-gray-800 sticky top-[53px] bg-white dark:bg-gray-900 z-30 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <nav className="flex flex-wrap gap-y-2 gap-x-6 text-sm font-medium">
              <a
                href="#introducao"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Introdução
              </a>
              <a
                href="#servicos"
                className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                Serviços
              </a>
              <a
                href="#agendamento"
                className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                Agendamento
              </a>
              <a
                href="#pagamento"
                className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                Pagamento
              </a>
              <a
                href="#fidelidade"
                className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                Programa de Fidelidade
              </a>
              <a
                href="#avaliacoes"
                className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                Avaliações
              </a>
              <a
                href="#responsabilidades"
                className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                Responsabilidades
              </a>
              <a
                href="#alteracoes"
                className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                Alterações
              </a>
              <a
                href="#contacto"
                className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                Contacto
              </a>
            </nav>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Sidebar */}
              <div className="md:col-span-1">
                <div className="sticky top-[160px] bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Neste documento:
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li>
                      <a
                        href="#introducao"
                        className="flex items-center text-primary hover:text-primary/80 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Introdução
                      </a>
                    </li>
                    <li>
                      <a
                        href="#servicos"
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Descrição dos Serviços
                      </a>
                    </li>
                    <li>
                      <a
                        href="#agendamento"
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Agendamento e Cancelamento
                      </a>
                    </li>
                    <li>
                      <a
                        href="#pagamento"
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Pagamento
                      </a>
                    </li>
                    <li>
                      <a
                        href="#fidelidade"
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Programa de Fidelidade
                      </a>
                    </li>
                    <li>
                      <a
                        href="#avaliacoes"
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Sistema de Avaliações
                      </a>
                    </li>
                    <li>
                      <a
                        href="#responsabilidades"
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Responsabilidades
                      </a>
                    </li>
                    <li>
                      <a
                        href="#limitacao"
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Limitação de Responsabilidade
                      </a>
                    </li>
                    <li>
                      <a
                        href="#alteracoes"
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Alterações aos Termos
                      </a>
                    </li>
                    <li>
                      <a
                        href="#lei"
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Lei Aplicável
                      </a>
                    </li>
                    <li>
                      <a
                        href="#contacto"
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Contacto
                      </a>
                    </li>
                  </ul>

                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      href="/privacidade"
                      className="flex items-center text-primary hover:text-primary/80 transition-colors"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Ver Política de Privacidade
                    </Link>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="md:col-span-2 prose dark:prose-invert prose-headings:font-poppins prose-headings:font-bold prose-a:text-primary max-w-none">
                <div id="introducao" className="scroll-mt-[160px]">
                  <div className="flex items-center mb-2">
                    <FileText className="text-primary mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                      Introdução
                    </h2>
                  </div>
                  <p>
                    Bem-vindo aos Termos de Uso da Relusa. Este documento
                    estabelece os termos e condições para a utilização dos
                    nossos serviços de lavagem automóvel a seco.
                  </p>
                  <p>
                    Ao utilizar os serviços da Relusa, você concorda com estes
                    Termos de Uso. Se não concordar com algum dos termos aqui
                    estabelecidos, não poderá utilizar os nossos serviços.
                  </p>
                  <p>
                    Recomendamos a leitura completa deste documento para
                    entender os seus direitos e responsabilidades ao utilizar os
                    nossos serviços.
                  </p>
                </div>

                <div
                  id="servicos"
                  className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 scroll-mt-[160px]"
                >
                  <div className="flex items-center mb-2">
                    <Car className="text-primary mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                      Descrição dos Serviços
                    </h2>
                  </div>
                  <p>
                    A Relusa oferece serviços especializados de lavagem
                    automóvel a seco, incluindo:
                  </p>
                  <ul>
                    <li>
                      <strong>Lavagem Exterior:</strong>
                      <ul className="pl-6 mt-2">
                        <li>
                          Lavagem exterior a seco completa da carroçaria com
                          produtos especializados
                        </li>
                        <li>
                          Limpeza profunda de jantes e remoção de sujidade
                          acumulada
                        </li>
                        <li>
                          Limpeza de vidros exterior com produtos específicos
                        </li>
                        <li>
                          Aplicação de brilho de pneus para acabamento
                          profissional
                        </li>
                        <li>
                          Polimento de faróis para melhorar a visibilidade e
                          aparência
                        </li>
                        <li>
                          Acabamento cerâmico para proteção duradoura da pintura
                        </li>
                      </ul>
                    </li>
                    <li className="mt-4">
                      <strong>Lavagem Completa:</strong>
                      <ul className="pl-6 mt-2">
                        <li>
                          Lavagem exterior a seco completa da carroçaria com
                          produtos especializados
                        </li>
                        <li>
                          Limpeza profunda de jantes e remoção de sujidade
                          acumulada
                        </li>
                        <li>
                          Aspiração completa de todo o interior, incluindo
                          bancos, tapetes e bagageira
                        </li>
                        <li>
                          Limpeza de vidros interior e exterior com produtos
                          específicos
                        </li>
                        <li>
                          Limpeza detalhada de painéis, tablier e plásticos
                          interiores
                        </li>
                        <li>
                          Aplicação de brilho de pneus para acabamento
                          profissional
                        </li>
                        <li>
                          Polimento de faróis para melhorar a visibilidade e
                          aparência
                        </li>
                        <li>
                          Acabamento cerâmico para proteção duradoura da pintura
                        </li>
                        <li>
                          Aplicação de ambientador com fragrância duradoura
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <p className="mt-4">
                    Todos os serviços são realizados por profissionais
                    treinados, utilizando produtos ecológicos e técnicas
                    especializadas de lavagem a seco.
                  </p>
                </div>

                <div
                  id="agendamento"
                  className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 scroll-mt-[160px]"
                >
                  <div className="flex items-center mb-2">
                    <Clock className="text-primary mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                      Agendamento e Cancelamento
                    </h2>
                  </div>
                  <p>
                    Para garantir a melhor experiência possível, estabelecemos
                    as seguintes políticas de agendamento:
                  </p>
                  <h3 className="text-lg font-semibold mt-4 mb-2">
                    Agendamento
                  </h3>
                  <ul className="pl-6 mb-4">
                    <li>
                      <strong>
                        As marcações são realizadas exclusivamente através do
                        website
                      </strong>{" "}
                      após criar conta e fazer login
                    </li>
                    <li>
                      Não aceitamos marcações por telefone, email ou redes
                      sociais
                    </li>
                    <li>
                      Agendamentos podem ser feitos com até 30 dias de
                      antecedência
                    </li>
                    <li>
                      O horário de funcionamento é de segunda a sábado, das 8h
                      às 20h
                    </li>
                    <li>
                      Tempo médio de serviço:
                      <ul className="pl-6 mt-2">
                        <li>Lavagem Exterior: 30-45 minutos</li>
                        <li>Lavagem Completa: 45-90 minutos</li>
                      </ul>
                    </li>
                    <li>
                      É necessário fornecer informações precisas sobre o veículo
                      para melhor preparação do serviço
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold mt-4 mb-2">
                    Reagendamento
                  </h3>
                  <ul className="pl-6 mb-4">
                    <li>
                      A Relusa reserva-se o direito de reagendar marcações
                      quando necessário
                    </li>
                    <li>
                      Reagendamentos por parte da empresa serão comunicados com
                      antecedência mínima de 4 horas
                    </li>
                    <li>
                      O cliente será notificado por email sobre qualquer
                      alteração de data ou horário
                    </li>
                    <li>
                      Não há custos adicionais para reagendamentos iniciados
                      pela Relusa
                    </li>
                    <li>
                      Reagendamentos podem ocorrer devido a condições
                      meteorológicas, emergências ou questões operacionais
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold mt-4 mb-2">
                    Política de Cancelamento
                  </h3>
                  <ul className="pl-6">
                    <li>
                      Cancelamentos devem ser feitos com pelo menos 4 horas de
                      antecedência
                    </li>
                    <li>
                      Cancelamentos tardios ou não comparecimento podem resultar
                      em cobrança de taxa
                    </li>
                    <li>
                      Em caso de condições meteorológicas adversas, a Relusa
                      poderá reagendar o serviço sem custos
                    </li>
                    <li>
                      Alterações de horário estão sujeitas à disponibilidade
                    </li>
                  </ul>
                </div>

                <div
                  id="pagamento"
                  className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 scroll-mt-[160px]"
                >
                  <div className="flex items-center mb-2">
                    <CreditCard className="text-primary mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                      Pagamento
                    </h2>
                  </div>
                  <p>
                    A Relusa oferece diversas formas de pagamento para sua
                    conveniência:
                  </p>
                  <ul className="pl-6">
                    <li>MB Way</li>
                    <li>Transferência bancária</li>
                    <li>Dinheiro</li>
                  </ul>
                  <p className="mt-4">Notas importantes sobre pagamentos:</p>
                  <ul className="pl-6">
                    <li>
                      <strong>
                        Emitimos fatura para todos os serviços prestados
                      </strong>
                    </li>
                    <li>
                      Serviços adicionais serão orçamentados separadamente
                    </li>
                    <li>Descontos e promoções não são acumuláveis</li>
                    <li>
                      O pagamento deve ser efetuado após a conclusão do serviço
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold mt-6 mb-2">
                    Emissão e Gestão de Faturas
                  </h3>
                  <ul className="pl-6 mb-4">
                    <li>
                      Todas as faturas são emitidas após a conclusão do serviço
                    </li>
                    <li>
                      As faturas são disponibilizadas num prazo máximo de 5 dias
                      úteis
                    </li>
                    <li>
                      O cliente é notificado por email quando a fatura fica
                      disponível
                    </li>
                    <li>
                      As faturas podem ser consultadas e descarregadas através
                      da área de cliente
                    </li>
                    <li>
                      O NIF deve ser fornecido no momento da marcação para
                      emissão de fatura
                    </li>
                    <li>
                      Mantemos uma cópia digital de todas as faturas emitidas
                      por motivos legais
                    </li>
                  </ul>
                </div>

                <div
                  id="fidelidade"
                  className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 scroll-mt-[160px]"
                >
                  <div className="flex items-center mb-2">
                    <Award className="text-primary mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                      Programa de Fidelidade
                    </h2>
                  </div>
                  <p>
                    O programa de fidelidade da Relusa oferece benefícios
                    exclusivos aos nossos clientes regulares:
                  </p>
                  <ul className="pl-6">
                    <li>A cada 5 lavagens, a 5ª tem 50% de desconto</li>
                  </ul>
                  <p className="mt-4">Termos do programa de fidelidade:</p>
                  <ul className="pl-6">
                    <li>As lavagens são contabilizadas por conta do cliente</li>
                    <li>O programa não tem prazo de validade</li>
                    <li>Os benefícios são pessoais e intransferíveis</li>
                  </ul>
                </div>

                <div
                  id="avaliacoes"
                  className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 scroll-mt-[160px]"
                >
                  <div className="flex items-center mb-2">
                    <Star className="text-primary mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                      Sistema de Avaliações
                    </h2>
                  </div>
                  <p>
                    A Relusa implementa um sistema de avaliações para melhorar
                    continuamente a qualidade dos seus serviços:
                  </p>

                  <h3 className="text-lg font-semibold mt-4 mb-2">
                    Submissão de Avaliações
                  </h3>
                  <ul className="pl-6 mb-4">
                    <li>
                      Apenas clientes que completaram um serviço podem avaliar
                    </li>
                    <li>
                      As avaliações incluem classificação de 1 a 5 estrelas
                    </li>
                    <li>
                      É possível adicionar um comentário opcional (máximo 50
                      caracteres)
                    </li>
                    <li>
                      O cliente pode autorizar a publicação da avaliação na
                      página inicial
                    </li>
                    <li>
                      Avaliações publicadas estão sujeitas a aprovação prévia
                      pela administração
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold mt-4 mb-2">
                    Política de Edição e Remoção
                  </h3>
                  <ul className="pl-6 mb-4">
                    <li>
                      <strong>
                        As avaliações não podem ser editadas após submissão
                      </strong>
                    </li>
                    <li>
                      <strong>
                        As avaliações não podem ser apagadas pelo cliente
                      </strong>
                    </li>
                    <li>
                      Esta política garante a autenticidade e transparência do
                      sistema
                    </li>
                    <li>
                      Apenas a administração pode moderar avaliações por motivos
                      de adequação
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold mt-4 mb-2">
                    Utilização das Avaliações
                  </h3>
                  <ul className="pl-6 mb-4">
                    <li>
                      Avaliações aprovadas podem ser exibidas publicamente no
                      website
                    </li>
                    <li>
                      As avaliações ajudam outros clientes na tomada de decisão
                    </li>
                    <li>Utilizamos feedback para melhorar nossos serviços</li>
                    <li>
                      Reservamo-nos o direito de não publicar avaliações
                      inadequadas
                    </li>
                  </ul>
                </div>

                <div
                  id="responsabilidades"
                  className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 scroll-mt-[160px]"
                >
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="text-primary mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                      Responsabilidades
                    </h2>
                  </div>
                  <h3 className="text-lg font-semibold mt-4 mb-2">
                    Responsabilidades da Relusa
                  </h3>
                  <ul className="pl-6 mb-4">
                    <li>
                      Realizar os serviços com profissionalismo e qualidade
                    </li>
                    <li>
                      Utilizar produtos adequados e seguros para cada tipo de
                      superfície
                    </li>
                    <li>Garantir a segurança do veículo durante o serviço</li>
                    <li>Respeitar os horários agendados</li>
                  </ul>

                  <h3 className="text-lg font-semibold mt-4 mb-2">
                    Responsabilidades do Cliente
                  </h3>
                  <ul className="pl-6">
                    <li>Fornecer informações precisas sobre o veículo</li>
                    <li>Informar sobre danos pré-existentes</li>
                    <li>Garantir acesso ao local de lavagem</li>
                    <li>Respeitar os horários agendados</li>
                    <li>Efetuar o pagamento conforme acordado</li>
                  </ul>
                </div>

                <div
                  id="limitacao"
                  className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 scroll-mt-[160px]"
                >
                  <div className="flex items-center mb-2">
                    <Shield className="text-primary mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                      Limitação de Responsabilidade
                    </h2>
                  </div>
                  <p>A Relusa não se responsabiliza por:</p>
                  <ul className="pl-6">
                    <li>Danos pré-existentes não reportados</li>
                    <li>
                      Condições meteorológicas que impeçam a realização do
                      serviço
                    </li>
                  </ul>
                </div>

                <div
                  id="alteracoes"
                  className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 scroll-mt-[160px]"
                >
                  <div className="flex items-center mb-2">
                    <FileEdit className="text-primary mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                      Alterações aos Termos
                    </h2>
                  </div>
                  <p>
                    A Relusa reserva-se o direito de alterar estes termos a
                    qualquer momento, sendo que:
                  </p>
                  <ul className="pl-6">
                    <li>As alterações serão comunicadas através do website</li>
                    <li>
                      Alterações significativas terão um período de notificação
                      de 30 dias
                    </li>
                    <li>
                      A continuação do uso dos serviços implica a aceitação dos
                      novos termos
                    </li>
                  </ul>
                </div>

                <div
                  id="lei"
                  className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 scroll-mt-[160px]"
                >
                  <div className="flex items-center mb-2">
                    <Scale className="text-primary mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                      Lei Aplicável
                    </h2>
                  </div>
                  <p>
                    Estes Termos de Uso são regidos pelas leis de Portugal.
                    Qualquer disputa relacionada com estes termos será submetida
                    à jurisdição exclusiva dos tribunais portugueses.
                  </p>
                </div>

                <div
                  id="contacto"
                  className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 scroll-mt-[160px]"
                >
                  <div className="flex items-center mb-2">
                    <Mail className="text-primary mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                      Contacto
                    </h2>
                  </div>
                  <p>
                    Para questões relacionadas com estes termos ou com os nossos
                    serviços:
                  </p>
                  <ul className="pl-6">
                    <li>
                      Email:{" "}
                      <a href="mailto:geral@relusa.pt">geral@relusa.pt</a>
                    </li>
                    <li>
                      Telefone: <a href="tel:+351932440827">932 440 827</a>
                    </li>
                    <li>
                      WhatsApp:{" "}
                      <a
                        href="https://wa.me/351932440827"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        932 440 827
                      </a>
                    </li>
                    <li>
                      Formulário de contacto:{" "}
                      <a
                        href="/contactos"
                        className="text-primary hover:underline"
                      >
                        Formulário de contacto
                      </a>
                    </li>
                    <li>
                      Instagram:{" "}
                      <a
                        href="https://instagram.com/relusa.pt"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        @relusa.pt
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ao utilizar os nossos serviços, confirma que leu,
                    compreendeu e concorda com estes Termos de Uso. Recomendamos
                    que guarde uma cópia destes termos para referência futura.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                    Para mais informações, consulte a nossa{" "}
                    <Link
                      href="/privacidade"
                      className="text-primary hover:underline"
                    >
                      Política de Privacidade
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
