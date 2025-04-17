
import React from "react";
import { Button } from "@/components/ui/button";
import { MenuIcon, Moon, Sun } from "lucide-react";

interface HeaderProps {
  toggleSidebar: () => void;
  theme: string;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, theme, toggleTheme }) => {
  return (
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
  );
};

export default Header;
