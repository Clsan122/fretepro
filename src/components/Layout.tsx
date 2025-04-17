
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "./navigation/Header";
import BottomNavigation from "./BottomNavigation";
import SidebarNavigation from "./navigation/SidebarNavigation";
import { Button } from "@/components/ui/button";
import { navigationItems } from "./navigation/BottomNavigation";
import { ProfileMenuGroup } from "./sidebar/ProfileMenuGroup";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  
  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
        <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full md:translate-x-0">
          <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="mb-6 px-2">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">FretePro</h2>
            </div>
            
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigate(item.path)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-4">
              <ProfileMenuGroup />
            </div>
          </div>
        </aside>

        {isMobile && (
          <SidebarNavigation
            isMobile={isMobile}
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
            handleNavigate={handleNavigate}
          />
        )}
        
        <div className="md:ml-64 min-h-screen pb-16 md:pb-0">
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
    </SidebarProvider>
  );
};

export default Layout;
