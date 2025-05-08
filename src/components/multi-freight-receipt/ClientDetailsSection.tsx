
import React from "react";
import { Freight, Client } from "@/types";
import { getClientById } from "@/utils/storage";

interface ClientDetailsSectionProps {
  freightsByClient: Record<string, {client: Client, freights: Freight[]}>;
}

const ClientDetailsSection: React.FC<ClientDetailsSectionProps> = ({ freightsByClient }) => {
  const clientIds = Object.keys(freightsByClient);
  
  // Se tivermos muitos clientes, vamos mostrar apenas informações essenciais
  const manyClients = clientIds.length > 2;
  
  return (
    <div className="mb-3 print-compact">
      <h2 className="text-base font-semibold mb-1">DADOS DO CLIENTE</h2>
      
      {clientIds.length === 1 ? (
        // Se só tem um cliente, mostrar detalhes completos
        (() => {
          const clientId = clientIds[0];
          const client = freightsByClient[clientId]?.client;
          
          if (!client) return <p className="text-sm">Cliente não encontrado</p>;
          
          return (
            <div className="border border-gray-200 p-2 rounded-sm text-xs print-small-text">
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <div>
                  <p className="font-semibold">{client.name}</p>
                  {client.cnpj && <p>CNPJ: {client.cnpj}</p>}
                </div>
                <div>
                  {client.address && <p>{client.address}</p>}
                  {client.city && client.state && 
                    <p>{client.city} - {client.state}</p>
                  }
                </div>
              </div>
              {client.phone && (
                <p>Tel: {client.phone}</p>
              )}
            </div>
          );
        })()
      ) : (
        // Se tem múltiplos clientes, mostrar resumo
        <div className="border border-gray-200 p-2 rounded-sm text-xs print-small-text">
          <p className="font-semibold">Múltiplos clientes ({clientIds.length}):</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {clientIds.map(clientId => {
              const client = freightsByClient[clientId]?.client;
              if (!client) return null;
              
              // Se temos muitos clientes, mostramos apenas nome/cnpj
              if (manyClients) {
                return (
                  <div key={clientId} className="print-tight">
                    <span className="font-medium">{client.name}</span>
                    {client.cnpj && <span className="ml-1">({client.cnpj})</span>}
                  </div>
                );
              }
              
              // Se temos poucos, podemos mostrar mais informações
              return (
                <div key={clientId} className="print-tight">
                  <p className="font-medium">{client.name}</p>
                  {client.cnpj && <p>CNPJ: {client.cnpj}</p>}
                  {client.city && client.state && <p>{client.city}/{client.state}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetailsSection;
