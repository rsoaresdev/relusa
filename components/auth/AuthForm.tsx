"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/config";
import { toast } from "sonner";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import { useEmailService } from "@/lib/hooks/useEmailService";

// Definir limites de caracteres para cada campo
const CHAR_LIMITS = {
  name: 50,
  email: 100,
  password: 50,
  phone: 20,
};

interface AuthFormProps {
  view: "login" | "register";
  toggleView: () => void;
}

// Função para traduzir mensagens de erro do Supabase
const traduzirErro = (mensagem: string): string => {
  const errosTraducoes: Record<string, string> = {
    "Invalid login credentials": "Credenciais de login inválidas.",
    "Email not confirmed":
      "Email não confirmado. Por favor, verifique sua caixa de entrada.",
    "User already registered": "Este email já está registado.",
    "Password should be at least 6 characters":
      "A password deve ter pelo menos 6 caracteres.",
    "Email format is invalid": "Formato de email inválido.",
    "Rate limit exceeded":
      "Limite de tentativas excedido. Tente novamente mais tarde.",
    "Invalid email or password": "Email ou password inválidos.",
    "Email link is invalid or has expired":
      "O link de email é inválido ou expirou.",
    "Token has expired or is invalid": "O token expirou ou é inválido.",
    "User not found": "Utilizador não encontrado.",
    "Unable to validate email address":
      "Não foi possível validar o endereço de email.",
    "For security purposes, you can only request this once every 60 seconds":
      "Por motivos de segurança, só pode solicitar isto uma vez a cada 60 segundos.",
    "Database error": "Erro de base de dados. Tente novamente mais tarde.",
    "Server error": "Erro de servidor. Tente novamente mais tarde.",
    "Service unavailable": "Serviço indisponível. Tente novamente mais tarde.",
  };

  // Verificar se temos uma tradução específica para este erro
  for (const [chave, traducao] of Object.entries(errosTraducoes)) {
    if (mensagem.includes(chave)) {
      return traducao;
    }
  }

  return "Ocorreu um erro. Por favor, tente novamente.";
};

export default function AuthForm({ view, toggleView }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Hook de email
  const emailService = useEmailService();

  // Verificar segurança da password
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (formData.password.length >= 8) strength += 1;
    if (/[A-Z]/.test(formData.password)) strength += 1;
    if (/[0-9]/.test(formData.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;

    setPasswordStrength(strength);
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200 dark:bg-gray-700";
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (!formData.password) return "";
    if (passwordStrength === 1) return "Fraca";
    if (passwordStrength === 2) return "Média";
    if (passwordStrength === 3) return "Boa";
    return "Forte";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      toast.success("Login efetuado com sucesso!");
      // O estado será atualizado automaticamente pelo listener
    } catch (error: any) {
      toast.error(traduzirErro(error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/marcacoes`,
        },
      });

      if (error) {
        throw error;
      }
      // O redirecionamento será tratado automaticamente
    } catch (error: any) {
      toast.error(traduzirErro(error.message));
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name.trim()) {
      toast.error("Por favor, insira o seu nome.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user && !data.session) {
        toast.success(
          "Conta criada! Verifique o seu email para confirmar a conta."
        );
        toggleView(); // Mudar para login
      } else {
        toast.success("Conta criada e login efetuado com sucesso!");
      }
    } catch (error: any) {
      toast.error(traduzirErro(error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast.error("Por favor, insira o seu email primeiro.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        formData.email,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );

      if (error) {
        throw error;
      }

      toast.success(
        "Email de recuperação enviado! Verifique a sua caixa de entrada."
      );
    } catch (error: any) {
      toast.error(traduzirErro(error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-lg border border-border/50 shadow-sm p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">
            {view === "login" ? "Entrar" : "Criar Conta"}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {view === "login"
              ? "Entre na sua conta para agendar lavagens"
              : "Crie uma conta para começar a agendar"}
          </p>
        </div>

        <form
          onSubmit={view === "login" ? handleLogin : handleRegister}
          className="space-y-4"
        >
          {view === "register" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="O seu nome completo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Telefone (opcional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="+351 xxx xxx xxx"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="exemplo@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-12 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="A sua password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {view === "register" && formData.password && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Segurança da password:</span>
                  <span>{getStrengthText()}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "A processar..."
              : view === "login"
              ? "Entrar"
              : "Criar Conta"}
          </Button>
        </form>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">ou</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full mt-4"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loading ? "A conectar..." : "Continuar com Google"}
          </Button>
        </div>

        <div className="mt-6 text-center space-y-2">
          {view === "login" && (
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={loading}
              className="text-sm text-primary hover:underline disabled:opacity-50"
            >
              Esqueceu-se da password?
            </button>
          )}

          <p className="text-sm text-muted-foreground">
            {view === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
            <button
              type="button"
              onClick={toggleView}
              disabled={loading}
              className="text-primary hover:underline disabled:opacity-50"
            >
              {view === "login" ? "Criar conta" : "Entrar"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
