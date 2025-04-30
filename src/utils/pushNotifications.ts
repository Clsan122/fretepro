
import { toast } from "sonner";

let isPushEnabled = false;

// Convertendo string base64 para Uint8Array (necessário para VAPID keys)
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Envia a inscrição para o servidor (implementação futura)
function sendSubscriptionToServer(subscription: PushSubscription) {
  // TODO: Enviar a inscrição para o backend
  console.log('Subscription enviada para o servidor:', subscription);
  
  // Armazenar a subscription localmente para uso futuro
  localStorage.setItem('pushSubscription', JSON.stringify(subscription));
  
  return true;
}

// Função para inicializar o estado de notificações
export async function initializePushNotifications() {
  // Verificar se notificações são suportadas
  if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
    console.warn('Notificações não são suportadas.');
    return false;
  }

  // Verificar permissão de notificação atual
  if (Notification.permission === 'denied') {
    console.warn('O usuário bloqueou notificações.');
    return false;
  }

  // Verificar se o push messaging é suportado
  if (!('PushManager' in window)) {
    console.warn('Push messaging não é suportado.');
    return false;
  }

  try {
    // Precisamos do registro do service worker para verificar uma inscrição
    const registration = await navigator.serviceWorker.ready;
    
    // Já temos uma inscrição de mensagem push?
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      // Manter o servidor sincronizado com o ID de inscrição mais recente
      sendSubscriptionToServer(subscription);
      isPushEnabled = true;
      return true;
    }
    
    return false;
  } catch (err) {
    console.error('Erro durante inicialização das notificações push:', err);
    return false;
  }
}

// Verificar e atualizar estado inicial das notificações
export function initialiseState() {
  // Verificar se notificações são suportadas
  if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
    console.warn('Notificações não são suportadas.');
    return;
  }

  // Verificar permissão de notificação atual
  if (Notification.permission === 'denied') {
    console.warn('O usuário bloqueou notificações.');
    return;
  }

  // Verificar se o push messaging é suportado
  if (!('PushManager' in window)) {
    console.warn('Push messaging não é suportado.');
    return;
  }

  // Precisamos do registro do service worker para verificar uma inscrição
  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    // Já temos uma inscrição de mensagem push?
    serviceWorkerRegistration.pushManager.getSubscription()
      .then(function(subscription) {
        // Habilitar qualquer UI que assine/cancele assinatura de 
        // mensagens push.
        const pushButton = document.querySelector('.js-push-button');
        if (pushButton) {
          (pushButton as HTMLButtonElement).disabled = false;
        }

        if (!subscription) {
          // Não estamos inscritos em push, então definir interface 
          // para permitir que o usuário habilite push
          return;
        }

        // Manter o servidor sincronizado com o ID de inscrição mais recente
        sendSubscriptionToServer(subscription);

        // Definir interface para mostrar que eles se inscreveram em
        // mensagens push
        if (pushButton) {
          (pushButton as HTMLButtonElement).textContent = 'Desativar Notificações';
        }
        isPushEnabled = true;
      })
      .catch(function(err) {
        console.warn('Erro durante getSubscription()', err);
      });
  });
}

// Solicitar permissão de notificação e se inscrever no push
export async function subscribeToPush() {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      toast.error('Permissão para notificações negada');
      return false;
    }
    
    const registration = await navigator.serviceWorker.ready;
    
    // Você precisará gerar suas próprias VAPID keys
    // https://web.dev/articles/push-notifications-subscribing-a-user#create_sender_keys
    const applicationServerKey = urlBase64ToUint8Array(
      'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
    );
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey
    });
    
    const success = sendSubscriptionToServer(subscription);
    
    if (success) {
      isPushEnabled = true;
      toast.success('Notificações ativadas com sucesso!');
      return true;
    } else {
      toast.error('Falha ao ativar notificações');
      return false;
    }
  } catch (error) {
    console.error('Erro ao se inscrever para notificações push:', error);
    toast.error('Erro ao ativar notificações');
    return false;
  }
}

// Cancelar inscrição das notificações push
export async function unsubscribeFromPush() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      toast.info('Você não está inscrito em notificações');
      return true;
    }
    
    // Cancelar a inscrição
    const result = await subscription.unsubscribe();
    
    if (result) {
      // Remover a inscrição do servidor
      // TODO: Implementar remoção no backend
      localStorage.removeItem('pushSubscription');
      isPushEnabled = false;
      toast.success('Notificações desativadas');
      return true;
    } else {
      toast.error('Falha ao desativar notificações');
      return false;
    }
  } catch (error) {
    console.error('Erro ao cancelar inscrição:', error);
    toast.error('Erro ao desativar notificações');
    return false;
  }
}

// Verificar se as notificações push estão ativadas
export function isPushNotificationEnabled(): boolean {
  return isPushEnabled;
}

// Toggle para ativar/desativar notificações
export async function togglePushNotifications(): Promise<boolean> {
  if (isPushEnabled) {
    return await unsubscribeFromPush();
  } else {
    return await subscribeToPush();
  }
}
