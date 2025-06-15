import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Shield,
  Database,
  Lock,
  UserCheck,
  Cookie,
  Clock,
  FileEdit,
  Mail,
} from "lucide-react";

export const metadata = {
  title: "Política de Privacidade | Relusa - O seu carro não recusa",
  description:
    "Política de privacidade da Relusa, detalhando como recolhemos, utilizamos e protegemos os seus dados pessoais.",
};

export default function PrivacidadePage() {
  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-6 text-gray-900 dark:text-white">
              Política de Privacidade
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Última atualização: 15 de junho de 2025
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
                href="#recolha"
                className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                Recolha de Dados
              </a>
              <a
                href="#utilizacao"
                className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                Utilização
              </a>
              <a
                href="#partilha"
                className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                Partilha
              </a>
              <a
                href="#seguranca"
                className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                Segurança
              </a>
              <a
                href="#direitos"
                className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                Os Seus Direitos
              </a>
              <a
                href="#cookies"
                className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                Cookies
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
                        href="#recolha"
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Informações que Recolhemos
                      </a>
                    </li>
                    <li>
                      <a
                        href="#utilizacao"
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Como Utilizamos as Suas Informações
                      </a>
                    </li>
                    <li>
                      <a
                        href="#partilha"
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Partilha de Informações
                      </a>
                    </li>
                    <li>
                      <a
                        href="#seguranca"
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Segurança de Dados
                      </a>
                    </li>
                    <li>
                      <a
                        href="#direitos"
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Os Seus Direitos
                      </a>
                    </li>
                    <li>
                      <a
                        href="#cookies"
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Cookies e Tecnologias Semelhantes
                      </a>
                    </li>
                    <li>
                      <a
                        href="#retencao"
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Retenção de Dados
                      </a>
                    </li>
                    <li>
                      <a
                        href="#alteracoes"
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Alterações a Esta Política
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
                      href="/termos"
                      className="flex items-center text-primary hover:text-primary/80 transition-colors"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Ver Termos de Uso
                    </Link>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="md:col-span-2 prose dark:prose-invert prose-headings:font-poppins prose-headings:font-bold prose-a:text-primary max-w-none">
                <div id="introducao" className="scroll-mt-[160px]">
                  <div className="flex items-center mb-2">
                    <Shield className="text-primary mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                      Introdução
                    </h2>
                  </div>
                  <p>
                    A Relusa está comprometida em proteger a sua privacidade e os seus dados pessoais. Esta Política de Privacidade explica como recolhemos, utilizamos e protegemos as suas informações quando utiliza os nossos serviços de lavagem automóvel a seco.
                  </p>
                  <p>
                    Tratamos os seus dados pessoais em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD) e demais legislação aplicável em Portugal.
                  </p>
                </div>

                <div
                  id="recolha"
                  className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 scroll-mt-[160px]"
                >
                  <div className="flex items-center mb-2">
                    <Database className="text-primary mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                      Informações que Recolhemos
                    </h2>
                  </div>
                  <p>
                    Para prestar os nossos serviços, recolhemos os seguintes tipos de informações:
                  </p>
                  <h3 className="text-lg font-semibold mt-4 mb-2">Dados Pessoais</h3>
                  <ul className="pl-6">
                    <li>Nome completo</li>
                    <li>Número de telefone</li>
                    <li>Endereço de email</li>
                    <li>Morada para prestação do serviço</li>
                    <li>NIF (quando solicitada fatura)</li>
                  </ul>

                  <h3 className="text-lg font-semibold mt-4 mb-2">Dados do Veículo</h3>
                  <ul className="pl-6">
                    <li>Matrícula</li>
                    <li>Marca e modelo</li>
                    <li>Cor</li>
                    <li>Tipo de carroçaria</li>
                    <li>Histórico de serviços realizados</li>
                  </ul>

                  <h3 className="text-lg font-semibold mt-4 mb-2">Dados de Utilização do Website</h3>
                  <ul className="pl-6">
                    <li>Endereço IP</li>
                    <li>Tipo de navegador</li>
                    <li>Sistema operativo</li>
                    <li>Páginas visitadas</li>
                    <li>Data e hora dos acessos</li>
                  </ul>

                  <h3 className="text-lg font-semibold mt-4 mb-2">Dados de Pagamento</h3>
                  <p>
                    Não armazenamos dados de cartões de crédito ou débito. Todas as transações são processadas através de prestadores de serviços de pagamento seguros.
                  </p>
                </div>

                <div
                  id="utilizacao"
                  className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 scroll-mt-[160px]"
                >
                  <div className="flex items-center mb-2">
                    <UserCheck className="text-primary mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                      Como Utilizamos as Suas Informações
                    </h2>
                  </div>
                  <p>
                    Utilizamos as suas informações para os seguintes fins:
                  </p>
                  <h3 className="text-lg font-semibold mt-4 mb-2">Prestação de Serviços</h3>
                  <ul className="pl-6">
                    <li>Agendamento e gestão de marcações</li>
                    <li>Prestação dos serviços de lavagem</li>
                    <li>Emissão de faturas</li>
                    <li>Gestão do programa de fidelidade</li>
                    <li>Comunicação sobre o serviço agendado</li>
                  </ul>

                  <h3 className="text-lg font-semibold mt-4 mb-2">Melhoria dos Serviços</h3>
                  <ul className="pl-6">
                    <li>Análise de padrões de utilização</li>
                    <li>Desenvolvimento de novos serviços</li>
                    <li>Avaliação da qualidade do serviço</li>
                    <li>Personalização da experiência do cliente</li>
                  </ul>

                  <h3 className="text-lg font-semibold mt-4 mb-2">Marketing</h3>
                  <ul className="pl-6">
                    <li>Envio de newsletters (mediante consentimento)</li>
                    <li>Informação sobre promoções e novos serviços</li>
                    <li>Pesquisas de satisfação</li>
                    <li>Comunicação de benefícios do programa de fidelidade</li>
                  </ul>
                </div>

                <div
                  id="partilha"
                  className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 scroll-mt-[160px]"
                >
                  <div className="flex items-center mb-2">
                    <Lock className="text-primary mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                      Partilha de Informações
                    </h2>
                  </div>
                  <p>
                    A Relusa não vende, aluga ou partilha os seus dados pessoais com terceiros, exceto:
                  </p>
                  <ul className="pl-6">
                    <li>Prestadores de serviços que nos auxiliam na operação (ex: processamento de pagamentos)</li>
                    <li>Autoridades competentes, quando legalmente exigido</li>
                    <li>Parceiros de confiança, com o seu consentimento explícito</li>
                  </ul>
                  <p className="mt-4">
                    Todos os nossos parceiros estão vinculados a acordos de confidencialidade e proteção de dados.
                  </p>
                </div>

                <div
                  id="seguranca"
                  className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 scroll-mt-[160px]"
                >
                  <div className="flex items-center mb-2">
                    <Lock className="text-primary mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                      Segurança de Dados
                    </h2>
                  </div>
                  <p>
                    Implementamos medidas técnicas e organizacionais para proteger os seus dados:
                  </p>
                  <ul className="pl-6">
                    <li>Encriptação SSL em todas as comunicações</li>
                    <li>Acesso restrito a dados pessoais</li>
                    <li>Monitorização regular dos sistemas</li>
                    <li>Formação em proteção de dados para colaboradores</li>
                    <li>Backups regulares e seguros</li>
                  </ul>
                </div>

                <div
                  id="direitos"
                  className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 scroll-mt-[160px]"
                >
                  <div className="flex items-center mb-2">
                    <UserCheck className="text-primary mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                      Os Seus Direitos
                    </h2>
                  </div>
                  <p>
                    Como titular dos dados, tem os seguintes direitos:
                  </p>
                  <ul className="pl-6">
                    <li>Acesso aos seus dados pessoais</li>
                    <li>Retificação de dados incorretos</li>
                    <li>Eliminação dos seus dados (&quot;direito ao esquecimento&quot;)</li>
                    <li>Limitação do tratamento</li>
                    <li>Portabilidade dos dados</li>
                    <li>Oposição ao tratamento</li>
                    <li>Retirada do consentimento</li>
                  </ul>
                  <p className="mt-4">
                    Para exercer qualquer destes direitos, contacte-nos através do email <a href="mailto:geral@relusa.pt">geral@relusa.pt</a>.
                  </p>
                </div>

                <div
                  id="cookies"
                  className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 scroll-mt-[160px]"
                >
                  <div className="flex items-center mb-2">
                    <Cookie className="text-primary mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                      Cookies e Tecnologias Semelhantes
                    </h2>
                  </div>
                  <p>
                    Utilizamos cookies e tecnologias semelhantes para:
                  </p>
                  <ul className="pl-6">
                    <li>Manter a sua sessão ativa</li>
                    <li>Lembrar as suas preferências</li>
                    <li>Analisar o uso do website</li>
                    <li>Melhorar a navegação</li>
                    <li>Personalizar o conteúdo</li>
                  </ul>
                  <p className="mt-4">
                    Pode gerir as suas preferências de cookies através das configurações do seu navegador.
                  </p>
                </div>

                <div
                  id="retencao"
                  className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 scroll-mt-[160px]"
                >
                  <div className="flex items-center mb-2">
                    <Clock className="text-primary mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                      Retenção de Dados
                    </h2>
                  </div>
                  <p>
                    Mantemos os seus dados apenas pelo tempo necessário:
                  </p>
                  <ul className="pl-6">
                    <li>Dados de cliente: durante a relação comercial + 5 anos</li>
                    <li>Dados de faturação: 10 anos (obrigação legal)</li>
                    <li>Dados de marketing: até retirada do consentimento</li>
                    <li>Histórico de serviços: 2 anos após o último serviço</li>
                  </ul>
                </div>

                <div
                  id="alteracoes"
                  className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 scroll-mt-[160px]"
                >
                  <div className="flex items-center mb-2">
                    <FileEdit className="text-primary mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                      Alterações a Esta Política
                    </h2>
                  </div>
                  <p>
                    Podemos atualizar esta política periodicamente. Quando o fizermos:
                  </p>
                  <ul className="pl-6">
                    <li>Publicaremos a versão atualizada no website</li>
                    <li>Notificaremos por email em caso de alterações significativas</li>
                    <li>Manteremos um histórico das versões anteriores</li>
                  </ul>
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
                    Para questões sobre privacidade e proteção de dados:
                  </p>
                  <ul className="pl-6">
                    <li>Email: <a href="mailto:geral@relusa.pt">geral@relusa.pt</a></li>
                    <li>Telefone: <a href="tel:+351932440827">932 440 827</a></li>
                    <li>Morada: Vila Nova de Gaia, Portugal</li>
                  </ul>
                  <p className="mt-4">
                    Responderemos a todas as solicitações relacionadas com dados pessoais no prazo máximo de 30 dias.
                  </p>
                </div>

                <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ao utilizar os nossos serviços, você confirma que leu,
                    compreendeu e concorda com esta Política de Privacidade.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                    Para mais informações, consulte os nossos{" "}
                    <Link
                      href="/termos"
                      className="text-primary hover:underline"
                    >
                      Termos de Uso
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
