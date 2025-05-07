
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { navigationItems } from "./BottomNavigation";
import { ProfileMenuGroup } from "../sidebar/ProfileMenuGroup";

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
        
        <div className="mt-auto">
          <ProfileMenuGroup />
        </div>
      </div>
    </div>
  );
};

export default SidebarNavigation;
