
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import LoginForm from "@/components/auth/LoginForm";

const Login: React.FC = () => {
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login, loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect to dashboard if already authenticated
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

  const handleGoogleLogin = async () => {
    setLoginError(null);
    
    try {
      const success = await loginWithGoogle();
      if (success) {
        toast({
          title: "Login com Google realizado com sucesso",
          description: "Você está sendo redirecionado para a página inicial.",
          variant: "default",
        });
        navigate("/dashboard");
      } else {
        setLoginError("Não foi possível fazer login com o Google. Por favor, tente novamente mais tarde.");
        toast({
          title: "Erro ao fazer login com Google",
          description: "Não foi possível fazer login com o Google. Verifique se você permitiu os popups ou tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Google login error:", error);
      setLoginError("Ocorreu um erro ao processar sua solicitação.");
      toast({
        title: "Erro ao fazer login com Google",
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
              onGoogleLogin={handleGoogleLogin}
              error={loginError}
            />
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm">
              Não tem uma conta?{' '}
              <Link 
                to="/register" 
                className="font-medium text-freight-600 hover:underline"
              >
                Registre-se
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
