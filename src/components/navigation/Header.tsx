
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MenuIcon, Moon, Sun, LogOut } from "lucide-react";
import { useAuth } from "@/context/auth";
import { useNavigate } from "react-router-dom";
import SidebarNavigation from "./SidebarNavigation";
import { TMSSyncIndicator } from "@/components/tms/TMSSyncIndicator";

const Header: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <>
      <header 
        className="sticky top-0 z-50 h-14 sm:h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm" 
        style={{
          paddingTop: 'env(safe-area-inset-top, 0)',
          paddingLeft: 'env(safe-area-inset-left, 0)',
          paddingRight: 'env(safe-area-inset-right, 0)'
        }}
      >
        <div className="h-full max-w-screen-2xl mx-auto px-3 sm:px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-freight-600 dark:text-freight-400 hover:bg-freight-50 dark:hover:bg-freight-900 touch-manipulation" 
              onClick={toggleSidebar}
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
            <h1 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-freight-600 to-freight-700 bg-clip-text text-transparent dark:from-freight-400 dark:to-freight-500 truncate">
              FreteValor
            </h1>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-3">
            <TMSSyncIndicator />
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-freight-600 dark:text-freight-400 hover:bg-freight-50 dark:hover:bg-freight-900 touch-manipulation" 
              onClick={toggleTheme}
            >
              {theme === "light" ? <Moon className="h-4 w-4 sm:h-5 sm:w-5" /> : <Sun className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-freight-600 dark:text-freight-400 hover:bg-freight-50 dark:hover:bg-freight-900 touch-manipulation" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </header>

      <SidebarNavigation
        isMobile={true}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        handleNavigate={handleNavigate}
      />
    </>
  );
};

export default Header;
