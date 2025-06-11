
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { Button } from '@/components/ui/button';

export const SyncIndicator: React.FC = () => {
  const { isOnline } = useRealtimeSync();
  const { hasPendingOperations, isSyncing, syncPendingOperations, pendingOperations } = useOfflineSync();

  const getStatusColor = () => {
    if (!isOnline) return 'destructive';
    if (hasPendingOperations) return 'secondary';
    return 'default';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="h-3 w-3" />;
    if (isSyncing) return <RefreshCw className="h-3 w-3 animate-spin" />;
    if (hasPendingOperations) return <AlertCircle className="h-3 w-3" />;
    return <CheckCircle className="h-3 w-3" />;
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (isSyncing) return 'Sincronizando...';
    if (hasPendingOperations) return `${pendingOperations.length} pendente${pendingOperations.length > 1 ? 's' : ''}`;
    return 'Sincronizado';
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant={getStatusColor()} className="flex items-center gap-1">
        {getStatusIcon()}
        <span className="text-xs">{getStatusText()}</span>
      </Badge>
      
      {isOnline && hasPendingOperations && !isSyncing && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={syncPendingOperations}
          className="h-6 px-2 text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Sync
        </Button>
      )}
    </div>
  );
};
