
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MenuIcon, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/auth";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigationItems } from "./BottomNavigation";

const MobileHeader: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setIsOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <header 
      className="sticky top-0 z-50 h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm md:h-16" 
      style={{
        paddingTop: 'env(safe-area-inset-top, 0)',
        paddingLeft: 'env(safe-area-inset-left, 0)',
        paddingRight: 'env(safe-area-inset-right, 0)'
      }}
    >
      <div className="h-full max-w-screen-2xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden text-freight-600 dark:text-freight-400 hover:bg-freight-50 dark:hover:bg-freight-900 touch-manipulation h-10 w-10" 
              >
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="text-left text-freight-700">Menu</SheetTitle>
              </SheetHeader>
              <div className="py-2">
                {/* User info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-freight-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-freight-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.name || user?.email}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.companyName || 'FreteValor'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation items */}
                <nav className="py-2">
                  {navigationItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavigate(item.path)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </button>
                  ))}
                </nav>

                {/* Logout */}
                <div className="border-t border-gray-100 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <h1 className="text-lg font-semibold bg-gradient-to-r from-freight-600 to-freight-700 bg-clip-text text-transparent dark:from-freight-400 dark:to-freight-500 truncate max-w-32 sm:max-w-none">
            FreteValor
          </h1>
        </div>
        
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-freight-600 dark:text-freight-400 hover:bg-freight-50 dark:hover:bg-freight-900 touch-manipulation h-10 w-10" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
