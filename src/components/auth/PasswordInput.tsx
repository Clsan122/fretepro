
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Link } from "react-router-dom";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  required?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  id = "password",
  required = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>Senha</Label>
        <Link 
          to="/forgot-password" 
          className="text-sm text-freight-600 hover:underline"
        >
          Esqueceu a senha?
        </Link>
      </div>
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={value}
          onChange={onChange}
          className="pl-10 pr-10"
          required={required}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          <span className="sr-only">
            {showPassword ? "Ocultar senha" : "Mostrar senha"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
