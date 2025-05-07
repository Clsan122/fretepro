
// Handler para funcionalidades de compartilhamento

// Processar compartilhamento de arquivos
function handleShareTarget(event) {
  const url = new URL(event.request.url);
  
  // Verificar se é uma solicitação de compartilhamento
  if (url.pathname === '/share-target' && event.request.method === 'POST') {
    event.respondWith((async () => {
      try {
        // Clonar a solicitação para processamento assíncrono
        const formData = await event.request.formData();
        const files = formData.getAll('receipts');
        const title = formData.get('title') || '';
        const text = formData.get('text') || '';
        const url = formData.get('url') || '';
        
        // Armazenar dados compartilhados para uso posterior
        const shareData = {
          title,
          text,
          url,
          files: files.map(file => ({
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified
          }))
        };
        
        // Armazenar arquivos no cache para uso offline
        if (files.length > 0) {
          const cache = await caches.open('share-target-cache');
          for (const file of files) {
            const response = new Response(file);
            await cache.put(`shared-file-${file.name}`, response);
          }
        }
        
        // Armazenar metadados na IndexedDB
        const db = await openDB();
        const tx = db.transaction('sharedContent', 'readwrite');
        await tx.store.put({
          id: new Date().toISOString(),
          data: shareData,
          timestamp: Date.now()
        });
        await tx.done;
        
        // Redirecionar para a página que mostra o conteúdo compartilhado
        return Response.redirect('/shared-content', 303);
      } catch (error) {
        console.error('Erro ao processar compartilhamento:', error);
        return Response.redirect('/error', 303);
      }
    })());
    return true;
  }
  return false;
}

// Handler para manipulação de arquivos
function handleFileHandler(event) {
  const url = new URL(event.request.url);
  
  if (url.pathname.startsWith('/view-pdf/')) {
    // Implemente manipulação específica para PDFs
    return true;
  }
  
  if (url.pathname === '/import' && event.request.method === 'POST') {
    // Implemente importação de arquivos
    return true;
  }
  
  return false;
}

// Handler para protocolo personalizado (web+fretevalor://)
function handleProtocolHandler(event) {
  const url = new URL(event.request.url);
  
  if (url.pathname.startsWith('/web+fretevalor:')) {
    // Extrair comando do protocolo
    const command = url.pathname.replace('/web+fretevalor:', '');
    
    // Redirecionar para a rota apropriada com base no comando
    event.respondWith(Response.redirect(`/${command}`, 303));
    return true;
  }
  
  return false;
}

// Função auxiliar para abrir o banco de dados
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('share-content-db', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('sharedContent')) {
        db.createObjectStore('sharedContent', { keyPath: 'id' });
      }
    };
  });
}

// Exportar para uso global
self.shareHandler = {
  handleShareTarget,
  handleFileHandler,
  handleProtocolHandler
};
