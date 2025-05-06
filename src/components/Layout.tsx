import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, Home, TruckIcon, Users, FileText, LogOut, ChevronDown, X, Settings, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import SyncIndicator from "./common/SyncIndicator";
import UserMenu from "./Layout/UserMenu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const authContext = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    if (authContext) {
      authContext.logout();
      navigate("/");
    }
  };

  // Check if user is available before rendering user-specific UI
  const user = authContext?.user;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with desktop menu */}
      <header className="bg-blue-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold flex items-center">
            <TruckIcon className="mr-2" />
            FreteValor
          </Link>

          {/* Desktop menu */}
          <nav className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-200">
                  Dashboard
                </Link>
                <div className="relative group">
                  <button
                    onClick={() => toggleDropdown("freights")}
                    className="flex items-center hover:text-blue-200"
                  >
                    Fretes <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <div
                    className={cn(
                      "absolute z-10 mt-2 w-48 rounded-md bg-white shadow-lg",
                      activeDropdown === "freights" ? "block" : "hidden"
                    )}
                  >
                    <div className="py-1">
                      <Link
                        to="/freights"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Listar Fretes
                      </Link>
                      <Link
                        to="/freights/new"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Novo Frete
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <button
                    onClick={() => toggleDropdown("collection")}
                    className="flex items-center hover:text-blue-200"
                  >
                    Coletas <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <div
                    className={cn(
                      "absolute z-10 mt-2 w-48 rounded-md bg-white shadow-lg",
                      activeDropdown === "collection" ? "block" : "hidden"
                    )}
                  >
                    <div className="py-1">
                      <Link
                        to="/collection-orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Listar Ordens
                      </Link>
                      <Link
                        to="/collection-order/new"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Nova Ordem
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <button
                    onClick={() => toggleDropdown("clients")}
                    className="flex items-center hover:text-blue-200"
                  >
                    Clientes <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <div
                    className={cn(
                      "absolute z-10 mt-2 w-48 rounded-md bg-white shadow-lg",
                      activeDropdown === "clients" ? "block" : "hidden"
                    )}
                  >
                    <div className="py-1">
                      <Link
                        to="/clients"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Listar Clientes
                      </Link>
                      <Link
                        to="/clients/new"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Novo Cliente
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <button
                    onClick={() => toggleDropdown("drivers")}
                    className="flex items-center hover:text-blue-200"
                  >
                    Motoristas <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <div
                    className={cn(
                      "absolute z-10 mt-2 w-48 rounded-md bg-white shadow-lg",
                      activeDropdown === "drivers" ? "block" : "hidden"
                    )}
                  >
                    <div className="py-1">
                      <Link
                        to="/drivers"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Listar Motoristas
                      </Link>
                      <Link
                        to="/drivers/new"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Novo Motorista
                      </Link>
                    </div>
                  </div>
                </div>
                <Link to="/quotation" className="hover:text-blue-200 flex items-center gap-1">
                  <Calculator className="h-4 w-4" />
                  Cotação
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className="hover:text-blue-200">
                  Home
                </Link>
                <Link to="/login" className="hover:text-blue-200">
                  Login
                </Link>
                <Link to="/register" className="hover:text-blue-200">
                  Registrar
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="text-white p-1">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px] bg-white">
                <SheetHeader className="border-b pb-4">
                  <SheetTitle className="flex justify-between items-center">
                    <span className="flex items-center">
                      <TruckIcon className="mr-2" />
                      FreteValor
                    </span>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-4 w-4" />
                      </Button>
                    </SheetClose>
                  </SheetTitle>
                </SheetHeader>
                {user ? (
                  <div className="py-4">
                    <SheetClose asChild>
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        <Home className="mr-3 h-5 w-5" />
                        Dashboard
                      </Link>
                    </SheetClose>
                    
                    <div className="px-4 py-2">
                      <div
                        className="flex justify-between items-center text-gray-800"
                        onClick={() => toggleDropdown("mobileFreights")}
                      >
                        <div className="flex items-center">
                          <TruckIcon className="mr-3 h-5 w-5" />
                          Fretes
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                      {activeDropdown === "mobileFreights" && (
                        <div className="mt-2 ml-8 space-y-1">
                          <SheetClose asChild>
                            <Link
                              to="/freights"
                              className="block py-1 text-gray-700 hover:text-blue-600"
                            >
                              Listar Fretes
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link
                              to="/freights/new"
                              className="block py-1 text-gray-700 hover:text-blue-600"
                            >
                              Novo Frete
                            </Link>
                          </SheetClose>
                        </div>
                      )}
                    </div>
                    
                    <div className="px-4 py-2">
                      <div
                        className="flex justify-between items-center text-gray-800"
                        onClick={() => toggleDropdown("mobileCollection")}
                      >
                        <div className="flex items-center">
                          <FileText className="mr-3 h-5 w-5" />
                          Coletas
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                      {activeDropdown === "mobileCollection" && (
                        <div className="mt-2 ml-8 space-y-1">
                          <SheetClose asChild>
                            <Link
                              to="/collection-orders"
                              className="block py-1 text-gray-700 hover:text-blue-600"
                            >
                              Listar Ordens
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link
                              to="/collection-order/new"
                              className="block py-1 text-gray-700 hover:text-blue-600"
                            >
                              Nova Ordem
                            </Link>
                          </SheetClose>
                        </div>
                      )}
                    </div>
                    
                    <div className="px-4 py-2">
                      <div
                        className="flex justify-between items-center text-gray-800"
                        onClick={() => toggleDropdown("mobileClients")}
                      >
                        <div className="flex items-center">
                          <Users className="mr-3 h-5 w-5" />
                          Clientes
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                      {activeDropdown === "mobileClients" && (
                        <div className="mt-2 ml-8 space-y-1">
                          <SheetClose asChild>
                            <Link
                              to="/clients"
                              className="block py-1 text-gray-700 hover:text-blue-600"
                            >
                              Listar Clientes
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link
                              to="/clients/new"
                              className="block py-1 text-gray-700 hover:text-blue-600"
                            >
                              Novo Cliente
                            </Link>
                          </SheetClose>
                        </div>
                      )}
                    </div>
                    
                    <div className="px-4 py-2">
                      <div
                        className="flex justify-between items-center text-gray-800"
                        onClick={() => toggleDropdown("mobileDrivers")}
                      >
                        <div className="flex items-center">
                          <Users className="mr-3 h-5 w-5" />
                          Motoristas
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                      {activeDropdown === "mobileDrivers" && (
                        <div className="mt-2 ml-8 space-y-1">
                          <SheetClose asChild>
                            <Link
                              to="/drivers"
                              className="block py-1 text-gray-700 hover:text-blue-600"
                            >
                              Listar Motoristas
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link
                              to="/drivers/new"
                              className="block py-1 text-gray-700 hover:text-blue-600"
                            >
                              Novo Motorista
                            </Link>
                          </SheetClose>
                        </div>
                      )}
                    </div>

                    <SheetClose asChild>
                      <Link
                        to="/quotation"
                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        <Calculator className="mr-3 h-5 w-5" />
                        Cotação
                      </Link>
                    </SheetClose>
                    
                    <SheetClose asChild>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        <Settings className="mr-3 h-5 w-5" />
                        Meu Perfil
                      </Link>
                    </SheetClose>
                    
                    <div className="flex items-center justify-between px-4 py-2 mt-4 border-t">
                      <div className="flex">
                        <SyncIndicator />
                      </div>
                      
                      <SheetClose asChild>
                        <Button 
                          variant="ghost" 
                          onClick={handleLogout}
                          className="flex items-center px-2 text-gray-800 hover:bg-gray-100"
                        >
                          <LogOut className="mr-2 h-5 w-5" />
                          Sair
                        </Button>
                      </SheetClose>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 space-y-2">
                    <SheetClose asChild>
                      <Link
                        to="/"
                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        <Home className="mr-3 h-5 w-5" />
                        Home
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/login"
                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        <LogOut className="mr-3 h-5 w-5" />
                        Login
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/register"
                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        <Users className="mr-3 h-5 w-5" />
                        Registrar
                      </Link>
                    </SheetClose>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex">
            {user ? (
              <UserMenu />
            ) : (
              <Button
                onClick={() => navigate("/login")}
                variant="ghost"
                className="text-white hover:text-blue-200"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} FreteValor. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
