
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "./layout/Sidebar";
import MobileSidebar from "./layout/MobileSidebar";
import Header from "./layout/Header";
import BottomNavigation from "./BottomNavigation";
import { useTheme } from "./layout/ThemeProvider";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        theme={theme}
        toggleTheme={toggleTheme}
        location={location}
      />
      
      {isMobile && (
        <MobileSidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          theme={theme}
          toggleTheme={toggleTheme}
          location={location}
        />
      )}
      
      <div className={`md:ml-64 min-h-screen pb-16 md:pb-0 transition-all duration-300`}>
        <Header 
          toggleSidebar={toggleSidebar} 
          theme={theme}
          toggleTheme={toggleTheme}
        />
        
        <main>
          {children}
        </main>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Layout;
