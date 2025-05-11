
import { CollectionOrder } from "@/types";
import { TableName, SyncItem } from "./types";
import { saveToIndexedDB, getLocalStorageData } from "./database";
import { saveForOfflineSync } from "./api";

// Salvar uma ordem de coleta com suporte a sincronização
export const saveCollectionOrderWithSync = async (order: CollectionOrder): Promise<boolean> => {
  try {
    // Salvar no localStorage para acesso imediato
    const collectionOrders = getLocalStorageData('collection_orders' as TableName);
    const existingIndex = collectionOrders.findIndex(o => o.id === order.id);
    
    if (existingIndex >= 0) {
      collectionOrders[existingIndex] = order;
    } else {
      collectionOrders.push(order);
    }
    
    localStorage.setItem('collectionOrders', JSON.stringify(collectionOrders));
    
    // Salvar no IndexedDB com sistema de sincronização
    return await saveForOfflineSync('collection_orders' as TableName, {
      ...order,
      syncId: order.syncId || order.id,
      syncVersion: order.syncVersion || 1
    });
  } catch (error) {
    console.error("Erro ao salvar ordem de coleta:", error);
    return false;
  }
};

// Obter ordens de coleta com suporte ao IndexedDB
export const getCollectionOrdersFromIndexedDB = async (userId: string): Promise<CollectionOrder[]> => {
  try {
    // Primeiro tentar obter do IndexedDB
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('pendingSync', 'readonly');
      const store = transaction.objectStore('pendingSync');
      const index = store.index('type');
      const request = index.getAll('collection_orders');
      
      request.onsuccess = () => {
        const items = request.result || [];
        // Filtrar apenas itens do usuário atual e não excluídos
        const userItems = items
          .filter(item => !item._deleted && item.data.userId === userId)
          .map(item => item.data);
        
        resolve(userItems as CollectionOrder[]);
      };
      
      request.onerror = () => {
        // Fallback para localStorage
        const localItems = getLocalStorageData('collection_orders' as TableName);
        const userItems = localItems.filter(item => item.userId === userId);
        resolve(userItems as CollectionOrder[]);
      };
    });
  } catch (error) {
    console.error("Erro ao obter ordens de coleta do IndexedDB:", error);
    // Fallback para localStorage
    const localItems = getLocalStorageData('collection_orders' as TableName);
    return localItems.filter(item => item.userId === userId) as CollectionOrder[];
  }
};

// Importar aqui para evitar importação circular
import { openDatabase } from "./database";

// Obter uma ordem específica pelo ID
export const getCollectionOrderByIdFromIndexedDB = async (id: string): Promise<CollectionOrder | undefined> => {
  try {
    // Tentar obter do IndexedDB primeiro
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('pendingSync', 'readonly');
      const store = transaction.objectStore('pendingSync');
      const index = store.index('syncId');
      const request = index.get(id);
      
      request.onsuccess = () => {
        if (request.result && !request.result._deleted) {
          resolve(request.result.data as CollectionOrder);
        } else {
          // Tentar obter do localStorage
          const localItems = getLocalStorageData('collection_orders' as TableName);
          const foundItem = localItems.find(item => item.id === id);
          resolve(foundItem as CollectionOrder | undefined);
        }
      };
      
      request.onerror = () => {
        // Fallback para localStorage
        const localItems = getLocalStorageData('collection_orders' as TableName);
        const foundItem = localItems.find(item => item.id === id);
        resolve(foundItem as CollectionOrder | undefined);
      };
    });
  } catch (error) {
    console.error("Erro ao obter ordem de coleta por ID:", error);
    // Fallback para localStorage
    const localItems = getLocalStorageData('collection_orders' as TableName);
    return localItems.find(item => item.id === id) as CollectionOrder | undefined;
  }
};

// Excluir uma ordem de coleta
export const deleteCollectionOrderWithSync = async (id: string): Promise<boolean> => {
  try {
    // Remover do localStorage
    const collectionOrders = getLocalStorageData('collection_orders' as TableName);
    const updatedOrders = collectionOrders.filter(order => order.id !== id);
    localStorage.setItem('collectionOrders', JSON.stringify(updatedOrders));
    
    // Marcar como excluído para sincronização
    return await saveForOfflineSync('collection_orders' as TableName, {
      id,
      syncId: id,
      _deleted: true
    });
  } catch (error) {
    console.error("Erro ao excluir ordem de coleta:", error);
    return false;
  }
};
