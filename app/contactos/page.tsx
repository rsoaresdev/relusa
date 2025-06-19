import Link from "next/link";
import { MapPin, Mail, Instagram, Phone, Clock, Send } from "lucide-react";
import ContactForm from "@/components/forms/ContactForm";

export const metadata = {
  title: "Contactos | Relusa - O seu carro não recusa",
  description:
    "Entre em contacto com a Relusa para agendar a sua lavagem automóvel a seco em Vila Nova de Gaia ou esclarecer dúvidas sobre os nossos serviços.",
  alternates: {
    canonical: "/contactos",
  },
};

export default function ContactosPage() {
  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-6 text-gray-900 dark:text-white">
              Contacte-<span className="text-primary">nos</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Estamos disponíveis para responder a todas as suas questões.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold font-poppins mb-6 text-gray-900 dark:text-white">
                  Informações de Contacto
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Pode entrar em contacto connosco através dos seguintes meios
                  ou preencher o formulário.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      Email
                    </h3>
                    <a
                      href="mailto:geral@relusa.pt"
                      className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                    >
                      geral@relusa.pt
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Instagram className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      Instagram
                    </h3>
                    <a
                      href="https://instagram.com/relusa.pt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                    >
                      @relusa.pt
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      Telemóvel
                    </h3>
                    <a
                      href="tel:+351932440827"
                      className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                    >
                      (+351) 932 440 827
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      Área de Serviço
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Vila Nova de Gaia e arredores
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      Horário
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Segunda a Sábado: 8h - 20h
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                  Preferência por Marcações Online
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Para sua conveniência, recomendamos agendar através da nossa
                  página de marcações para obter pontos e descontos.
                </p>
                <Link
                  href="/marcacoes"
                  className="text-primary hover:underline flex items-center"
                >
                  Ir para Marcações <Send size={16} className="ml-2" />
                </Link>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold font-poppins mb-6 text-gray-900 dark:text-white">
                  Envie-nos uma Mensagem
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold font-poppins mb-4 text-gray-900 dark:text-white">
                A Nossa Área de Serviço
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Prestamos serviço em Vila Nova de Gaia e arredores.
              </p>
            </div>

            <div className="aspect-video relative rounded-xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48048.45797934906!2d-8.652259499999999!3d41.1238437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd2464e2a77921d%3A0xcd1c8e03e8985b48!2sVila%20Nova%20de%20Gaia!5e0!3m2!1spt-PT!2spt!4v1657123456789!5m2!1spt-PT!2spt"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
