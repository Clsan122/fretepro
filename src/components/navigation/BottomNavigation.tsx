
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Users,
  Truck, 
  FileText, 
  Calculator,
  UserRound
} from "lucide-react";

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

export const navigationItems: NavigationItem[] = [
  {
    name: "Home",
    path: "/dashboard",
    icon: Home,
  },
  {
    name: "Motoristas",
    path: "/drivers",
    icon: Truck,
  },
  {
    name: "Fretes",
    path: "/freights",
    icon: Truck,
  },
  {
    name: "Coletas",
    path: "/collection-orders",
    icon: FileText,
  },
  {
    name: "Cotações",
    path: "/quotations",
    icon: Calculator,
  },
  {
    name: "Clientes",
    path: "/clients",
    icon: UserRound,
  }
];

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  return (
    <div 
      className="fixed bottom-0 left-0 z-50 w-full bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 md:hidden"
      style={{ 
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
        paddingLeft: 'env(safe-area-inset-left, 0)',
        paddingRight: 'env(safe-area-inset-right, 0)'
      }}
    >
      <div className="grid h-14 sm:h-16 grid-cols-6 max-w-lg mx-auto font-medium">
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
            <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 mb-0.5 sm:mb-1 ${
              currentPath.startsWith(item.path)
                ? "text-freight-600 dark:text-freight-400"
                : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
            }`} />
            <span className="text-[9px] sm:text-[10px] leading-tight">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
