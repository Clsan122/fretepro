
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePwaInstall } from '@/hooks/usePwaInstall';
import { useToast } from '@/hooks/use-toast';

interface InstallButtonProps {
  className?: string;
}

export const InstallButton: React.FC<InstallButtonProps> = ({ className = "" }) => {
  const { isInstallable, installApp } = usePwaInstall();
  const { toast } = useToast();
  
  if (!isInstallable) {
    return null;
  }
  
  const handleInstall = async () => {
    const installed = await installApp();
    if (installed) {
      toast({
        title: "Aplicativo instalado!",
        description: "O FreteValor foi instalado com sucesso.",
      });
    } else {
      toast({
        title: "Instalação cancelada",
        description: "A instalação do aplicativo foi cancelada.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Button
      variant="outline" 
      size="sm" 
      className={`flex items-center space-x-2 w-full justify-start ${className}`} 
      onClick={handleInstall}
    >
      <Download className="h-4 w-4" />
      <span>Instalar Aplicativo</span>
    </Button>
  );
};
