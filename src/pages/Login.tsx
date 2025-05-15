
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AtSign, Lock, Eye, EyeOff, Truck, Package, FileText, Route } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";
import { Checkbox } from "@/components/ui/checkbox";

const Login = () => {
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
        
        // Redirect will happen via the useEffect above when isAuthenticated becomes true
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

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-freight-100 to-freight-200 dark:from-freight-900 dark:to-freight-950">
      <div className="flex-1 hidden lg:flex flex-col justify-center p-10 bg-freight-600 text-white">
        <div className="max-w-lg">
          <img 
            src="/lovable-uploads/7a2e868d-b2ae-4a11-925f-49bcc1560c2a.png" 
            alt="FreteValor Logo" 
            className="h-20 mb-8"
          />
          <h1 className="text-4xl font-bold mb-6">FreteValor</h1>
          <p className="text-xl mb-6">Cadastre e acompanhe seus fretes e tenha um relatório completo de todos os seus rendimentos.</p>
          
          <div className="space-y-6 mt-10">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Gestão de Fretes</h3>
                <p className="text-freight-100">Cadastre e acompanhe todos os seus fretes em um só lugar</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Ordens de Coleta</h3>
                <p className="text-freight-100">Gere e compartilhe ordens de coleta profissionais</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Recibos de Frete</h3>
                <p className="text-freight-100">Emita recibos personalizados para seus clientes</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Route className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Rotas e Destinos</h3>
                <p className="text-freight-100">Organize suas rotas e destinos de forma eficiente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-5">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <img 
              src="/lovable-uploads/7a2e868d-b2ae-4a11-925f-49bcc1560c2a.png" 
              alt="FreteValor Logo" 
              className="h-20 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-freight-800 dark:text-white">FreteValor</h1>
            <p className="text-freight-600 dark:text-freight-300">Sistema de gestão de fretes e transportes</p>
          </div>
          
          <Card className="shadow-lg border-freight-200 dark:border-freight-800">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold text-freight-800 dark:text-freight-200">Entrar</CardTitle>
              <CardDescription className="text-freight-600 dark:text-freight-400">
                Acesse sua conta para gerenciar seus fretes
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-freight-700 dark:text-freight-300">Email</Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-3 h-4 w-4 text-freight-400 dark:text-freight-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nome@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-freight-300 dark:border-freight-700 focus:border-freight-500 dark:focus:border-freight-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-freight-700 dark:text-freight-300">Senha</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-freight-600 hover:text-freight-800 dark:text-freight-400 dark:hover:text-freight-300 hover:underline"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-freight-400 dark:text-freight-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 border-freight-300 dark:border-freight-700 focus:border-freight-500 dark:focus:border-freight-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-freight-400 hover:text-freight-600 dark:text-freight-500 dark:hover:text-freight-400"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="keep-logged-in" 
                    checked={keepLoggedIn}
                    onCheckedChange={(checked) => setKeepLoggedIn(checked === true)}
                  />
                  <Label 
                    htmlFor="keep-logged-in" 
                    className="text-sm text-freight-700 dark:text-freight-300 cursor-pointer"
                  >
                    Permanecer logado
                  </Label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-freight-600 hover:bg-freight-700 text-white"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? "Entrando..." : "Entrar"}
                </Button>

                <div className="text-center text-sm text-freight-600 dark:text-freight-400">
                  Não tem uma conta?{' '}
                  <Link 
                    to="/register" 
                    className="font-medium text-freight-600 hover:text-freight-800 dark:text-freight-400 dark:hover:text-freight-300 hover:underline"
                  >
                    Registre-se
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
