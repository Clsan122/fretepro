
import { useState, useEffect } from 'react';
import { 
  checkServiceWorker, 
  ensureImageCaching, 
  runPWADiagnostic, 
  updateServiceWorker 
} from '@/utils/pwa-manager';

type PWAStatus = {
  isInstalled: boolean;
  canInstall: boolean;
  isOnline: boolean;
  serviceWorkerActive: boolean;
  offlineReady: boolean;
};

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

/**
 * Hook para gerenciar funcionalidades do PWA
 */
export function usePWA() {
  const [status, setStatus] = useState<PWAStatus>({
    isInstalled: false,
    canInstall: false,
    isOnline: navigator.onLine,
    serviceWorkerActive: false,
    offlineReady: false
  });
  
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [diagnosticResult, setDiagnosticResult] = useState<Record<string, any> | null>(null);
  const [isImagesPreCached, setIsImagesPreCached] = useState<boolean>(false);

  // Verificar status inicial
  useEffect(() => {
    const checkInitialStatus = async () => {
      const diagnostic = await runPWADiagnostic();
      setDiagnosticResult(diagnostic);
      
      setStatus({
        isInstalled: diagnostic.installed,
        canInstall: diagnostic.installable,
        isOnline: navigator.onLine,
        serviceWorkerActive: diagnostic.serviceWorkerActive,
        offlineReady: diagnostic.offlineCapable
      });
      
      // Verificar e garantir cache de imagens
      if (navigator.onLine && diagnostic.serviceWorkerActive) {
        const cached = await ensureImageCaching();
        setIsImagesPreCached(cached);
      }
    };
    
    checkInitialStatus();
  }, []);
  
  // Capturar o evento beforeinstallprompt para uso posterior
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Impedir comportamento padrão
      e.preventDefault();
      
      // Armazenar evento para uso posterior
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setStatus(prev => ({ ...prev, canInstall: true }));
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Verificar se já está instalado
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                           window.matchMedia('(display-mode: window-controls-overlay)').matches ||
                           (window.navigator as any).standalone === true;
      
      setStatus(prev => ({ ...prev, isInstalled: isStandalone }));
    };
    
    window.addEventListener('appinstalled', () => {
      setStatus(prev => ({ ...prev, isInstalled: true, canInstall: false }));
      setDeferredPrompt(null);
    });
    
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkInstalled);
    
    // Monitor de status online/offline
    window.addEventListener('online', () => {
      setStatus(prev => ({ ...prev, isOnline: true }));
    });
    
    window.addEventListener('offline', () => {
      setStatus(prev => ({ ...prev, isOnline: false }));
    });
    
    // Limpar listeners
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', checkInstalled);
      window.removeEventListener('online', () => {});
      window.removeEventListener('offline', () => {});
    };
  }, []);
  
  // Função para solicitar instalação
  const promptInstall = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }
    
    try {
      // Mostrar o prompt de instalação
      await deferredPrompt.prompt();
      
      // Aguardar escolha do usuário
      const choiceResult = await deferredPrompt.userChoice;
      
      // Limpar o deferredPrompt, não pode ser usado novamente
      setDeferredPrompt(null);
      
      return choiceResult.outcome === 'accepted';
    } catch (error) {
      console.error('Erro ao promover instalação:', error);
      return false;
    }
  };
  
  // Função para forçar cache de imagens
  const forceCacheImages = async (): Promise<boolean> => {
    const result = await ensureImageCaching();
    setIsImagesPreCached(result);
    return result;
  };
  
  // Executar diagnóstico
  const runDiagnostic = async (): Promise<Record<string, any>> => {
    const result = await runPWADiagnostic();
    setDiagnosticResult(result);
    return result;
  };
  
  // Atualizar service worker
  const updatePWA = async (): Promise<boolean> => {
    return await updateServiceWorker();
  };

  return {
    status,
    promptInstall,
    isInstallable: !!deferredPrompt,
    diagnosticResult,
    runDiagnostic,
    isImagesPreCached,
    forceCacheImages,
    updatePWA
  };
}

export default usePWA;
