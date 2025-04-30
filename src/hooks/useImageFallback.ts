
import { useState, useEffect } from 'react';

/**
 * Hook para lidar com fallbacks de imagens no PWA
 * Garante que imagens tenham uma versão de fallback se não puderem ser carregadas
 * 
 * @param src URL original da imagem
 * @param fallback URL da imagem de fallback (opcional)
 * @returns Um objeto com a URL da imagem que deve ser usada
 */
export function useImageFallback(src: string, fallback: string = '/placeholder.svg') {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    // Reset states when src changes
    setLoading(true);
    setError(false);
    setImgSrc(src);
    
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setLoading(false);
    };
    
    img.onerror = () => {
      setError(true);
      setImgSrc(fallback);
      setLoading(false);
      
      // Tenta pré-carregar da cache se falhou no carregamento normal
      if ('caches' in window) {
        caches.match(src).then(response => {
          if (response) {
            return response.blob();
          }
          return null;
        }).then(blob => {
          if (blob) {
            const objectURL = URL.createObjectURL(blob);
            setImgSrc(objectURL);
            setError(false);
          }
        }).catch(err => {
          console.error('Erro ao buscar imagem da cache:', err);
        });
      }
    };
    
    // Limpar URL do objeto ao desmontar
    return () => {
      if (imgSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imgSrc);
      }
    };
  }, [src, fallback]);

  return { imgSrc, loading, error };
}

/**
 * Componente de imagem com fallback automático
 */
export default useImageFallback;
