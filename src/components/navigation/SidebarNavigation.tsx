
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, User, LogOut } from "lucide-react";
import { navigationItems } from "./BottomNavigation";
import { useAuth } from "@/context/AuthContext";
import { ProfileMenuGroup } from "@/components/sidebar/ProfileMenuGroup";

interface SidebarNavigationProps {
  isMobile: boolean;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  handleNavigate: (path: string) => void;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  sidebarOpen,
  toggleSidebar,
  handleNavigate,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!sidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="fixed top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-gray-800 p-4 shadow-lg flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">FretePro</h2>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <ul className="space-y-2 flex-1 overflow-y-auto">
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
        
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            <Button 
              variant="ghost"
              className="w-full justify-start" 
              onClick={() => navigate("/profile")}
            >
              <User className="h-4 w-4 mr-2" />
              <span>{user?.name || "Usuário"}</span>
            </Button>
            <Button 
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarNavigation;
