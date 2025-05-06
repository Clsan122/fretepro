
import React from "react";
import AppLayout from "./AppLayout";
import SidebarComponent from "@/components/layout/SidebarComponent";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "./ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isOnline = useOnlineStatus();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigate = (path: string) => {
    // Navigation logic here
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
          {/* Sidebar always visible */}
          <div className="w-64">
            <SidebarComponent handleNavigate={handleNavigate} />
          </div>
          
          <div className="flex-1 flex flex-col">            
            <main className="flex-1 overflow-y-auto bg-muted/40">
              <div className="layout-main">
                {children}
              </div>
            </main>
          </div>
        </div>
        {isMobile && <BottomNavigation />}
      </div>
    </SidebarProvider>
  );
};

export default Layout;
