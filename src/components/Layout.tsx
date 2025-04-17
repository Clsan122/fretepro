import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => handleNavigate("/dashboard")}
              className="gap-1 hidden md:flex"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
              className="hidden md:flex"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => handleNavigate("/profile")}
              className="flex items-center hidden md:flex"
            >
              <div className="h-8 w-8 rounded-full bg-freight-200 flex items-center justify-center text-freight-800 mr-2">
                {user?.name?.charAt(0) || "U"}
              </div>
              <span className="hidden lg:inline-block">{user?.name || "Usuário"}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout}
              className="hidden md:flex"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>
        
        <main>
          {children}
        </main>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Layout;
