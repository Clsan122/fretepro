
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RefreshCw, X } from 'lucide-react';
import { useUpdate } from '@/context/UpdateContext';
import { useToast } from '@/hooks/use-toast';

export const UpdateNotification: React.FC = () => {
  const { isUpdateAvailable, setIsUpdateAvailable, applyUpdate } = useUpdate();
  const { toast } = useToast();

  if (!isUpdateAvailable) {
    return null;
  }

  const handleUpdate = async () => {
    try {
      toast({
        title: "Aplicando atualização...",
        description: "O aplicativo será recarregado em alguns segundos.",
        variant: "default",
        duration: 3000,
      });
      
      await applyUpdate();
    } catch (error) {
      console.error('Erro ao aplicar atualização:', error);
      toast({
        title: "Erro na atualização",
        description: "Não foi possível aplicar a atualização. Tente recarregar a página manualmente.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleDismiss = () => {
    setIsUpdateAvailable(false);
    toast({
      title: "Atualização adiada",
      description: "Você pode atualizar mais tarde recarregando a página.",
      duration: 4000,
    });
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Alert className="border-freight-200 bg-white dark:bg-gray-800 shadow-lg">
        <RefreshCw className="h-4 w-4 text-freight-600" />
        <AlertTitle className="text-freight-700 dark:text-freight-300">
          Nova versão disponível!
        </AlertTitle>
        <AlertDescription className="text-gray-600 dark:text-gray-300 mb-3">
          Uma nova versão do FreteValor está disponível com melhorias e correções.
        </AlertDescription>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleUpdate}
            className="flex-1"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar agora
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Alert>
    </div>
  );
};
