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
    // Erros de autenticação
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

    // Erros de reset de password
    "For security purposes, you can only request this once every 60 seconds":
      "Por motivos de segurança, só pode solicitar isto uma vez a cada 60 segundos.",

    // Outros erros comuns
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

  // Se não encontrarmos uma tradução específica, retornar mensagem genérica
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

  // Verificar força da password
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

      // O onAuthStateChange do Supabase irá processar automaticamente a mudança
    } catch (error: any) {
      toast.error(
        traduzirErro(error.message) || "Erro ao fazer login. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Usar implicit flow direto para a página de marcações
      const redirectUrl = new URL("/marcacoes", window.location.origin).toString();
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        throw error;
      }

      // O redirecionamento será tratado automaticamente pelo Supabase
    } catch (error: any) {
      toast.error(
        traduzirErro(error.message) ||
          "Erro ao fazer login com Google. Tente novamente."
      );
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
      // Registar o utilizador no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      // Criar o perfil do utilizador usando a função RPC create_user
      if (authData.user) {
        const { error: profileError } = await supabase.rpc(
          "create_user",
          {
            user_email: formData.email,
            user_name: formData.name,
            user_phone: formData.phone,
            user_id: authData.user.id,
          }
        );

        if (profileError) {
          throw profileError;
        }

        // Procurar os dados do utilizador para enviar o email
        const { data: userDetails } = await supabase
          .from("users")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        // Enviar email de boas-vindas
        if (userDetails) {
          await emailService.sendWelcomeEmail(userDetails);
        }

        // Criar registo de pontos de fidelidade
        await supabase
          .from("loyalty_points")
          .insert([
            {
              user_id: authData.user.id,
              points: 0,
              bookings_count: 0,
            },
          ]);
      }

      toast.success(
        "Conta criada com sucesso! Verifique o seu email para confirmar o registo."
      );
    } catch (error: any) {
      toast.error(
        traduzirErro(error.message) || "Erro ao criar conta. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        {view === "login" ? "Entrar na sua conta" : "Criar uma nova conta"}
      </h3>

      <form
        onSubmit={view === "login" ? handleLogin : handleRegister}
        className="space-y-4"
      >
        {view === "register" && (
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Nome Completo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={CHAR_LIMITS.name}
                className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                placeholder="O seu nome completo"
              />
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail size={18} className="text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              maxLength={CHAR_LIMITS.email}
              className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
              placeholder="o.seu.email@exemplo.com"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock size={18} className="text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              maxLength={CHAR_LIMITS.password}
              className="w-full pl-10 pr-10 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
              placeholder="******"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {view === "register" && formData.password && (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between items-center">
                <div className="h-1 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getStrengthColor()} transition-all duration-300`}
                    style={{ width: `${passwordStrength * 25}%` }}
                  ></div>
                </div>
                <span className="text-xs ml-2 font-medium text-gray-500 dark:text-gray-400 min-w-[40px] text-right">
                  {getStrengthText()}
                </span>
              </div>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 pl-1">
                <li
                  className={
                    formData.password.length >= 8
                      ? "text-green-500 dark:text-green-400"
                      : ""
                  }
                >
                  • Mínimo de 8 caracteres
                </li>
                <li
                  className={
                    /[A-Z]/.test(formData.password)
                      ? "text-green-500 dark:text-green-400"
                      : ""
                  }
                >
                  • Pelo menos uma letra maiúscula
                </li>
                <li
                  className={
                    /[0-9]/.test(formData.password)
                      ? "text-green-500 dark:text-green-400"
                      : ""
                  }
                >
                  • Pelo menos um número
                </li>
                <li
                  className={
                    /[^A-Za-z0-9]/.test(formData.password)
                      ? "text-green-500 dark:text-green-400"
                      : ""
                  }
                >
                  • Pelo menos um caracter especial
                </li>
              </ul>
            </div>
          )}
        </div>

        {view === "register" && (
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Telemóvel (opcional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Phone size={18} className="text-gray-400" />
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={CHAR_LIMITS.phone}
                className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                placeholder="+351 912345678"
              />
            </div>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
              {view === "login" ? "A entrar..." : "A registar..."}
            </>
          ) : (
            <>{view === "login" ? "Entrar" : "Registar"}</>
          )}
        </Button>
      </form>

      {/* Separador */}
      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
        <span className="mx-4 text-sm text-gray-500 dark:text-gray-400">
          ou
        </span>
        <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
      </div>

      {/* Botão de login com Google */}
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        <svg
          width="18"
          height="18"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
        >
          <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          />
          <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          />
          <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          />
          <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          />
        </svg>
        Continuar com Google
      </Button>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {view === "login" ? "Não tem uma conta?" : "Já tem uma conta?"}
          <button
            type="button"
            onClick={toggleView}
            className="ml-1 text-primary hover:underline focus:outline-none"
          >
            {view === "login" ? "Registar" : "Entrar"}
          </button>
        </p>
      </div>

      {view === "login" && (
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-sm text-primary hover:underline focus:outline-none"
            onClick={async () => {
              if (!formData.email) {
                toast.error(
                  "Por favor, insira o seu email para redefinir a password."
                );
                return;
              }

              setLoading(true);
              try {
                const { error } = await supabase.auth.resetPasswordForEmail(
                  formData.email,
                  {
                    redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
                  }
                );

                if (error) {
                  throw error;
                }

                toast.success(
                  "Email de redefinição de password enviado. Verifique a sua caixa de entrada."
                );
              } catch (error: any) {
                toast.error(
                  traduzirErro(error.message) ||
                    "Erro ao enviar email de redefinição. Tente novamente."
                );
              } finally {
                setLoading(false);
              }
            }}
          >
            Esqueceu a password?
          </button>
        </div>
      )}
    </div>
  );
}
