
import { supabase } from "@/integrations/supabase/client";
import { TableName } from "./types";
import { saveLocalData } from "./localData";
import { getLastSyncTimestamp, setLastSyncTimestamp } from "./timestamps";

// Função para puxar novos dados do servidor
export const pullNewDataFromServer = async (): Promise<void> => {
  // Obter últimos timestamps de cada tipo de dados
  const tables: TableName[] = ['clients', 'drivers', 'freights', 'freight_expenses', 'collection_orders', 'measurements'];
  
  for (const table of tables) {
    try {
      // Obter último timestamp local
      const lastSyncTimestamp = getLastSyncTimestamp(table);
      
      // Buscar dados mais recentes do servidor
      const { data: remoteData, error } = await supabase
        .from(table)
        .select('*')
        .gt('updated_at', lastSyncTimestamp);
      
      if (error) {
        console.error(`Erro ao buscar dados da tabela ${table}:`, error);
        continue;
      }
      
      if (remoteData && remoteData.length > 0) {
        // Atualizar dados locais
        for (const item of remoteData) {
          await saveLocalData(table, item);
        }
        
        // Atualizar timestamp da última sincronização
        setLastSyncTimestamp(table, new Date().toISOString());
      }
    } catch (error) {
      console.error(`Erro ao sincronizar tabela ${table}:`, error);
    }
  }
};
