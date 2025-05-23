
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "./navigation/Header";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import SidebarNavigation from "./navigation/SidebarNavigation";
import { navigationItems } from "./navigation/BottomNavigation";
import { ProfileMenuGroup } from "./sidebar/ProfileMenuGroup";
import { InstallBanner } from "./pwa/InstallBanner";
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("theme") || (window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
    }
    return "light";
  });

  // Verificar se o app acabou de ser instalado
  useEffect(() => {
    const justInstalled = localStorage.getItem('pwa-just-installed');
    if (justInstalled === 'true') {
      toast({
        title: "App Instalado com Sucesso!",
        description: "Bem-vindo ao FreteValor. O aplicativo foi instalado em seu dispositivo.",
        duration: 5000,
      });
      localStorage.removeItem('pwa-just-installed');
    }
  }, [toast]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-900">
        {/* Sidebar para desktop */}
        <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full md:translate-x-0">
          <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="mb-6 px-2">
              <h2 className="text-2xl font-semibold text-freight-700 dark:text-freight-300">FreteValor</h2>
            </div>
            
            <ul className="space-y-2">
              {navigationItems.map(item => <li key={item.name}>
                  <button className="w-full flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-freight-50 dark:hover:bg-freight-900 rounded-lg transition-colors" onClick={() => handleNavigate(item.path)}>
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.name}
                  </button>
                </li>)}
            </ul>
            
            {/* Adiciona o ProfileMenuGroup na versão desktop */}
            <div className="mt-auto pt-4">
              <ProfileMenuGroup />
            </div>
          </div>
        </aside>

        {/* Sidebar para mobile - visível apenas quando aberta */}
        {isMobile && <SidebarNavigation isMobile={isMobile} sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} handleNavigate={handleNavigate} />}
        
        {/* Conteúdo principal */}
        <div className="flex flex-col min-h-screen w-full md:ml-64">
          <Header toggleSidebar={toggleSidebar} theme={theme} toggleTheme={toggleTheme} />
          
          <main className="flex-1 p-3 sm:p-6 lg:p-8 pb-16 md:pb-6 overflow-x-hidden">
            {children}
          </main>
          
          {/* Espaço para evitar que o conteúdo fique sob a barra de navegação em dispositivos móveis */}
          <div className="h-16 md:h-0"></div>
        </div>
        
        {/* Banner de instalação do PWA - sempre visível quando aplicável */}
        <InstallBanner />
        
        <BottomNavigation />
      </div>
    </SidebarProvider>
  );
};

export default Layout;
