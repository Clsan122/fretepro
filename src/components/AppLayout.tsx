
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "./ThemeProvider";
import { SidebarProvider } from "@/components/ui/sidebar";

// Import our new components
import Header from "./layout/Header";
import MobileMenu from "./layout/MobileMenu";
import SidebarComponent from "./layout/SidebarComponent";

const AppLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background w-full">
      {/* Header Component */}
      <Header 
        isMobile={isMobile} 
        isMenuOpen={isMenuOpen} 
        toggleMenu={toggleMenu} 
      />
      
      {/* Mobile Menu Component */}
      {isMobile && (
        <MobileMenu 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen} 
        />
      )}

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <SidebarProvider defaultOpen={true}>
          {!isMobile && (
            <SidebarComponent handleNavigate={handleNavigate} />
          )}

          {/* Content */}
          <main className={cn("flex-grow container mx-auto px-4 py-4", isMobile && "has-mobile-nav")}>
            {children || <Outlet />}
          </main>
        </SidebarProvider>
      </div>

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
