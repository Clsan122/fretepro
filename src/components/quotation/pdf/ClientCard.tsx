
import React from 'react';
import { formatCPFCNPJ, formatPhone } from "@/utils/formatters";
import { ClientInfo } from './helpers';

interface ClientCardProps {
  clientInfo: ClientInfo;
}

export const ClientCard: React.FC<ClientCardProps> = ({ clientInfo }) => {
  if (!clientInfo) return null;
  
  return (
    <div className="mb-3 p-3 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-sm font-semibold mb-2 text-freight-800 border-b border-freight-100 pb-1">
        Dados do Cliente
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
        <div>
          <p className="flex items-baseline mb-1">
            <span className="font-medium text-freight-800 w-16">Nome:</span> 
            <span className="text-freight-700">{clientInfo.name}</span>
          </p>
          {clientInfo.company && (
            <p className="flex items-baseline mb-1">
              <span className="font-medium text-freight-800 w-16">Empresa:</span> 
              <span className="text-freight-700">{clientInfo.company}</span>
            </p>
          )}
          <p className="flex items-baseline mb-1">
            <span className="font-medium text-freight-800 w-16">Localidade:</span> 
            <span className="text-freight-700">{clientInfo.city}/{clientInfo.state}</span>
          </p>
        </div>
        <div>
          {clientInfo.document && (
            <p className="flex items-baseline mb-1">
              <span className="font-medium text-freight-800 w-16">CNPJ/CPF:</span> 
              <span className="text-freight-700">{formatCPFCNPJ(clientInfo.document)}</span>
            </p>
          )}
          {clientInfo.email && (
            <p className="flex items-baseline mb-1">
              <span className="font-medium text-freight-800 w-16">E-mail:</span> 
              <span className="text-freight-700">{clientInfo.email}</span>
            </p>
          )}
          {clientInfo.phone && (
            <p className="flex items-baseline mb-1">
              <span className="font-medium text-freight-800 w-16">Telefone:</span> 
              <span className="text-freight-700">{formatPhone(clientInfo.phone)}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
