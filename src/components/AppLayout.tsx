
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "@/components/MobileNav";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "./ThemeProvider";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { navigationItems } from "./navigation/BottomNavigation";

const AppLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-background dark:bg-background w-full">
        {/* Header */}
        <header className="relative z-50">
          <div className="glass-morphism border-b border-border/50 sticky top-0">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <div className="flex items-center">
                {isMobile && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleMenu}
                    className="mr-2"
                  >
                    {isMenuOpen ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Menu className="w-5 h-5" />
                    )}
                  </Button>
                )}
                <h1 
                  className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent cursor-pointer"
                  onClick={() => navigate("/dashboard")}
                >
                  FreteValor
                </h1>
              </div>
              
              <div className="flex items-center gap-2">
                <ThemeToggle />
                
                {user ? (
                  <div className="flex items-center">
                    {!isMobile && (
                      <Button 
                        variant="ghost" 
                        onClick={handleLogout}
                        className="text-sm"
                      >
                        Sair
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate("/login")}
                    className="text-sm"
                  >
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMobile && (
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
                  <a 
                    onClick={() => {
                      navigate("/dashboard");
                      setIsMenuOpen(false);
                    }} 
                    className="py-2 px-3 rounded hover:bg-accent cursor-pointer"
                  >
                    Dashboard
                  </a>
                  <a 
                    onClick={() => {
                      navigate("/clients");
                      setIsMenuOpen(false);
                    }} 
                    className="py-2 px-3 rounded hover:bg-accent cursor-pointer"
                  >
                    Clientes
                  </a>
                  <a 
                    onClick={() => {
                      navigate("/freights");
                      setIsMenuOpen(false);
                    }}
                    className="py-2 px-3 rounded hover:bg-accent cursor-pointer"
                  >
                    Fretes
                  </a>
                  <a 
                    onClick={() => {
                      navigate("/collection-orders");
                      setIsMenuOpen(false);
                    }}
                    className="py-2 px-3 rounded hover:bg-accent cursor-pointer"
                  >
                    Ordens de Coleta
                  </a>
                  <a 
                    onClick={() => {
                      navigate("/quotation");
                      setIsMenuOpen(false);
                    }}
                    className="py-2 px-3 rounded hover:bg-accent cursor-pointer"
                  >
                    Cotação
                  </a>
                  <a 
                    onClick={() => {
                      navigate("/profile");
                      setIsMenuOpen(false);
                    }}
                    className="py-2 px-3 rounded hover:bg-accent cursor-pointer"
                  >
                    Perfil
                  </a>
                  <a 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="py-2 px-3 rounded hover:bg-accent cursor-pointer"
                  >
                    Sair
                  </a>
                </nav>
              </div>
            </motion.div>
          )}
        </header>

        <div className="flex flex-1">
          {/* Desktop Sidebar */}
          {!isMobile && (
            <Sidebar variant="sidebar" collapsible="icon">
              <SidebarHeader className="flex items-center justify-center py-3">
                <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">FretePro</h2>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Menu</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {navigationItems.map((item) => (
                        <SidebarMenuItem key={item.name}>
                          <SidebarMenuButton 
                            tooltip={item.name}
                            isActive={window.location.pathname === item.path}
                            onClick={() => handleNavigate(item.path)}
                          >
                            <item.icon className="mr-2 h-4 w-4" />
                            <span>{item.name}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter className="mt-auto">
                <SidebarGroup>
                  <SidebarGroupLabel>Perfil</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          tooltip="Perfil"
                          onClick={() => handleNavigate("/profile")}
                          isActive={window.location.pathname === "/profile"}
                        >
                          <svg className="mr-2 h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <span>Perfil</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          tooltip="Sair"
                          onClick={handleLogout}
                        >
                          <svg className="mr-2 h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" x2="9" y1="12" y2="12" />
                          </svg>
                          <span>Sair</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarFooter>
            </Sidebar>
          )}

          {/* Content */}
          <main className={cn("flex-grow container mx-auto px-4 py-4", isMobile && "has-mobile-nav")}>
            {children || <Outlet />}
          </main>
        </div>

        {/* Footer */}
        <footer className="bg-background-800 text-center py-4 border-t border-border/50 mt-auto">
          <div className="container mx-auto px-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} FreteValor. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
