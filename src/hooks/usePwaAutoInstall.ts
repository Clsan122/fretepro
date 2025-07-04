import { useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePwaAutoInstall = () => {
  useEffect(() => {
    let deferredPrompt: BeforeInstallPromptEvent | null = null;

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevenir que o Chrome mostre o prompt automaticamente
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      
      // Aguardar um pouco e tentar instalar automaticamente
      setTimeout(async () => {
        if (deferredPrompt) {
          try {
            // Tentar instalar automaticamente sem mostrar o prompt
            await deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;
            
            if (choiceResult.outcome === 'accepted') {
              console.log('PWA instalado automaticamente');
            }
            
            deferredPrompt = null;
          } catch (error) {
            console.log('Instalação automática não foi possível');
          }
        }
      }, 3000); // Aguarda 3 segundos após a página carregar
    };

    const handleAppInstalled = () => {
      console.log('PWA foi instalado');
      deferredPrompt = null;
    };

    // Verificar se já está instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        window.matchMedia('(display-mode: window-controls-overlay)').matches ||
                        (window.navigator as any).standalone === true;

    if (!isStandalone) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);
};