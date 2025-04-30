
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

interface SharedMetadata {
  title: string;
  text: string;
  url: string;
  timestamp: string;
  filesInfo: {
    name: string;
    type: string;
    size: number;
  }[];
}

const SharedContent = () => {
  const [metadata, setMetadata] = useState<SharedMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSharedContent() {
      try {
        // Verificar se o cache está disponível
        if ('caches' in window) {
          const cache = await caches.open('share-cache');
          const metadataResponse = await cache.match('share-metadata');
          
          if (metadataResponse) {
            const data = await metadataResponse.json();
            setMetadata(data);
          } else {
            setError('Nenhum conteúdo compartilhado encontrado');
          }
        } else {
          setError('Cache não disponível neste navegador');
        }
      } catch (err) {
        console.error('Erro ao carregar conteúdo compartilhado:', err);
        setError('Erro ao processar o conteúdo compartilhado');
      } finally {
        setLoading(false);
      }
    }
    
    loadSharedContent();
  }, []);

  const handleImportContent = async () => {
    // Implementação real dependeria da lógica de negócio específica
    console.log('Importando conteúdo compartilhado:', metadata);
    // Aqui você processaria os arquivos e os dados conforme necessário
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando conteúdo compartilhado...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
            <Button 
              className="mt-4" 
              onClick={() => window.location.href = '/'}
            >
              Voltar para a página inicial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Conteúdo Compartilhado</CardTitle>
        </CardHeader>
        <CardContent>
          {metadata && (
            <div className="space-y-4">
              {metadata.title && (
                <div>
                  <h3 className="font-medium">Título</h3>
                  <p>{metadata.title}</p>
                </div>
              )}
              
              {metadata.text && (
                <div>
                  <h3 className="font-medium">Texto</h3>
                  <p>{metadata.text}</p>
                </div>
              )}
              
              {metadata.url && (
                <div>
                  <h3 className="font-medium">URL</h3>
                  <a href={metadata.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    {metadata.url}
                  </a>
                </div>
              )}
              
              {metadata.filesInfo && metadata.filesInfo.length > 0 && (
                <div>
                  <h3 className="font-medium">Arquivos ({metadata.filesInfo.length})</h3>
                  <ul className="list-disc pl-5">
                    {metadata.filesInfo.map((file, index) => (
                      <li key={index}>
                        {file.name} ({(file.size / 1024).toFixed(2)} KB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => window.location.href = '/'}>
                  Cancelar
                </Button>
                <Button onClick={handleImportContent}>
                  Importar Conteúdo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SharedContent;
