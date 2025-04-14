
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  LogOut, 
  User, 
  Home, 
  Users,
  Truck,
  Package,
  FileText,
  Moon,
  Sun
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  theme: string;
  toggleTheme: () => void;
  location: { pathname: string };
}

const Sidebar: React.FC<SidebarProps> = ({ 
  sidebarOpen, 
  toggleSidebar, 
  theme, 
  toggleTheme,
  location
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: Home
    },
    {
      name: "Clientes",
      path: "/clients",
      icon: Users
    },
    {
      name: "Motoristas",
      path: "/drivers",
      icon: Truck
    },
    {
      name: "Fretes",
      path: "/freights",
      icon: Package
    },
    {
      name: "Ordens de Coleta",
      path: "/collection-orders",
      icon: FileText
    }
  ];
  
  return (
    <aside className={`
      fixed top-0 left-0 z-40 h-screen transition-transform
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
      md:translate-x-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
    `}>
      <div className="h-full flex flex-col">
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Sistema de Fretes</h2>
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => handleNavigate(item.path)}
                  className={`
                    flex items-center p-2 text-base font-normal rounded-lg w-full
                    ${location.pathname === item.path
                      ? "bg-freight-100 text-freight-900 dark:bg-freight-900 dark:text-freight-100"
                      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-freight-200 flex items-center justify-center text-freight-800 mr-3">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || "Usuário"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || ""}</p>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              className="justify-start w-full"
              onClick={() => handleNavigate("/profile")}
            >
              <User className="mr-2 h-4 w-4" />
              Perfil
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start w-full"
              onClick={toggleTheme}
            >
              {theme === "light" ? (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  Modo Escuro
                </>
              ) : (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  Modo Claro
                </>
              )}
            </Button>
            
            <Button 
              variant="destructive" 
              className="justify-start w-full"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
