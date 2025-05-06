
import React from "react";
import AppLayout from "./AppLayout";
import SidebarComponent from "@/components/layout/SidebarComponent";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "./ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isOnline = useOnlineStatus();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
          {/* Collapsible Sidebar */}
          <div className={cn(
            "transition-all duration-300 ease-in-out", 
            sidebarOpen ? "w-64" : "w-0 md:w-16"
          )}>
            <SidebarComponent handleNavigate={handleNavigate} />
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="bg-background dark:bg-background/95 p-2 border-b flex items-center">
              <Button 
                variant="outline" 
                size="icon"
                onClick={toggleSidebar}
                className="h-8 w-8"
              >
                {sidebarOpen ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
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
    </SidebarProvider>
  );
};

export default Layout;
