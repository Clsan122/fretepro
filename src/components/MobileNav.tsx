
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Users, Truck, Package, FileText, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { name: "Home", path: "/dashboard", icon: Home },
  { name: "Clientes", path: "/clients", icon: Users },
  { name: "Fretes", path: "/freights", icon: Package },
  { name: "Coletas", path: "/collection-orders", icon: FileText },
  { name: "Cotação", path: "/quotation", icon: Calculator },
];

export const MobileNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;

  const isActive = (path: string) => location.pathname === path;
  
  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border dark:border-border/30 shadow-lg md:hidden"
    >
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center justify-center relative",
              isActive(item.path) 
                ? "text-primary dark:text-primary" 
                : "text-muted-foreground"
            )}
            aria-label={item.name}
          >
            {isActive(item.path) && (
              <motion.div
                layoutId="nav-bubble"
                className="absolute -top-3 w-8 h-1 bg-primary rounded-full"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <item.icon className="h-5 w-5 mb-0.5" />
            <span className="text-[10px] leading-tight">{item.name}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default MobileNav;
