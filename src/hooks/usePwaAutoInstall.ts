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
      
      // NÃO instalar automaticamente para evitar o botão "OK" 
      // O usuário pode instalar manualmente se desejar
      console.log('Prompt de instalação PWA bloqueado');
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