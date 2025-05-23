
export function loadWidgets(): void {
  if (!('serviceWorker' in navigator && 'widgets' in window)) {
    return;
  }

  const widgetScript = document.createElement('script');
  widgetScript.src = '/sw/widgets.js';
  widgetScript.onload = () => {
    if (window.widgetManager && window.widgetManager.init) {
      window.widgetManager.init().then(success => {
        console.log('Sistema de widgets inicializado:', success ? 'com sucesso' : 'com falhas');
      });
    }
  };
  document.body.appendChild(widgetScript);
}

export function setupWidgetLoading(): void {
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadWidgets();
    }, 2000);
  });
}
