
import React from "react";
import { SidebarNavigation } from "./navigation/SidebarNavigation";
import { Header } from "./navigation/Header";
import { BottomNavigation } from "./navigation/BottomNavigation";
import { SyncIndicator } from "./sync/SyncIndicator";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar para desktop */}
      <div className="hidden lg:block">
        <SidebarNavigation />
      </div>
      
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header */}
        <Header />
        
        {/* Indicador de sincronização */}
        <div className="px-4 py-2 border-b bg-white dark:bg-gray-800">
          <div className="flex justify-end">
            <SyncIndicator />
          </div>
        </div>
        
        {/* Conteúdo da página */}
        <main className="flex-1 overflow-auto">
          {children}
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
