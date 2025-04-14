
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserPlus, Phone } from "lucide-react";

interface RegisterFormProps {
  name: string;
  email: string;
  phone: string;
  isLoading: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  name,
  email,
  phone,
  isLoading,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="dark:text-white">Nome Completo</Label>
        <Input
          id="name"
          placeholder="Seu nome completo"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className="dark:text-white">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone" className="dark:text-white">
          Telefone <span className="text-red-500">*</span>
        </Label>
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          <Input
            id="phone"
            type="tel"
            placeholder="(00) 00000-0000"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
            required
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-freight-600 hover:bg-freight-700"
        disabled={isLoading}
      >
        {isLoading ? "Criando conta..." : "Registrar"}
        {!isLoading && <UserPlus className="ml-2 h-4 w-4" />}
      </Button>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-freight-600 hover:underline dark:text-freight-400">
            Faça login
          </Link>
        </p>
      </div>
    </form>
  );
};
