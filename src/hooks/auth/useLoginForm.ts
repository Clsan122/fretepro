
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";

interface LoginParams {
  email: string;
  password: string;
  keepLoggedIn: boolean;
  event: React.FormEvent | null;
}

export const useLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, loading, isAuthenticated, user } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    console.log("Login component: Authentication state changed", { isAuthenticated, user });
    if (isAuthenticated && user) {
      console.log("Login component: User is authenticated, redirecting to dashboard");
      // Verificar se há uma rota de retorno armazenada no state
      const from = location.state?.from || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleLogin = async ({ email, password, keepLoggedIn, event }: LoginParams) => {
    if (event) {
      event.preventDefault();
    }
    
    // Evitar múltiplos cliques
    if (isLoggingIn) return;

    setIsLoggingIn(true);

    try {
      console.log("Login component: Attempting login with", email, "keepLoggedIn:", keepLoggedIn);
      const success = await login(email, password, keepLoggedIn);

      if (success) {
        console.log("Login component: Login successful, redirecting will happen via useEffect");
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        });
        
        // Não é necessário redirecionar manualmente aqui, o useEffect cuidará disso
        // após a atualização do estado de autenticação
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

  return {
    showPassword,
    setShowPassword,
    isLoggingIn,
    handleLogin,
  };
};
