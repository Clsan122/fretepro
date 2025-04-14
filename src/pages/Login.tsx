
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import LoginForm from "@/components/auth/LoginForm";

const Login: React.FC = () => {
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (email: string, password: string) => {
    setLoginError(null);
    
    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Você está sendo redirecionado para a página inicial.",
          variant: "default",
        });
        navigate("/dashboard");
      } else {
        setLoginError("Email ou senha inválidos.");
        toast({
          title: "Erro ao fazer login",
          description: "Email ou senha inválidos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Ocorreu um erro ao processar sua solicitação.");
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>
              Entre com seus dados para acessar o sistema
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <LoginForm 
              onSubmit={handleSubmit}
              error={loginError}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
