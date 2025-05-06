
import React, { useState } from "react";
import AppLayout from "./AppLayout";
import SidebarComponent from "@/components/layout/SidebarComponent";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { MenuIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isOnline = useOnlineStatus();
  const isMobile = useIsMobile();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigate = (path: string) => {
    // Navigation logic here
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header 
        isMobile={isMobile} 
        isMenuOpen={isMenuOpen} 
        toggleMenu={toggleMenu} 
      />
      <div className="flex flex-1">
        {/* Sidebar com capacidade de toggle */}
        <div className={cn("transition-all duration-300 ease-in-out", 
          sidebarVisible ? "w-64" : "w-0 overflow-hidden")}>
          <SidebarComponent handleNavigate={handleNavigate} />
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="bg-background dark:bg-background/95 p-2 border-b">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleSidebar}
              className="flex items-center gap-1"
            >
              {sidebarVisible ? (
                <>
                  <XIcon className="h-4 w-4" />
                  Hide Sidebar
                </>
              ) : (
                <>
                  <MenuIcon className="h-4 w-4" />
                  Show Sidebar
                </>
              )}
            </Button>
          </div>
          
          <main className="flex-1 overflow-y-auto bg-muted/40">
            <div className="layout-main">
              {children}
            </div>
          </main>
        </div>
      </div>
      {isMobile && <BottomNavigation />}
    </div>
  );
};

export default Layout;
