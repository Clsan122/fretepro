import React from 'react';
import { Cloud, CloudOff, RotateCcw, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTMSSync } from '@/hooks/useTMSSync';

export const TMSSyncIndicator: React.FC = () => {
  const { syncStatus, pendingOperations, forcSync, clearCache } = useTMSSync();

  const getStatusIcon = () => {
    if (!syncStatus.isOnline) {
      return <CloudOff className="h-4 w-4 text-destructive" />;
    }
    
    if (syncStatus.isSyncing) {
      return <RotateCcw className="h-4 w-4 text-primary animate-spin" />;
    }
    
    if (syncStatus.hasConflicts) {
      return <AlertTriangle className="h-4 w-4 text-warning" />;
    }
    
    if (syncStatus.pendingOperations > 0) {
      return <Clock className="h-4 w-4 text-warning" />;
    }
    
    return <CheckCircle className="h-4 w-4 text-success" />;
  };

  const getStatusText = () => {
    if (!syncStatus.isOnline) {
      return 'Offline';
    }
    
    if (syncStatus.isSyncing) {
      return 'Sincronizando...';
    }
    
    if (syncStatus.hasConflicts) {
      return 'Conflitos detectados';
    }
    
    if (syncStatus.pendingOperations > 0) {
      return `${syncStatus.pendingOperations} pendente${syncStatus.pendingOperations > 1 ? 's' : ''}`;
    }
    
    return 'Sincronizado';
  };

  const getTooltipContent = () => {
    const lastSync = syncStatus.lastSync;
    const lastSyncText = lastSync 
      ? `Última sync: ${lastSync.toLocaleString('pt-BR')}`
      : 'Nunca sincronizado';

    if (!syncStatus.isOnline) {
      return (
        <div className="space-y-1">
          <p className="font-medium">Modo Offline</p>
          <p className="text-sm opacity-90">
            Suas mudanças serão sincronizadas quando voltar online
          </p>
          <p className="text-xs opacity-75">{lastSyncText}</p>
        </div>
      );
    }

    if (syncStatus.hasConflicts) {
      return (
        <div className="space-y-1">
          <p className="font-medium">Conflitos de Sincronização</p>
          <p className="text-sm opacity-90">
            Alguns dados foram modificados em outros dispositivos
          </p>
          <p className="text-xs opacity-75">{lastSyncText}</p>
        </div>
      );
    }

    if (syncStatus.pendingOperations > 0) {
      return (
        <div className="space-y-1">
          <p className="font-medium">Sincronização Pendente</p>
          <p className="text-sm opacity-90">
            {syncStatus.pendingOperations} operação{syncStatus.pendingOperations > 1 ? 'ões' : ''} aguardando sincronização
          </p>
          <p className="text-xs opacity-75">{lastSyncText}</p>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <p className="font-medium">Sincronizado</p>
        <p className="text-sm opacity-90">
          Todos os dados estão atualizados
        </p>
        <p className="text-xs opacity-75">{lastSyncText}</p>
      </div>
    );
  };

  const handleForceSync = async () => {
    try {
      await forcSync();
    } catch (error) {
      console.error('Erro ao forçar sincronização:', error);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-muted/50">
              {getStatusIcon()}
              <span className="text-sm font-medium">{getStatusText()}</span>
              {syncStatus.pendingOperations > 0 && (
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  {syncStatus.pendingOperations}
                </Badge>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            {getTooltipContent()}
          </TooltipContent>
        </Tooltip>

        {/* Botões de ação */}
        <div className="flex items-center gap-1">
          {syncStatus.isOnline && !syncStatus.isSyncing && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleForceSync}
                  className="h-8 w-8 p-0"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Forçar sincronização</p>
              </TooltipContent>
            </Tooltip>
          )}

          {(syncStatus.pendingOperations > 0 || syncStatus.hasConflicts) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCache}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <AlertTriangle className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Limpar cache e operações pendentes</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};