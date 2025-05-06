
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { navigationItems } from "@/components/navigation/BottomNavigation";

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ 
        height: isMenuOpen ? "auto" : 0,
        opacity: isMenuOpen ? 1 : 0
      }}
      transition={{ duration: 0.3 }}
      className={cn(
        "absolute w-full bg-background/95 dark:bg-background/95 backdrop-blur-md shadow-lg overflow-hidden z-50",
        !isMenuOpen && "pointer-events-none"
      )}
    >
      <div className="container mx-auto px-4 py-4">
        <nav className="flex flex-col space-y-3">
          {navigationItems.map((item) => (
            <a 
              key={item.name}
              onClick={() => handleNavigation(item.path)} 
              className="py-2 px-3 rounded hover:bg-accent cursor-pointer"
            >
              {item.name}
            </a>
          ))}
          <a 
            onClick={() => handleNavigation("/profile")}
            className="py-2 px-3 rounded hover:bg-accent cursor-pointer"
          >
            Perfil
          </a>
          <a 
            onClick={handleLogout}
            className="py-2 px-3 rounded hover:bg-accent cursor-pointer"
          >
            Sair
          </a>
        </nav>
      </div>
    </motion.div>
  );
};

export default MobileMenu;
