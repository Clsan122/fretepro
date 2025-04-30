
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
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
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
      icon: '/icons/icon-192.png'
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
  return clients.matchAll({type: 'window'}).then(windowClients => {
    // Verificar se já existe uma janela aberta e focar nela
    for (const client of windowClients) {
      if (client.url.indexOf(self.location.origin) !== -1 && 'focus' in client) {
        return client.focus();
      }
    }
    // Se não existe nenhuma janela aberta, abrir uma nova
    if (clients.openWindow) {
      return clients.openWindow('/');
    }
  });
}

export {
  handlePushEvent,
  handleNotificationClick
};
