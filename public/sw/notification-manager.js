
// Gerenciamento de notificações push

// Processar notificação push recebida
function handlePushEvent(event) {
  if (!event.data) {
    console.log('[Service Worker] Push recebido mas sem dados');
    return;
  }
  
  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'Nova notificação do FreteValor',
      icon: '/icons/fretevalor-logo.png',
      badge: '/icons/fretevalor-logo.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/',
        timestamp: Date.now()
      },
      actions: [
        {
          action: 'view',
          title: 'Ver detalhes'
        },
        {
          action: 'close',
          title: 'Fechar'
        }
      ]
    };
    
    return self.registration.showNotification(data.title || 'FreteValor', options);
  } catch (error) {
    console.error('[Service Worker] Erro ao processar notificação push:', error);
    
    // Tentar mostrar uma notificação padrão
    return self.registration.showNotification('FreteValor', {
      body: 'Nova notificação',
      icon: '/icons/fretevalor-logo.png'
    });
  }
}

// Processar clique em notificação
function handleNotificationClick(event) {
  const notification = event.notification;
  const action = event.action;
  
  if (action === 'close') {
    notification.close();
    return;
  }
  
  // Ação padrão é abrir o app
  notification.close();
  
  // Tentar extrair URL personalizada da notificação
  const urlToOpen = notification.data && notification.data.url 
    ? new URL(notification.data.url, self.location.origin).href 
    : self.location.origin;
  
  return clients.matchAll({type: 'window'}).then(windowClients => {
    // Verificar se já existe uma janela aberta e focar nela
    for (const client of windowClients) {
      if (client.url === urlToOpen && 'focus' in client) {
        return client.focus();
      }
    }
    // Se não existe nenhuma janela aberta, abrir uma nova
    if (clients.openWindow) {
      return clients.openWindow(urlToOpen);
    }
  });
}

// Enviar notificação para o usuário
function sendNotification(title, options = {}) {
  return self.registration.showNotification(title, {
    icon: '/icons/fretevalor-logo.png',
    badge: '/icons/fretevalor-logo.png',
    vibrate: [100, 50, 100],
    ...options
  });
}

// Alerta de status offline para o usuário
function notifyOfflineStatus() {
  return sendNotification('FreteValor está offline', {
    body: 'Você está offline, mas ainda pode usar o aplicativo.',
    tag: 'connectivity-change'
  });
}

// Alerta de status online para o usuário
function notifyOnlineStatus() {
  return sendNotification('FreteValor está online', {
    body: 'Conexão com internet restaurada!',
    tag: 'connectivity-change'
  });
}

// Exportar para uso global
self.notificationManager = {
  handlePushEvent,
  handleNotificationClick,
  sendNotification,
  notifyOfflineStatus,
  notifyOnlineStatus
};
