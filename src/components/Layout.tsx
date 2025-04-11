
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Truck, 
  Users, 
  Package, 
  BarChart3, 
  LogOut, 
  User, 
  Menu, 
  X, 
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  const isFormPath = location.pathname.includes("/new") || 
                     location.pathname.includes("/edit") || 
                     location.pathname === "/profile";

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/clients", label: "Clientes", icon: Users },
    { path: "/freights", label: "Fretes", icon: Package },
    { path: "/drivers", label: "Motoristas", icon: User },
  ];

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  const NavLinks = () => (
    <nav className="space-y-2">
      {navItems.map((item) => (
        <Link 
          key={item.path}
          to={item.path} 
          className={cn(
            "flex items-center p-3 rounded-lg transition-colors",
            isCurrentPath(item.path) 
              ? "bg-freight-700 text-white font-medium" 
              : "hover:bg-freight-700"
          )}
          onClick={() => isMobile && setSidebarOpen(false)}
        >
          <item.icon className="h-5 w-5 mr-3" />
          <span>{item.label}</span>
        </Link>
      ))}
      <Link 
        to="/profile" 
        className={cn(
          "flex items-center p-3 rounded-lg transition-colors",
          isCurrentPath("/profile") 
            ? "bg-freight-700 text-white font-medium" 
            : "hover:bg-freight-700"
        )}
        onClick={() => isMobile && setSidebarOpen(false)}
      >
        <User className="h-5 w-5 mr-3" />
        <span>Perfil</span>
      </Link>
    </nav>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="bg-freight-600 text-white p-3 flex items-center justify-between sticky top-0 z-10 shadow-md">
        <div className="flex items-center">
          {!isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white mr-2"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
          )}
          
          <div className="flex items-center">
            <Truck className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">Frete Pro</h1>
          </div>
          
          {!isMobile && (
            <NavigationMenu className="ml-6">
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.path}>
                    <NavigationMenuLink 
                      asChild
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent hover:bg-freight-700 focus:bg-freight-700",
                        isCurrentPath(item.path) && "bg-freight-700 font-medium"
                      )}
                    >
                      <Link to={item.path}>{item.label}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>
        
        {isMobile && (
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-freight-600 text-white p-4 w-64 z-50">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Truck className="h-6 w-6 mr-2" />
                  <h2 className="text-xl font-bold">Frete Pro</h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSidebarOpen(false)}
                  className="text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <NavLinks />
            </SheetContent>
          </Sheet>
        )}
        
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center text-sm">
            <User className="h-4 w-4 mr-1" />
            <span className="mr-2">{user?.name}</span>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="ghost" 
            size="sm"
            className="text-white hover:bg-freight-700"
          >
            <LogOut className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - hidden on mobile and conditionally collapsed on desktop */}
        {!isMobile && (
          <div 
            className={cn(
              "bg-freight-600 text-white min-h-[calc(100vh-57px)] transition-all duration-300 ease-in-out",
              sidebarCollapsed ? "w-16" : "w-64",
              isFormPath ? "hidden md:block" : "hidden md:block"
            )}
          >
            <div className="p-3">
              {sidebarCollapsed ? (
                <div className="flex flex-col items-center space-y-6 py-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex justify-center items-center p-2 rounded-lg w-10 h-10 transition-colors",
                        isCurrentPath(item.path) 
                          ? "bg-freight-700 text-white" 
                          : "hover:bg-freight-700"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </Link>
                  ))}
                  <Link
                    to="/profile"
                    className={cn(
                      "flex justify-center items-center p-2 rounded-lg w-10 h-10 transition-colors",
                      isCurrentPath("/profile") 
                        ? "bg-freight-700 text-white" 
                        : "hover:bg-freight-700"
                    )}
                  >
                    <User className="h-5 w-5" />
                  </Link>
                </div>
              ) : (
                <NavLinks />
              )}
            </div>
          </div>
        )}

        {/* Main content - full width on forms, responsive otherwise */}
        <div className={cn(
          "flex-1 overflow-auto p-4 md:p-6",
          isFormPath ? "w-full" : ""
        )}>
          {isFormPath && !isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
            </Button>
          )}
          {children}
        </div>
      </div>

      {/* Bottom navigation for mobile on form pages */}
      {isMobile && isFormPath && (
        <Drawer>
          <DrawerTrigger asChild>
            <Button 
              className="fixed bottom-4 right-4 rounded-full h-12 w-12 flex items-center justify-center bg-freight-600 hover:bg-freight-700 shadow-lg"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="px-4 pb-4">
            <DrawerHeader>
              <DrawerTitle>Navegação</DrawerTitle>
              <DrawerDescription>Acesse outras áreas do sistema</DrawerDescription>
            </DrawerHeader>
            <div className="grid grid-cols-4 gap-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100 text-center"
                >
                  <item.icon className="h-6 w-6 mb-1" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              ))}
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Fechar</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default Layout;
