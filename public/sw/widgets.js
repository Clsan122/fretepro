
// Widget implementation for FreteValor PWA
// Este arquivo implementa os widgets para o PWA do FreteValor

// Configuração dos widgets disponíveis
const WIDGET_DEFINITIONS = {
  financeiro: {
    name: "Resumo Financeiro",
    description: "Mostra um resumo financeiro dos últimos fretes",
    template: "resumo-financeiro",
    updateInterval: 3600, // atualiza a cada hora
    defaults: {
      theme: "light",
      showChart: true,
      limit: 5
    }
  },
  entregas: {
    name: "Próximas Entregas",
    description: "Exibe as próximas entregas agendadas",
    template: "proximas-entregas",
    updateInterval: 1800, // atualiza a cada 30 minutos
    defaults: {
      theme: "light",
      showDetails: true,
      limit: 3
    }
  }
};

// Renderiza um widget baseado no template e dados
async function renderWidget(widgetId, data) {
  const definition = WIDGET_DEFINITIONS[widgetId];
  if (!definition) {
    return { error: "Widget não encontrado" };
  }

  let widgetContent;
  try {
    switch (definition.template) {
      case "resumo-financeiro":
        widgetContent = renderFinanceiroWidget(data);
        break;
      case "proximas-entregas":
        widgetContent = renderEntregasWidget(data);
        break;
      default:
        widgetContent = { error: "Template não implementado" };
    }
    
    return {
      id: widgetId,
      name: definition.name,
      content: widgetContent,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Erro ao renderizar widget ${widgetId}:`, error);
    return { error: "Falha ao renderizar widget" };
  }
}

// Renderiza o widget de resumo financeiro
function renderFinanceiroWidget(data = {}) {
  // Valores padrão caso não haja dados
  const values = {
    totalMensal: data.totalMensal || "R$ 0,00",
    totalSemanal: data.totalSemanal || "R$ 0,00",
    fretesPendentes: data.fretesPendentes || 0,
    fretesFinalizados: data.fretesFinalizados || 0
  };

  return {
    title: "Resumo Financeiro",
    data: values,
    html: `
      <div class="widget-card">
        <div class="widget-header">
          <h3>Resumo Financeiro</h3>
        </div>
        <div class="widget-body">
          <div class="stat-row">
            <span>Faturamento Mensal</span>
            <span class="highlight">${values.totalMensal}</span>
          </div>
          <div class="stat-row">
            <span>Faturamento Semanal</span>
            <span>${values.totalSemanal}</span>
          </div>
          <div class="stat-row">
            <span>Fretes Pendentes</span>
            <span>${values.fretesPendentes}</span>
          </div>
          <div class="stat-row">
            <span>Fretes Finalizados</span>
            <span>${values.fretesFinalizados}</span>
          </div>
        </div>
      </div>
    `
  };
}

// Renderiza o widget de próximas entregas
function renderEntregasWidget(data = {}) {
  // Valores padrão caso não haja dados
  const entregas = data.entregas || [
    { id: "placeholder", destino: "Sem entregas agendadas", data: "" }
  ];
  
  const entregasHTML = entregas.map(entrega => `
    <div class="entrega-item">
      <div class="entrega-destino">${entrega.destino}</div>
      ${entrega.data ? `<div class="entrega-data">${entrega.data}</div>` : ''}
    </div>
  `).join('');

  return {
    title: "Próximas Entregas",
    data: { entregas },
    html: `
      <div class="widget-card">
        <div class="widget-header">
          <h3>Próximas Entregas</h3>
        </div>
        <div class="widget-body">
          ${entregasHTML}
        </div>
      </div>
    `
  };
}

// Atualiza os dados dos widgets com informações do banco de dados
async function updateWidgetData(widgetId) {
  try {
    // Em uma implementação real, buscaríamos dados do IndexedDB ou da API
    // Por enquanto, usaremos dados simulados
    
    switch (widgetId) {
      case "financeiro":
        return {
          totalMensal: "R$ 4.850,00",
          totalSemanal: "R$ 1.230,00",
          fretesPendentes: 3,
          fretesFinalizados: 8
        };
      case "entregas":
        return {
          entregas: [
            { id: "ent1", destino: "São Paulo, SP", data: "Hoje, 14:30" },
            { id: "ent2", destino: "Rio de Janeiro, RJ", data: "Amanhã, 09:00" },
            { id: "ent3", destino: "Belo Horizonte, MG", data: "23/05, 11:30" }
          ]
        };
      default:
        return {};
    }
  } catch (error) {
    console.error(`Erro ao atualizar dados do widget ${widgetId}:`, error);
    return {};
  }
}

// Registra o widget com o sistema
async function registerWidgets() {
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'REGISTER_WIDGETS',
      widgets: Object.keys(WIDGET_DEFINITIONS).map(id => ({
        id,
        name: WIDGET_DEFINITIONS[id].name,
        description: WIDGET_DEFINITIONS[id].description,
        updateInterval: WIDGET_DEFINITIONS[id].updateInterval
      }))
    });
    return true;
  }
  return false;
}

// Inicializa o sistema de widgets
async function initWidgets() {
  try {
    // Registrar widgets disponíveis
    await registerWidgets();
    
    // Configurar listener para atualizações de widgets
    navigator.serviceWorker.addEventListener('message', async (event) => {
      if (event.data && event.data.type === 'UPDATE_WIDGET') {
        const { widgetId } = event.data;
        const widgetData = await updateWidgetData(widgetId);
        const widgetContent = await renderWidget(widgetId, widgetData);
        
        // Enviar conteúdo atualizado de volta para o Service Worker
        navigator.serviceWorker.controller.postMessage({
          type: 'WIDGET_UPDATED',
          widget: widgetContent
        });
      }
    });
    
    console.log('[Widgets] Sistema de widgets inicializado com sucesso');
    return true;
  } catch (error) {
    console.error('[Widgets] Falha ao inicializar widgets:', error);
    return false;
  }
}

// Exportar funcionalidades para uso global
self.widgetManager = {
  init: initWidgets,
  renderWidget,
  updateWidgetData,
  registerWidgets,
  WIDGET_DEFINITIONS
};
