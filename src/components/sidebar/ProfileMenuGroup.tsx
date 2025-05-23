
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, Download } from "lucide-react";
import { InstallButton } from "../pwa/InstallButton";
import { usePwaInstall } from "@/hooks/usePwaInstall";

export const ProfileMenuGroup: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { isInstalled } = usePwaInstall();
  
  const handleSignOut = () => {
    signOut();
    navigate("/login");
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
      <div className="flex items-center p-2">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="ml-3 overflow-hidden">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{user.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
        </div>
      </div>
      
      <div className="space-y-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start" 
          onClick={() => navigate("/profile")}
        >
          <User className="mr-2 h-4 w-4" />
          Perfil
        </Button>
        
        {/* Adicionar o botão de instalação apenas se o PWA não estiver instalado */}
        {!isInstalled && <InstallButton />}
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950" 
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
};
