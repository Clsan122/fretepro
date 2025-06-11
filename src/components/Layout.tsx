
import React from "react";
import Header from "./navigation/Header";
import BottomNavigation from "./navigation/BottomNavigation";
import DesktopSidebar from "./navigation/DesktopSidebar";
import { SyncIndicator } from "./sync/SyncIndicator";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar para desktop */}
      <div className="hidden lg:block">
        <DesktopSidebar />
      </div>
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />
        
        {/* Conteúdo principal */}
        <main className="flex-1 overflow-auto relative">
          {children}
          
          {/* Indicador de sincronização - posição fixa no canto inferior direito */}
          <div className="fixed bottom-20 lg:bottom-4 right-4 z-40">
            <SyncIndicator />
          </div>
        </main>
        
        {/* Bottom navigation para mobile */}
        <div className="lg:hidden">
          <BottomNavigation />
        </div>
      </div>
    </div>
  );
};

export default Layout;
