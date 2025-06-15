"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Definir limites de caracteres para cada campo
const CHAR_LIMITS = {
  name: 50,
  email: 100,
  phone: 20,
  message: 1000,
};

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Atualizar contagem de caracteres quando a mensagem mudar
  useEffect(() => {
    setCharCount(formData.message.length);
  }, [formData.message]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Verificar se o valor excede o limite de caracteres
    if (
      CHAR_LIMITS[name as keyof typeof CHAR_LIMITS] &&
      value.length > CHAR_LIMITS[name as keyof typeof CHAR_LIMITS]
    ) {
      return;
    }

    // Verificar se é o campo de telefone e permitir apenas números e +
    if (name === "phone" && value !== "") {
      const phoneRegex = /^\+?[0-9\s-]*$/;
      if (!phoneRegex.test(value)) {
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validar dados do formulário
      if (!formData.name.trim()) {
        throw new Error("Por favor, insira o seu nome.");
      }

      if (!formData.email.trim()) {
        throw new Error("Por favor, insira o seu email.");
      }

      if (!formData.subject) {
        throw new Error("Por favor, selecione um assunto.");
      }

      if (!formData.message.trim()) {
        throw new Error("Por favor, insira a sua mensagem.");
      }

      // Enviar para a API
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-request-type": "contact-form",
        },
        body: JSON.stringify({
          type: "contact_form",
          data: formData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Erro ao enviar mensagem. Tente novamente."
        );
      }

      // Sucesso
      toast.success(
        "Mensagem enviada com sucesso! Entraremos em contacto brevemente."
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      toast.error(
        error.message ||
          "Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Nome Completo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength={CHAR_LIMITS.name}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
            placeholder="O seu nome"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            maxLength={CHAR_LIMITS.email}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
            placeholder="O seu email"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Telemóvel (opcional)
          </label>
          <div className="relative">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              maxLength={CHAR_LIMITS.phone}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
              placeholder="+351 912345678"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Assunto
          </label>
          <Select
            value={formData.subject}
            onValueChange={(value) => handleSelectChange("subject", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um assunto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="info_geral">Informações Gerais</SelectItem>
              <SelectItem value="marcacoes_personalizadas">
                Marcações Personalizadas
              </SelectItem>
              <SelectItem value="legal">Assuntos Legais</SelectItem>
              <SelectItem value="parcerias">Parcerias Comerciais</SelectItem>
              <SelectItem value="reclamacao">Reclamação</SelectItem>
              <SelectItem value="elogio_feedback">Elogio e feedback</SelectItem>
              <SelectItem value="sugestao">Sugestão</SelectItem>
              <SelectItem value="faturacao">Faturação e Pagamentos</SelectItem>
              <SelectItem value="outro">Outro Assunto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Mensagem
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            maxLength={CHAR_LIMITS.message}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white resize-none"
            placeholder="Como podemos ajudar?"
          ></textarea>
          <div className="mt-1 flex justify-end">
            <span
              className={`text-xs ${
                charCount === CHAR_LIMITS.message
                  ? "text-red-500 dark:text-red-400"
                  : charCount > CHAR_LIMITS.message * 0.9
                  ? "text-amber-500 dark:text-amber-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {charCount}/{CHAR_LIMITS.message}
            </span>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
            A enviar...
          </>
        ) : (
          <>
            <Send size={16} />
            Enviar Mensagem
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
        Ao submeter este formulário, concorda com a nossa{" "}
        <a href="/privacidade" className="text-primary hover:underline">
          Política de Privacidade
        </a>
        .
      </p>
    </form>
  );
}
