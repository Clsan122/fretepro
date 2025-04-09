
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, UserPlus, CalendarIcon, Phone, Sun, Moon } from "lucide-react";
import { User } from "@/types";
import { saveUser, getUserByEmail } from "@/utils/storage";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState<Date>();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") || "light"
  );
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Apply theme when component mounts or theme changes
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name || !email || !birthDate || !password || !confirmPassword) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios!",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem!",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Check if email already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      toast({
        title: "Erro",
        description: "Este e-mail já está em uso!",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Create user
    const newUser: User = {
      id: uuidv4(),
      name,
      email,
      birthDate: birthDate.toISOString(),
      phone,
      createdAt: new Date().toISOString(),
    };

    // In a real app, you would hash the password before saving
    setTimeout(() => {
      saveUser(newUser);
      
      toast({
        title: "Sucesso",
        description: "Conta criada com sucesso! Você já pode fazer login.",
      });
      
      navigate("/login");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8 transition-colors duration-200">
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              {theme === "light" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Alterar tema</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Claro</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Escuro</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="dark:text-white">Nome Completo</Label>
              <Input
                id="name"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-white">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="dark:text-white">Telefone</Label>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="dark:text-white">Data de Nascimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="birthDate"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal dark:bg-gray-700 dark:text-white dark:border-gray-600",
                      !birthDate && "text-muted-foreground dark:text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthDate ? format(birthDate, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecionar data (DD/MM/AAAA)</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto dark:bg-gray-800">
                  <Calendar
                    mode="single"
                    selected={birthDate}
                    onSelect={setBirthDate}
                    initialFocus
                    locale={ptBR}
                    disabled={(date) => date > new Date() || date < new Date("1920-01-01")}
                    fromYear={1920}
                    toYear={new Date().getFullYear()}
                    captionLayout="dropdown-buttons"
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="dark:text-white">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="dark:text-white">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-freight-600 hover:bg-freight-700"
              disabled={isLoading}
            >
              {isLoading ? "Criando conta..." : "Registrar"}
              {!isLoading && <UserPlus className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-freight-600 hover:underline dark:text-freight-400">
                Faça login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
