
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { navigationItems } from "./BottomNavigation";
import { ProfileMenuGroup } from "../sidebar/ProfileMenuGroup";

const DesktopSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Logo/Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-freight-600 to-freight-700 bg-clip-text text-transparent dark:from-freight-400 dark:to-freight-500">
          FreteValor
        </h1>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.name}
              variant={currentPath.startsWith(item.path) ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => navigate(item.path)}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </Button>
          ))}
        </nav>
      </div>
      
      {/* Profile Menu */}
      <div className="p-4">
        <ProfileMenuGroup />
      </div>
    </div>
  );
};

export default DesktopSidebar;
