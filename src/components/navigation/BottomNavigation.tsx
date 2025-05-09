
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Truck, 
  Users, 
  FileText, 
  User, 
  Package, 
  Calculator
} from "lucide-react";

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

export const navigationItems: NavigationItem[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: Home,
  },
  {
    name: "Fretes",
    path: "/freights",
    icon: Truck,
  },
  {
    name: "Ordens",
    path: "/collection-orders",
    icon: FileText,
  },
  {
    name: "Cotações",
    path: "/quotations",
    icon: Calculator,
  },
  {
    name: "Motoristas",
    path: "/drivers",
    icon: Package,
  },
];

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // Importante: utilizar env-safe-area-inset-bottom para garantir compatibilidade com iPhones
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}>
      <div className="grid h-16 grid-cols-5 max-w-lg mx-auto font-medium">
        {navigationItems.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => navigate(item.path)}
            className={`inline-flex flex-col items-center justify-center px-1 hover:bg-gray-50 dark:hover:bg-gray-700 group transition-colors ${
              currentPath.startsWith(item.path)
                ? "text-freight-700 dark:text-freight-300"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <item.icon className={`w-5 h-5 mb-1 ${
              currentPath.startsWith(item.path)
                ? "text-freight-600 dark:text-freight-400"
                : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
            }`} />
            <span className="text-[10px]">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
