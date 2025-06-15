"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, ArrowLeft, Shield } from "lucide-react";
import { supabase, performLogout } from "@/lib/supabase/config";

// Definir limite de caracteres para a senha
const PASSWORD_CHAR_LIMIT = 50;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isValidSession, setIsValidSession] = useState(false);

  // Verificar se temos um token de redefinição de senha na URL
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar se o utilizador está numa sessão de redefinição de senha
        const { data, error } = await supabase.auth.getSession();

        // Se não tiver sessão ou houver erro, redirecionar
        if (error || !data.session) {
          toast.error(
            "Link de redefinição de password inválido ou expirado. Por favor, solicite um novo."
          );
          setTimeout(() => {
            router.push("/");
          }, 3000);
          return;
        }

        // Verificar se a sessão é válida para reset de password
        // Uma sessão de recovery tem características específicas
        const user = data.session.user;
        
        // Se o utilizador não tem email confirmado ou a sessão é muito antiga, pode ser inválida
        if (!user.email_confirmed_at) {
          // Log apenas em desenvolvimento
          if (process.env.NODE_ENV === 'development') {
            console.log("Sessão de recovery detetada - permitindo reset password");
          }
        }
        
        setIsValidSession(true);
      } catch (error) {
        toast.error(
          "Erro ao verificar sessão. Por favor, solicite um novo link de redefinição."
        );
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    };

    checkAuth();
  }, [router]);

  // Verificar força da password
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);
    setCharCount(password.length);
  }, [password]);

  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200 dark:bg-gray-700";
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (!password) return "";
    if (passwordStrength === 1) return "Fraca";
    if (passwordStrength === 2) return "Média";
    if (passwordStrength === 3) return "Boa";
    return "Forte";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= PASSWORD_CHAR_LIMIT) {
      setPassword(value);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= PASSWORD_CHAR_LIMIT) {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("A password deve ter pelo menos 6 caracteres.");
      return;
    }

    if (passwordStrength < 2) {
      toast.error("Por favor, escolha uma password mais forte.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As passwords não coincidem.");
      return;
    }

    setLoading(true);

    try {
      // Atualizar a password do utilizador
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        throw error;
      }

      // Mostrar toast de sucesso
      toast.success("Password redefinida com sucesso!");

      // IMPORTANTE: Fazer logout para forçar novo login com a nova password
      await performLogout();

      // Redirecionar imediatamente para a página inicial
      router.push("/");
    } catch (error: any) {
      toast.error(
        error.message || "Erro ao redefinir password. Tente novamente."
      );
      setLoading(false);
    }
  };

  // Se a sessão não for válida, mostrar loading
  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            A verificar link de redefinição...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Por favor aguarde.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Header com gradiente */}
          <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Redefinir Password</h2>
                  <p className="text-white/80 text-sm">Crie uma nova password segura</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/")}
                disabled={loading}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft size={18} />
              </Button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
                <div className="h-1 bg-primary rounded-full w-1/2"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Após alterar a password, será necessário fazer login novamente por motivos de segurança.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                  >
                    Nova Password
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={handlePasswordChange}
                      required
                      minLength={6}
                      maxLength={PASSWORD_CHAR_LIMIT}
                      disabled={loading}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white transition-all duration-200"
                      placeholder="Insira a sua nova password"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none disabled:opacity-50 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {charCount}/{PASSWORD_CHAR_LIMIT} caracteres
                    </p>
                  </div>

                  {password && (
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Força da password:
                        </span>
                        <span className={`text-xs font-medium ${
                          passwordStrength === 1 ? "text-red-500" :
                          passwordStrength === 2 ? "text-yellow-500" :
                          passwordStrength === 3 ? "text-blue-500" :
                          passwordStrength === 4 ? "text-green-500" : "text-gray-400"
                        }`}>
                          {getStrengthText()}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getStrengthColor()} transition-all duration-300 rounded-full`} 
                          style={{ width: `${passwordStrength * 25}%` }}
                        ></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className={`flex items-center space-x-1 ${password.length >= 8 ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>
                          <span>{password.length >= 8 ? "✓" : "○"}</span>
                          <span>8+ caracteres</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${/[A-Z]/.test(password) ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>
                          <span>{/[A-Z]/.test(password) ? "✓" : "○"}</span>
                          <span>Maiúscula</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${/[0-9]/.test(password) ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>
                          <span>{/[0-9]/.test(password) ? "✓" : "○"}</span>
                          <span>Número</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${/[^A-Za-z0-9]/.test(password) ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>
                          <span>{/[^A-Za-z0-9]/.test(password) ? "✓" : "○"}</span>
                          <span>Especial</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                  >
                    Confirmar Password
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      required
                      minLength={6}
                      maxLength={PASSWORD_CHAR_LIMIT}
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white transition-all duration-200"
                      placeholder="Confirme a sua nova password"
                    />
                  </div>
                  {password && confirmPassword && (
                    <div className={`flex items-center space-x-2 text-xs mt-2 ${password === confirmPassword ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                      <span>{password === confirmPassword ? "✓" : "✗"}</span>
                      <span>{password === confirmPassword ? "As passwords coincidem" : "As passwords não coincidem"}</span>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl" 
                disabled={loading || !password || !confirmPassword || password !== confirmPassword || passwordStrength < 2}
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                    A redefinir password...
                  </>
                ) : (
                  <>
                    <Shield size={16} className="mr-2" />
                    Redefinir Password
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p className="font-medium mb-1">Informação de Segurança</p>
                  <p>Após alterar a sua password, a sessão atual será terminada e terá de fazer login novamente com as suas novas credenciais.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
