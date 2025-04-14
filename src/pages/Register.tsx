
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ThemeSwitcher } from "@/components/auth/ThemeSwitcher";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { TemporaryPassword } from "@/components/auth/TemporaryPassword";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") || "light"
  );
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name || !email || !phone) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios!",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(name, email, "");
      
      if (result.success) {
        setTemporaryPassword(result.temporaryPassword);
        
        toast({
          title: "Sucesso",
          description: "Conta criada com sucesso!",
        });
      } else {
        toast({
          title: "Erro",
          description: "Este e-mail já está em uso!",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar a conta.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8 transition-colors duration-200">
      <ThemeSwitcher theme={theme} setTheme={setTheme} />

      <Card className="w-full max-w-md dark:bg-gray-800 transition-colors duration-200">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-freight-600 p-3 rounded-full">
              <Truck className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center dark:text-white">Criar Conta</CardTitle>
          <CardDescription className="text-center dark:text-gray-300">
            Cadastre-se para começar a usar o Frete Pro
          </CardDescription>
        </CardHeader>
        <CardContent>
          {temporaryPassword ? (
            <TemporaryPassword password={temporaryPassword} />
          ) : (
            <RegisterForm
              name={name}
              email={email}
              phone={phone}
              isLoading={isLoading}
              onNameChange={setName}
              onEmailChange={setEmail}
              onPhoneChange={setPhone}
              onSubmit={handleSubmit}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
