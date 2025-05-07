
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "./ThemeProvider";
import { useNetworkStatus } from "@/context/NetworkStatusContext";
import { Wifi, WifiOff } from "lucide-react";
import InstallPWA from "./common/InstallPWA";
import PushNotificationButton from "./notifications/PushNotificationButton";

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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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

      <div className="flex flex-1">
        {/* Desktop Sidebar - only show on non-mobile */}
        {!isMobile && (
          <aside className={cn(
            "transition-all duration-300 ease-in-out border-r border-border/60 h-[calc(100vh-4rem)]", 
            sidebarOpen ? "w-64" : "w-16"
          )}>
            <div className="relative h-full">
              {/* Sidebar content */}
              <div className={cn(
                "p-4 transition-all duration-300",
                sidebarOpen ? "opacity-100" : "opacity-0"
              )}>
                {sidebarOpen && (
                  <nav className="space-y-2">
                    <ul className="space-y-1">
                      {navigationItems.map((item) => (
                        <li key={item.name}>
                          <button 
                            onClick={() => handleNavigate(item.path)}
                            className="flex items-center w-full p-2 rounded-md hover:bg-muted"
                          >
                            <item.icon className="h-5 w-5 mr-3" />
                            <span>{item.name}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </div>
              
              {/* Miniaturized icons when sidebar is collapsed */}
              {!sidebarOpen && (
                <div className="py-4">
                  <ul className="space-y-4 flex flex-col items-center">
                    {navigationItems.map((item) => (
                      <li key={item.name}>
                        <button 
                          onClick={() => handleNavigate(item.path)}
                          className="p-2 rounded-md hover:bg-muted" 
                          title={item.name}
                        >
                          <item.icon className="h-5 w-5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Toggle button */}
              <button
                onClick={toggleSidebar}
                className="absolute bottom-4 right-0 transform translate-x-1/2 bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center shadow-md"
                aria-label={sidebarOpen ? "Recolher menu" : "Expandir menu"}
              >
                {sidebarOpen ? "←" : "→"}
              </button>
            </div>
          </aside>
        )}
        
        {/* Main Content */}
        <main className={cn("flex-grow container mx-auto px-4 py-4", isMobile && "pb-20")}>
          {children || <Outlet />}
        </main>
      </div>

      {/* Notification settings & PWA install */}
      <div className="fixed bottom-20 left-4 md:bottom-8 md:left-auto md:right-4 z-40">
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <PushNotificationButton />
        </div>
      </div>
      
      {/* Install PWA button */}
      <InstallPWA />

      {/* Footer */}
      <footer className="bg-background-800 text-center py-4 border-t border-border/50 mt-auto">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FreteValor. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Mobile Navigation - only on mobile */}
      {isMobile && <BottomNavigation />}
    </div>
  );
};

const { navigationItems } = BottomNavigation as any;

export default AppLayout;
