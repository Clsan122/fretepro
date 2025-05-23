
import React, { useState } from 'react';
import { X, Download, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePwaInstall } from '@/hooks/usePwaInstall';
import { useToast } from '@/hooks/use-toast';

export const InstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, installApp } = usePwaInstall();
  const [dismissed, setDismissed] = useState(false);
  const { toast } = useToast();
  
  // Não mostrar se não for instalável, já estiver instalado ou for dispensado
  if (!isInstallable || isInstalled || dismissed) {
    return null;
  }
  
  const handleInstall = async () => {
    const installed = await installApp();
    if (installed) {
      toast({
        title: "Aplicativo instalado!",
        description: "O FreteValor foi instalado com sucesso.",
      });
    }
  };
  
  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };
  
  return (
    <div className="fixed bottom-16 left-0 right-0 mx-auto max-w-md px-4 z-50 md:bottom-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-freight-100 dark:bg-freight-900 p-2 rounded-full">
            <Download className="h-5 w-5 text-freight-600 dark:text-freight-300" />
          </div>
          <div>
            <p className="text-sm font-medium">Instalar FreteValor</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Acesse mais rápido e trabalhe offline</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={handleDismiss}
            aria-label="Dispensar"
          >
            <X className="h-4 w-4" />
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="bg-freight-600 hover:bg-freight-700" 
            onClick={handleInstall}
          >
            Instalar
          </Button>
        </div>
      </div>
    </div>
  );
};
