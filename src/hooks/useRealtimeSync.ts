
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';

interface SyncEvent {
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  user_id: string;
  id: string;
  sync_version: number;
  timestamp: string;
}

export const useRealtimeSync = () => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!user || !isOnline) return;

    // Configurar canais de sincronização em tempo real
    const channels = [
      'sync_clients',
      'sync_drivers', 
      'sync_freights',
      'sync_collection_orders',
      'sync_profiles'
    ];

    const subscriptions = channels.map(channelName => {
      const channel = supabase.channel(channelName);

      // Escutar mudanças via PostgreSQL NOTIFY
      channel.on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: channelName.replace('sync_', ''),
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log(`Sync event received for ${channelName}:`, payload);
        
        // Emitir evento customizado para que outros componentes possam reagir
        window.dispatchEvent(new CustomEvent('dataSync', {
          detail: {
            table: channelName.replace('sync_', ''),
            operation: payload.eventType,
            data: payload.new || payload.old,
            userId: user.id
          }
        }));
      });

      channel.subscribe();
      return channel;
    });

    return () => {
      subscriptions.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [user, isOnline]);

  return { isOnline };
};
