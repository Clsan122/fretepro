
import React from "react";
import { useNavigate } from "react-router-dom";
import { X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeaderProps {
  isMobile: boolean;
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ isMobile, isMenuOpen, toggleMenu }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="relative z-50">
      <div className="glass-morphism border-b border-border/50 sticky top-0">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMenu}
                className="mr-2"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            )}
            <h1 
              className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              FreteValor
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center">
                {!isMobile && (
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout}
                    className="text-sm"
                  >
                    Sair
                  </Button>
                )}
              </div>
            ) : (
              <Button 
                variant="ghost" 
                onClick={() => navigate("/login")}
                className="text-sm"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
