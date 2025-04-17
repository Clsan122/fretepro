
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

export const ProfileMenuGroup = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
      <h4 className="text-sm font-medium pl-2 text-gray-600 dark:text-gray-400">Perfil</h4>
      <div className="space-y-2">
        <Button 
          variant="ghost"
          className="w-full justify-start" 
          onClick={() => navigate("/profile")}
        >
          <User className="h-4 w-4 mr-2" />
          <span>{user?.name || "Usuário"}</span>
        </Button>
        <Button 
          variant="ghost"
          className="w-full justify-start" 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span>Sair</span>
        </Button>
      </div>
    </div>
  );
};
