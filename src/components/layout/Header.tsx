import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  MenuIcon, 
  Moon, 
  Sun, 
  LogOut 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  toggleSidebar: () => void;
  theme: string;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, theme, toggleTheme }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 transition-colors duration-300">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white ml-2 transition-colors duration-300">
          Sistema de Fretes
        </h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleTheme}
          className="hidden md:flex relative overflow-hidden"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5 transform transition-transform duration-300 rotate-0" />
          ) : (
            <Sun className="h-5 w-5 transform transition-transform duration-300 rotate-0" />
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={() => handleNavigate("/profile")}
          className="flex items-center hidden md:flex transition-transform hover:scale-105 duration-200"
        >
          <div className="h-8 w-8 rounded-full bg-freight-200 flex items-center justify-center text-freight-800 mr-2 transition-colors duration-300">
            {user?.name?.charAt(0) || "U"}
          </div>
          <span className="hidden lg:inline-block transition-colors duration-300">{user?.name || "Usuário"}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleLogout}
          className="hidden md:flex transition-transform hover:scale-105 duration-200"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
