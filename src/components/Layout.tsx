
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "./ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SidebarComponent from "@/components/layout/SidebarComponent";
import InstallPWA from "./common/InstallPWA";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isOnline = useOnlineStatus();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <Header 
          isMobile={isMobile} 
          isMenuOpen={isMenuOpen} 
          toggleMenu={toggleMenu} 
        />
        <div className="flex flex-1">
          {/* Desktop Sidebar - only show on non-mobile */}
          {!isMobile && (
            <aside className={cn(
              "transition-all duration-300 ease-in-out border-r border-border/60", 
              sidebarOpen ? "w-64" : "w-12"
            )}>
              <div className={cn(
                "h-full transition-all duration-300",
                sidebarOpen ? "opacity-100" : "opacity-70"
              )}>
                <SidebarComponent handleNavigate={handleNavigate} />
                
                {/* Botão de toggle da sidebar */}
                <div className="absolute left-0 bottom-4 w-full flex justify-center">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={toggleSidebar}
                    className="h-8 w-8"
                    aria-label={sidebarOpen ? "Recolher sidebar" : "Expandir sidebar"}
                  >
                    {sidebarOpen ? (
                      <ChevronLeft className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </aside>
          )}
          
          <div className="flex-1 flex flex-col relative">
            {/* Indicador de status online/offline */}
            {!isOnline && (
              <div className="bg-orange-500/90 text-white text-center py-1 px-2 text-sm">
                Você está offline. Algumas funcionalidades podem estar limitadas.
              </div>
            )}
            
            <main className="flex-1 overflow-y-auto bg-muted/40">
              <div className="layout-main pb-20 md:pb-4">
                {children}
              </div>
            </main>
            
            {/* Botão de instalação do PWA */}
            <InstallPWA />
          </div>
        </div>

        {/* Mobile Navigation - only on mobile */}
        {isMobile && <BottomNavigation />}
      </div>
    </SidebarProvider>
  );
};

export default Layout;
