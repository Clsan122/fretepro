
import { TableName, SyncItem } from "./types";
import { saveToIndexedDB, getLocalStorageData } from "./database";

// Função para salvar dados localmente
export const saveLocalData = async (type: TableName, data: any): Promise<void> => {
  // Converter formato do servidor para formato local
  const localItem = {
    ...data,
    syncId: data.sync_id,
    syncVersion: data.sync_version || 1, // Garantir que sync_version existe
    _synced: true
  };
  
  // Salvar no localStorage
  const localData = getLocalStorageData(type);
  
  // Verificar se já existe e atualizar
  const existingIndex = localData.findIndex(item => item.syncId === data.sync_id);
  if (existingIndex >= 0) {
    // Se a versão local for mais nova, não sobrescrever
    const localVersion = localData[existingIndex].syncVersion || 0;
    const remoteVersion = data.sync_version || 0;
    
    if (localVersion > remoteVersion) {
      return;
    }
    localData[existingIndex] = localItem;
  } else {
    localData.push(localItem);
  }
  
  localStorage.setItem(type, JSON.stringify(localData));
  
  // Salvar no IndexedDB também
  const syncItem: SyncItem = {
    id: crypto.randomUUID(),
    type,
    data: localItem,
    timestamp: Date.now(),
    syncId: data.sync_id,
    syncVersion: data.sync_version || 1,
    _synced: true
  };
  
  await saveToIndexedDB(syncItem);
};

// Função auxiliar para atualizar item local
export const updateLocalItem = async (type: TableName, remoteData: any): Promise<void> => {
  // Atualizar no IndexedDB
  const db = await openDatabase();
  const transaction = db.transaction('pendingSync', 'readwrite');
  const store = transaction.objectStore('pendingSync');
  
  const index = store.index('syncId');
  const request = index.get(remoteData.sync_id);
  
  request.onsuccess = () => {
    const item = request.result;
    if (item) {
      item.data = remoteData;
      item.syncVersion = remoteData.sync_version || 1; // Garantir que sync_version existe
      item._synced = true;
      store.put(item);
    }
  };
  
  // Atualizar no localStorage
  const localData = getLocalStorageData(type);
  const updatedLocalData = localData.map(item => 
    item.syncId === remoteData.sync_id ? {...remoteData, _synced: true} : item
  );
  localStorage.setItem(type, JSON.stringify(updatedLocalData));
};

// Importar aqui para evitar importação circular
import { openDatabase } from "./database";
