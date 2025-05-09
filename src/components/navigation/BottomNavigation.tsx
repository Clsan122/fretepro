
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Truck, 
  Users, 
  FileText, 
  Package,
  Scale
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
    name: "Cotações",
    path: "/quotations",
    icon: Scale,
  },
  {
    name: "Ordens",
    path: "/collection-orders",
    icon: FileText,
  },
  {
    name: "Motoristas",
    path: "/drivers",
    icon: Users,
  },
  {
    name: "Clientes",
    path: "/clients",
    icon: Package,
  },
];

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 md:hidden safe-bottom">
      <div className="grid h-full grid-cols-6 max-w-lg mx-auto">
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
            <item.icon className={`w-4 h-4 mb-1 ${
              currentPath.startsWith(item.path)
                ? "text-freight-600 dark:text-freight-400"
                : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
            }`} />
            <span className="text-[10px] truncate">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
