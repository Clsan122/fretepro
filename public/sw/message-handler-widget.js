
// Gerenciador de mensagens para widgets no Service Worker

// Armazenar dados de widgets
const widgetData = {};

// Processar solicitações de widgets
function handleWidgetRequest(event) {
  if (!event.data) {
    return false;
  }
  
  switch (event.data.type) {
    case 'REGISTER_WIDGETS':
      console.log('[Service Worker] Registrando widgets:', event.data.widgets);
      
      // Armazenar definições de widgets
      event.data.widgets.forEach(widget => {
        widgetData[widget.id] = {
          definition: widget,
          lastUpdated: new Date().toISOString(),
          content: null
        };
      });
      return true;
      
    case 'WIDGET_UPDATED':
      console.log('[Service Worker] Widget atualizado:', event.data.widget?.id);
      
      // Armazenar conteúdo atualizado do widget
      if (event.data.widget && event.data.widget.id) {
        const { id } = event.data.widget;
        if (widgetData[id]) {
          widgetData[id].content = event.data.widget.content;
          widgetData[id].lastUpdated = new Date().toISOString();
        }
      }
      return true;
      
    case 'GET_WIDGET':
      const widgetId = event.data.widgetId;
      console.log('[Service Worker] Solicitação para obter widget:', widgetId);
      
      // Enviar dados do widget para o cliente
      if (widgetId && widgetData[widgetId]) {
        event.ports[0]?.postMessage({
          widget: widgetData[widgetId]
        });
      } else {
        event.ports[0]?.postMessage({
          error: 'Widget não encontrado'
        });
      }
      return true;
      
    default:
      return false;
  }
}

// Solicitar atualização de um widget
function requestWidgetUpdate(widgetId) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'WIDGET_UPDATE_REQUEST',
        widgetId
      });
    });
  });
}

// Iniciar atualizações periódicas de widgets
function startWidgetUpdates() {
  // Verificar widgets registrados periodicamente
  setInterval(() => {
    for (const widgetId in widgetData) {
      const widget = widgetData[widgetId];
      const now = new Date().getTime();
      const lastUpdate = new Date(widget.lastUpdated).getTime();
      
      // Se o widget não foi atualizado no intervalo definido
      if (widget.definition.updateInterval && 
          (now - lastUpdate) > widget.definition.updateInterval * 1000) {
        requestWidgetUpdate(widgetId);
      }
    }
  }, 60000); // Verificar a cada minuto
}

// Exportar para uso global
self.widgetMessageHandler = {
  handleWidgetRequest,
  requestWidgetUpdate,
  startWidgetUpdates,
  getWidgetData: () => widgetData
};

// Iniciar atualizações de widgets
self.addEventListener('activate', () => {
  startWidgetUpdates();
});
