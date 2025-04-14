
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AtSign, LogIn, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import PasswordInput from "./PasswordInput";
import GoogleLoginButton from "./GoogleLoginButton";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onGoogleLogin, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await onSubmit(email, password);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    
    try {
      await onGoogleLogin();
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="nome@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <PasswordInput 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-freight-600 hover:bg-freight-700 transition-all duration-300"
          disabled={loading}
        >
          {loading ? "Carregando..." : "Entrar"}
          <LogIn className="ml-2 h-4 w-4" />
        </Button>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-gray-800 px-2 text-muted-foreground">
            Ou continue com
          </span>
        </div>
      </div>
      
      <GoogleLoginButton 
        onClick={handleGoogleLogin}
        loading={googleLoading}
      />
    </div>
  );
};

export default LoginForm;
