
import { supabase } from "@/integrations/supabase/client";
import { TableName, SyncItem } from "./types";
import { getPendingSyncItems, markItemAsSynced } from "./database";
import { updateLocalItem } from "./localData";
import { pullNewDataFromServer } from "./serverSync";

// Função para sincronização bidirecional
export const syncWithServer = async (): Promise<boolean> => {
  try {
    // Verificar se está online e autenticado
    if (!navigator.onLine) {
      return false;
    }

    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      return false;
    }

    // 1. Primeiro, enviar alterações locais para o servidor
    const pendingItems = await getPendingSyncItems();
    
    for (const item of pendingItems) {
      const { type, data, syncId, syncVersion, _deleted } = item;
      
      try {
        // Se o item foi marcado para exclusão
        if (_deleted) {
          await supabase
            .from(type as TableName)
            .delete()
            .match({ sync_id: syncId });
        } else {
          // Verificar versão atual no servidor
          const { data: remoteData } = await supabase
            .from(type as TableName)
            .select('*')
            .eq('sync_id', syncId)
            .maybeSingle();
          
          // Estratégia de resolução de conflitos - vence a versão mais recente
          if (remoteData && remoteData.sync_version > syncVersion) {
            // Se a versão remota for mais nova, atualizamos o local
            await updateLocalItem(type as TableName, remoteData);
            await markItemAsSynced(item.id);
          } else {
            // Se a versão local for mais nova ou igual, atualizamos o remoto
            await supabase
              .from(type as TableName)
              .upsert({
                ...data,
                sync_id: syncId,
                sync_version: syncVersion
              });
            await markItemAsSynced(item.id);
          }
        }
      } catch (error) {
        console.error(`Erro na sincronização do item ${syncId}:`, error);
      }
    }
    
    // 2. Puxar dados novos do servidor
    await pullNewDataFromServer();
    
    return true;
  } catch (error) {
    console.error('Erro na sincronização bidirecional:', error);
    return false;
  }
};
