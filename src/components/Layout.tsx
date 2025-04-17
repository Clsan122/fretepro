
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  ChevronLeft, 
  LogOut, 
  User, 
  Home, 
  Sun,
  Moon,
  Menu as MenuIcon,
  LayoutDashboard,
  Users,
  Truck,
  Package,
  FileText
} from "lucide-react";
import { ProfileMenuGroup } from "./sidebar/ProfileMenuGroup";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent 
} from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
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
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Clientes", path: "/clients", icon: Users },
    { name: "Motoristas", path: "/drivers", icon: Truck },
    { name: "Fretes", path: "/freights", icon: Package },
    { name: "Coletas", path: "/collection-orders", icon: FileText }
  ];

  const MobileSidebar = () => {
    if (!sidebarOpen) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/50">
        <div className="fixed top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-gray-800 p-4 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">FretePro</h2>
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
          
          <ul className="space-y-2">
            {navItems.map((item) => (
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
          
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="w-full justify-start"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    );
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
              {navItems.map((item) => (
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

        {isMobile && <MobileSidebar />}
        
        <div className="md:ml-64 min-h-screen pb-16 md:pb-0">
          <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden"
                onClick={toggleSidebar}
              >
                <MenuIcon className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white ml-2">
                FretePro
              </h1>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </header>
          
          <main>
            {children}
          </main>
        </div>
        
        <BottomNavigationBar />
      </div>
    </SidebarProvider>
  );
};

const BottomNavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Clientes", path: "/clients", icon: Users },
    { name: "Motoristas", path: "/drivers", icon: Truck },
    { name: "Fretes", path: "/freights", icon: Package },
    { name: "Coletas", path: "/collection-orders", icon: FileText }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center ${
              isActive(item.path) 
                ? "text-freight-600 dark:text-freight-400" 
                : "text-gray-500 dark:text-gray-400"
            }`}
            aria-label={item.name}
          >
            <item.icon className="h-5 w-5 mb-0.5" />
            <span className="text-[10px] leading-tight">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Layout;
