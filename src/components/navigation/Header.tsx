
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
    <header className="sticky top-0 z-50 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="h-full max-w-screen-2xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden text-freight-600 dark:text-freight-400 hover:bg-freight-50 dark:hover:bg-freight-900"
            onClick={toggleSidebar}
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-freight-600 to-freight-700 bg-clip-text text-transparent dark:from-freight-400 dark:to-freight-500">
            FretePro
          </h1>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="text-freight-600 dark:text-freight-400 hover:bg-freight-50 dark:hover:bg-freight-900"
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
