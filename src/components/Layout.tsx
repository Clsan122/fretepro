
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Truck, Users, Package, BarChart3, LogOut, User } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="bg-freight-600 text-white w-full md:w-64 md:min-h-screen p-4">
        <div className="flex items-center justify-center md:justify-start mb-8">
          <Truck className="h-8 w-8 mr-2" />
          <h1 className="text-xl font-bold">Frete Pro</h1>
        </div>
        
        <nav className="space-y-2">
          <Link to="/dashboard" className="flex items-center p-3 rounded-lg hover:bg-freight-700 transition-colors">
            <BarChart3 className="h-5 w-5 mr-3" />
            <span>Dashboard</span>
          </Link>
          <Link to="/clients" className="flex items-center p-3 rounded-lg hover:bg-freight-700 transition-colors">
            <Users className="h-5 w-5 mr-3" />
            <span>Clientes</span>
          </Link>
          <Link to="/freights" className="flex items-center p-3 rounded-lg hover:bg-freight-700 transition-colors">
            <Package className="h-5 w-5 mr-3" />
            <span>Fretes</span>
          </Link>
          <Link to="/drivers" className="flex items-center p-3 rounded-lg hover:bg-freight-700 transition-colors">
            <User className="h-5 w-5 mr-3" />
            <span>Motoristas</span>
          </Link>
          <Link to="/profile" className="flex items-center p-3 rounded-lg hover:bg-freight-700 transition-colors">
            <User className="h-5 w-5 mr-3" />
            <span>Perfil</span>
          </Link>
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4 md:w-56">
          <div className="p-3 rounded-lg bg-freight-700">
            <div className="text-sm mb-2">Logado como:</div>
            <div className="font-semibold truncate">{user?.name}</div>
            <Button 
              onClick={handleLogout} 
              variant="ghost" 
              className="w-full mt-2 justify-start text-white hover:bg-freight-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-4 md:p-8">
        {children}
      </div>
    </div>
  );
};

export default Layout;
