
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Truck, Users, Package, BarChart3, LogOut, User, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  const NavLinks = () => (
    <nav className="space-y-2">
      <Link 
        to="/dashboard" 
        className="flex items-center p-3 rounded-lg hover:bg-freight-700 transition-colors"
        onClick={() => isMobile && setSidebarOpen(false)}
      >
        <BarChart3 className="h-5 w-5 mr-3" />
        <span>Dashboard</span>
      </Link>
      <Link 
        to="/clients" 
        className="flex items-center p-3 rounded-lg hover:bg-freight-700 transition-colors"
        onClick={() => isMobile && setSidebarOpen(false)}
      >
        <Users className="h-5 w-5 mr-3" />
        <span>Clientes</span>
      </Link>
      <Link 
        to="/freights" 
        className="flex items-center p-3 rounded-lg hover:bg-freight-700 transition-colors"
        onClick={() => isMobile && setSidebarOpen(false)}
      >
        <Package className="h-5 w-5 mr-3" />
        <span>Fretes</span>
      </Link>
      <Link 
        to="/drivers" 
        className="flex items-center p-3 rounded-lg hover:bg-freight-700 transition-colors"
        onClick={() => isMobile && setSidebarOpen(false)}
      >
        <User className="h-5 w-5 mr-3" />
        <span>Motoristas</span>
      </Link>
      <Link 
        to="/profile" 
        className="flex items-center p-3 rounded-lg hover:bg-freight-700 transition-colors"
        onClick={() => isMobile && setSidebarOpen(false)}
      >
        <User className="h-5 w-5 mr-3" />
        <span>Perfil</span>
      </Link>
    </nav>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="bg-freight-600 text-white p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <Truck className="h-6 w-6 mr-2" />
          <h1 className="text-xl font-bold">Frete Pro</h1>
        </div>
        
        {isMobile && (
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-freight-600 text-white p-4 w-64">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Truck className="h-6 w-6 mr-2" />
                  <h2 className="text-xl font-bold">Frete Pro</h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSidebarOpen(false)}
                  className="text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <NavLinks />
            </SheetContent>
          </Sheet>
        )}
        
        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-sm">
            <span className="mr-2">Olá, {user?.name}</span>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="ghost" 
            size="sm"
            className="text-white hover:bg-freight-700"
          >
            <LogOut className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - hidden on mobile */}
        {!isMobile && (
          <div className="bg-freight-600 text-white w-64 min-h-[calc(100vh-64px)] p-4 hidden md:block">
            <NavLinks />
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
