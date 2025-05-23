
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePwaInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar se já está instalado
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          window.matchMedia('(display-mode: window-controls-overlay)').matches ||
                          (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone);
    };

    checkInstalled();

    // Verificar instalabilidade em dispositivos Android via User-Agent
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    // No Chrome para desktop, verifique se o navegador suporta PWAs
    const isChrome = /Chrome/i.test(navigator.userAgent) && !/Edge|Edg/i.test(navigator.userAgent);
    const isSafari = /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);
    
    // Se estiver em um Android ou Chrome desktop, podemos tentar forçar a detecção mesmo sem o evento
    if ((isAndroid || isChrome || isSafari) && !isInstalled) {
      setTimeout(() => {
        if (!deferredPrompt) {
          console.log('Forçando flag de instalabilidade para Android/Chrome/Safari');
          setIsInstallable(true);
        }
      }, 3000);
    }

    // Capturar o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevenir que o Chrome mostre o prompt automaticamente
      e.preventDefault();
      // Guardar o evento para usar mais tarde
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      console.log('Aplicativo é instalável! Evento beforeinstallprompt capturado.');
    };

    // Detectar quando o PWA foi instalado
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('App instalado com sucesso!');
      
      // Exibir notificação de sucesso via localStorage para persistir entre recarregamentos
      localStorage.setItem('pwa-just-installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    // Verificar instalação periódicamente (para caso o usuário instale fora do nosso fluxo)
    const checkInterval = setInterval(checkInstalled, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearInterval(checkInterval);
    };
  }, [deferredPrompt]);

  const installApp = async () => {
    if (deferredPrompt) {
      try {
        // Mostrar o prompt de instalação
        await deferredPrompt.prompt();
        
        // Esperar pela escolha do usuário
        const choiceResult = await deferredPrompt.userChoice;
        
        // Reset o prompt - só pode ser usado uma vez
        setDeferredPrompt(null);
        
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuário aceitou a instalação');
          setIsInstallable(false);
          return true;
        } else {
          console.log('Usuário recusou a instalação');
          // Ainda permitimos tentar novamente mais tarde
          setTimeout(() => setIsInstallable(true), 300000); // 5 minutos
          return false;
        }
      } catch (error) {
        console.error('Erro ao instalar o PWA:', error);
        return false;
      }
    } else if (isInstallable) {
      // Para dispositivos onde não temos o evento mas queremos orientar o usuário
      // Exibir instruções de instalação manual baseado na plataforma
      alert(`
        Para instalar o FreteValor no seu dispositivo:
        
        1. No Chrome/Edge (Android ou PC): 
           - Toque no menu (três pontos) no canto superior direito
           - Selecione "Instalar aplicativo" ou "Adicionar à tela inicial"
           
        2. No Safari (iOS): 
           - Toque no ícone de compartilhamento
           - Selecione "Adicionar à Tela de Início"
      `);
      return false;
    }
    
    return false;
  };

  return { isInstallable, isInstalled, installApp };
};
