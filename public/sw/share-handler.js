
// Gerenciamento de compartilhamento e processamento de arquivos

// Função para processar dados de compartilhamento
async function handleShareTarget(event) {
  const url = new URL(event.request.url);
  
  // Verificar se a solicitação é para o endpoint de compartilhamento
  if (url.pathname !== '/share-target') {
    return null; // Não é uma solicitação de compartilhamento
  }
  
  try {
    // Processar dados de formulário compartilhado
    const formData = await event.request.formData();
    const title = formData.get('title') || '';
    const text = formData.get('text') || '';
    const url = formData.get('url') || '';
    const files = formData.getAll('receipts') || [];
    
    // Armazenar temporariamente os dados compartilhados
    const shareCache = await caches.open('share-cache');
    
    // Armazenar metadados
    const metadata = {
      title,
      text,
      url,
      timestamp: new Date().toISOString(),
      filesInfo: files.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      }))
    };
    
    await shareCache.put('share-metadata', new Response(JSON.stringify(metadata)));
    
    // Armazenar arquivos
    for (const file of files) {
      const response = new Response(file);
      await shareCache.put(`share-file-${file.name}`, response);
    }
    
    // Redirecionar para a página de processamento de compartilhamento
    return Response.redirect('/shared-content', 303);
  } catch (error) {
    console.error('[Service Worker] Erro ao processar compartilhamento:', error);
    return Response.redirect('/share-error', 303);
  }
}

// Função para processar manipuladores de arquivos
async function handleFileHandler(event) {
  const url = new URL(event.request.url);
  
  // Verificar se é uma solicitação para manipulador de arquivo
  if (url.pathname === '/import' || url.pathname === '/view-pdf') {
    // Informar a aplicação sobre o arquivo sendo aberto
    // A aplicação principal será responsável por processar o arquivo
    return null; // Permitir que a solicitação continue para o cliente
  }
  
  return null; // Não é uma solicitação de manipulador de arquivo
}

// Função para processar manipuladores de protocolo personalizado
function handleProtocolHandler(event) {
  const url = new URL(event.request.url);
  
  // Verificar se há um parâmetro de protocolo personalizado
  if (url.pathname.startsWith('/%s') && url.searchParams.has('url')) {
    const protocolUrl = url.searchParams.get('url');
    
    // Extrair dados do protocolo personalizado
    // Por exemplo: web+fretevalor://freight?id=123
    try {
      const customUrl = new URL(protocolUrl);
      if (customUrl.protocol === 'web+fretevalor:') {
        const pathParts = customUrl.pathname.split('/');
        const action = pathParts[1] || 'default';
        const queryParams = Object.fromEntries(customUrl.searchParams);
        
        // Redirecionar para a página apropriada com os parâmetros
        return Response.redirect(`/${action}?${new URLSearchParams(queryParams).toString()}`, 302);
      }
    } catch (error) {
      console.error('[Service Worker] Erro ao processar protocolo personalizado:', error);
    }
  }
  
  return null; // Não é uma solicitação de protocolo personalizado
}

export {
  handleShareTarget,
  handleFileHandler,
  handleProtocolHandler
};
