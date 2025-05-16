
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";

export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, loading, isAuthenticated, user } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    console.log("Login component: Authentication state changed", { isAuthenticated, user });
    if (isAuthenticated && user) {
      console.log("Login component: User is authenticated, redirecting to dashboard");
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica de e-mail
    if (!validateEmail(email)) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, insira um e-mail válido",
        variant: "destructive",
      });
      return;
    }
    
    // Evitar múltiplos cliques
    if (isLoggingIn) return;

    setIsLoggingIn(true);

    try {
      console.log("Login component: Attempting login with", email);
      const success = await login(email, password, keepLoggedIn);

      if (success) {
        console.log("Login component: Login successful");
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        });
      } else {
        throw new Error("Falha na autenticação");
      }
    } catch (error: any) {
      console.error("Login component: Login failed", error);
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Credenciais inválidas",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Função para validar o formato do e-mail
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    keepLoggedIn,
    setKeepLoggedIn,
    isLoggingIn,
    handleLogin,
    validateEmail
  };
};
