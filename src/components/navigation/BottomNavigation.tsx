
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, Truck, Package, FileText, Calculator } from "lucide-react";

export const navigationItems = [
  { name: "Dashboard", path: "/dashboard", icon: Home },
  { name: "Clientes", path: "/clients", icon: Users },
  { name: "Motoristas", path: "/drivers", icon: Truck },
  { name: "Fretes", path: "/freights", icon: Package },
  { name: "Coletas", path: "/collection-orders", icon: FileText },
  { name: "Cotação", path: "/quotations", icon: Calculator }
];

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleNavigation = (path: string) => {
    // Special case for quotation - redirect to the quotation view directly
    if (path === "/quotations") {
      navigate("/quotation");
    } else {
      navigate(path);
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg md:hidden">
      <div className="grid grid-cols-6 h-16">
        {navigationItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.path)}
            className={`flex flex-col items-center justify-center ${
              isActive(item.path) 
                ? "text-purple-600 dark:text-purple-400" 
                : "text-gray-500 dark:text-gray-400"
            }`}
            aria-label={item.name}
          >
            <item.icon className="h-5 w-5 mb-0.5" />
            <span className="text-[10px] leading-tight">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
