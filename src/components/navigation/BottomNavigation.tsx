
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
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
    name: "Clientes",
    path: "/clients",
    icon: UserRound,
  },
  {
    name: "Motoristas",
    path: "/drivers",
    icon: Truck,
  }
];

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  return (
    <div 
      className="fixed bottom-0 left-0 z-50 w-full bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 md:hidden safe-area-inset"
      style={{ 
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)',
        paddingLeft: 'env(safe-area-inset-left, 0)',
        paddingRight: 'env(safe-area-inset-right, 0)'
      }}
    >
      <div className="grid h-16 grid-cols-5 max-w-full mx-auto font-medium">
        {navigationItems.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => navigate(item.path)}
            className={`inline-flex flex-col items-center justify-center px-1 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 group transition-colors touch-manipulation min-h-[60px] ${
              currentPath.startsWith(item.path)
                ? "text-freight-700 bg-freight-50 dark:text-freight-300"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <item.icon className={`w-5 h-5 mb-1 ${
              currentPath.startsWith(item.path)
                ? "text-freight-600 dark:text-freight-400"
                : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
            }`} />
            <span className="text-[10px] leading-tight truncate max-w-full text-center">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
