
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Plus,
  X,
  Truck, 
  FileText, 
  Calculator,
  UserRound,
  Users
} from "lucide-react";

interface SubMenuItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const subMenuItems: SubMenuItem[] = [
  {
    name: "Novo Frete",
    path: "/freights",
    icon: Truck,
  },
  {
    name: "Nova Cotação", 
    path: "/quotations/new",
    icon: Calculator,
  },
  {
    name: "Nova Coleta",
    path: "/collection-orders",
    icon: FileText,
  },
  {
    name: "Novo Cliente",
    path: "/clients",
    icon: UserRound,
  },
  {
    name: "Novo Motorista",
    path: "/drivers/register",
    icon: Users,
  },
];

// Mantendo a exportação para compatibilidade com outros componentes
export const navigationItems = [
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
    name: "Cotações",
    path: "/quotations",
    icon: Calculator,
  },
  {
    name: "Clientes",
    path: "/clients",
    icon: UserRound,
  },
  {
    name: "Motoristas",
    path: "/drivers",
    icon: Users,
  }
];

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const handleSubMenuToggle = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  const handleSubMenuClick = (path: string) => {
    navigate(path);
    setIsSubMenuOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      {isSubMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSubMenuOpen(false)}
        />
      )}

      {/* Sub Menu */}
      {isSubMenuOpen && (
        <div className="fixed bottom-20 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 md:hidden">
          <div className="grid grid-cols-2 gap-2 p-4">
            {subMenuItems.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => handleSubMenuClick(item.path)}
                className="flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors touch-manipulation"
              >
                <item.icon className="w-6 h-6 mb-2 text-primary" />
                <span className="text-xs text-center font-medium">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div 
        className="fixed bottom-0 left-0 z-50 w-full bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 md:hidden safe-area-inset"
        style={{ 
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)',
          paddingLeft: 'env(safe-area-inset-left, 0)',
          paddingRight: 'env(safe-area-inset-right, 0)'
        }}
      >
        <div className="grid h-16 grid-cols-2 max-w-full mx-auto font-medium">
          {/* Home Button */}
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className={`inline-flex flex-col items-center justify-center px-1 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 group transition-colors touch-manipulation min-h-[60px] ${
              currentPath === '/dashboard'
                ? "text-primary bg-primary/10"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <Home className={`w-6 h-6 mb-1 ${
              currentPath === '/dashboard'
                ? "text-primary"
                : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
            }`} />
            <span className="text-xs leading-tight">Home</span>
          </button>

          {/* Plus Menu Button */}
          <button
            type="button"
            onClick={handleSubMenuToggle}
            className={`inline-flex flex-col items-center justify-center px-1 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 group transition-all duration-200 touch-manipulation min-h-[60px] ${
              isSubMenuOpen
                ? "text-primary bg-primary/10"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <div className={`transition-transform duration-200 ${isSubMenuOpen ? 'rotate-45' : ''}`}>
              {isSubMenuOpen ? (
                <X className="w-6 h-6 mb-1 text-primary" />
              ) : (
                <Plus className={`w-6 h-6 mb-1 ${
                  isSubMenuOpen
                    ? "text-primary"
                    : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                }`} />
              )}
            </div>
            <span className="text-xs leading-tight">Menu</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default BottomNavigation;
