
import React from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import SidebarComponent from "./SidebarComponent";
import MobileMenu from "./MobileMenu";
import { cn } from "@/lib/utils";
import SyncIndicator from "../common/SyncIndicator";
import { PushNotificationButton } from "../notifications/PushNotificationButton";

interface HeaderProps {
  isMobile: boolean;
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ isMobile, isMenuOpen, toggleMenu }) => {
  const { theme, toggleTheme } = useTheme();

  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <header className="bg-background dark:bg-background border-b border-border/60 sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left Side - Logo & Title */}
          <div className="flex items-center">
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMenu}
                aria-label={isMenuOpen ? "Fechar Menu" : "Abrir Menu"}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
            <h1 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              FreteValor
            </h1>
          </div>
          
          {/* Right Side - Actions */}
          <div className="flex items-center gap-2">
            <SyncIndicator />
            
            <PushNotificationButton />
            
            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleThemeToggle}
              className="p-2"
              aria-label="Alternar tema"
            >
              {theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu - only shows when menu is open on mobile */}
      {isMobile && <MobileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={toggleMenu} />}
      
      {/* Desktop Sidebar - only on desktop (non-mobile) */}
      {!isMobile && <SidebarComponent handleNavigate={() => {}} />}
    </header>
  );
};

export default Header;
