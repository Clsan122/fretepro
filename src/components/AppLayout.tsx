
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "./ThemeProvider";
import { useNetworkStatus } from "@/context/NetworkStatusContext";
import { Wifi, WifiOff } from "lucide-react";
import InstallPWA from "./common/InstallPWA";

// Import components
import Header from "./layout/Header";
import BottomNavigation from "./navigation/BottomNavigation";

const AppLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const { isOnline } = useNetworkStatus();
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

      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-white py-1 px-4 text-center text-sm flex items-center justify-center gap-2">
          <WifiOff size={14} />
          <span>Você está no modo offline. Os dados serão sincronizados quando você ficar online.</span>
        </div>
      )}

      {/* Main Content */}
      <main className={cn("flex-grow container mx-auto px-4 py-4", isMobile && "pb-20")}>
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

      {/* Install PWA prompt */}
      <InstallPWA />

      {/* Mobile Navigation - only on mobile */}
      {isMobile && <BottomNavigation />}
    </div>
  );
};

export default AppLayout;
