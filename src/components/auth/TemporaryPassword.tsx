
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface TemporaryPasswordProps {
  password: string;
}

export const TemporaryPassword: React.FC<TemporaryPasswordProps> = ({ password }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="p-4 border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
        <h3 className="font-semibold mb-2">Senha Temporária</h3>
        <p className="text-sm mb-2">Use a senha abaixo para fazer seu primeiro acesso:</p>
        <div className="bg-white dark:bg-gray-700 p-3 rounded-md text-center font-mono">
          {password}
        </div>
        <p className="text-xs mt-2 text-yellow-600 dark:text-yellow-400">
          Importante: Guarde esta senha! Você precisará alterá-la no primeiro acesso.
        </p>
      </div>
      <Button 
        className="w-full"
        onClick={() => navigate("/login")}
      >
        Ir para Login
      </Button>
    </div>
  );
};
