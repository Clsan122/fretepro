
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "@/components/MobileNav";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const AppLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background">
      {/* Header */}
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
                className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent"
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
        
        {/* Mobile Menu */}
        {isMobile && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: isMenuOpen ? "auto" : 0,
              opacity: isMenuOpen ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className={cn(
              "absolute w-full bg-background/95 dark:bg-background/95 backdrop-blur-md shadow-lg overflow-hidden z-50",
              !isMenuOpen && "pointer-events-none"
            )}
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-3">
                <a 
                  onClick={() => {
                    navigate("/dashboard");
                    setIsMenuOpen(false);
                  }} 
                  className="py-2 px-3 rounded hover:bg-accent cursor-pointer"
                >
                  Dashboard
                </a>
                <a 
                  onClick={() => {
                    navigate("/clients");
                    setIsMenuOpen(false);
                  }} 
                  className="py-2 px-3 rounded hover:bg-accent cursor-pointer"
                >
                  Clientes
                </a>
                <a 
                  onClick={() => {
                    navigate("/freights");
                    setIsMenuOpen(false);
                  }}
                  className="py-2 px-3 rounded hover:bg-accent cursor-pointer"
                >
                  Fretes
                </a>
                <a 
                  onClick={() => {
                    navigate("/collection-orders");
                    setIsMenuOpen(false);
                  }}
                  className="py-2 px-3 rounded hover:bg-accent cursor-pointer"
                >
                  Ordens de Coleta
                </a>
                <a 
                  onClick={() => {
                    navigate("/quotation");
                    setIsMenuOpen(false);
                  }}
                  className="py-2 px-3 rounded hover:bg-accent cursor-pointer"
                >
                  Cotação
                </a>
                <a 
                  onClick={() => {
                    navigate("/profile");
                    setIsMenuOpen(false);
                  }}
                  className="py-2 px-3 rounded hover:bg-accent cursor-pointer"
                >
                  Perfil
                </a>
                <a 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="py-2 px-3 rounded hover:bg-accent cursor-pointer"
                >
                  Sair
                </a>
              </nav>
            </div>
          </motion.div>
        )}
      </header>

      {/* Content */}
      <main className={cn("flex-grow container mx-auto px-4 py-4 has-mobile-nav")}>
        {children || <Outlet />}
      </main>

      {/* Footer */}
      <footer className="bg-background-800 text-center py-4 border-t border-border/50 mt-auto">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FreteValor. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
