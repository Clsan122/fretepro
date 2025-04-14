
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, Truck, Package, FileText, Menu, Settings, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Clientes", path: "/clients", icon: Users },
    { name: "Motoristas", path: "/drivers", icon: Truck },
    { name: "Fretes", path: "/freights", icon: Package },
    { name: "Coletas", path: "/collection-orders", icon: FileText },
  ];
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg md:hidden">
        <div className="grid grid-cols-6 h-16">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center ${
                isActive(item.path) 
                  ? "text-freight-600 dark:text-freight-400" 
                  : "text-gray-500 dark:text-gray-400"
              }`}
              aria-label={item.name}
            >
              <item.icon className="h-5 w-5 mb-0.5" />
              <span className="text-[10px] leading-tight">{item.name}</span>
            </button>
          ))}
          <button
            onClick={() => setIsMoreMenuOpen(true)}
            className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400"
            aria-label="Mais"
          >
            <Menu className="h-5 w-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Mais</span>
          </button>
        </div>
      </div>

      <Sheet open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
        <SheetContent side="bottom" className="h-auto rounded-t-xl">
          <SheetHeader className="text-left pb-2">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Opções adicionais</SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-2 py-4">
            <SheetClose asChild>
              <Button 
                variant="outline" 
                className="flex flex-col h-24 items-center justify-center gap-1"
                onClick={() => navigate("/profile")}
              >
                <User className="h-6 w-6" />
                <span>Perfil</span>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button 
                variant="outline" 
                className="flex flex-col h-24 items-center justify-center gap-1"
                onClick={() => navigate("/settings")}
              >
                <Settings className="h-6 w-6" />
                <span>Configurações</span>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button 
                variant="outline" 
                className="flex flex-col h-24 items-center justify-center gap-1 col-span-2"
                onClick={handleLogout}
              >
                <LogOut className="h-6 w-6" />
                <span>Sair</span>
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default BottomNavigation;
