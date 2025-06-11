
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
    if (isSyncing) return 'Sync...';
    if (hasPendingOperations) return `${pendingOperations.length}`;
    return 'OK';
  };

  return (
    <div className="flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-1 shadow-sm border">
      <Badge variant={getStatusColor()} className="flex items-center gap-1 text-[10px] px-2 py-1">
        {getStatusIcon()}
        <span className="hidden sm:inline">{getStatusText()}</span>
      </Badge>
      
      {isOnline && hasPendingOperations && !isSyncing && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={syncPendingOperations}
          className="h-6 w-6 p-0"
          title="Sincronizar dados pendentes"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};
