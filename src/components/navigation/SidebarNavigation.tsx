
import React from "react";
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
    <div className="fixed inset-0 z-50 bg-black/50 touch-none">
      <div 
        className="fixed top-0 left-0 z-50 h-screen w-64 max-w-[80%] bg-white dark:bg-gray-800 p-4 shadow-lg overflow-y-auto"
        style={{ 
          paddingTop: 'max(env(safe-area-inset-top), 16px)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 16px)',
          paddingLeft: 'max(env(safe-area-inset-left), 16px)',
          paddingRight: '16px'
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">FretePro</h2>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="touch-manipulation">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <Button
                variant="ghost"
                className="w-full justify-start touch-manipulation"
                onClick={() => handleNavigate(item.path)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            </li>
          ))}
        </ul>
        
        <div className="mt-auto pt-6">
          <ProfileMenuGroup />
        </div>
      </div>
    </div>
  );
};

export default SidebarNavigation;
