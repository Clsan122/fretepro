
import React from 'react';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DeadlinesCardProps {
  createdAt: string;
}

export const DeadlinesCard: React.FC<DeadlinesCardProps> = ({ createdAt }) => {
  // Calcular a data de validade da proposta (7 dias a partir da emissão)
  const validUntil = new Date(createdAt);
  validUntil.setDate(validUntil.getDate() + 7);
  
  // Calcular prazo estimado de entrega (exemplo: 2 dias após a data de emissão)
  const estimatedDelivery = new Date(createdAt);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 2); // Placeholder - idealmente seria um campo na cotação
  
  return (
    <div className="mb-3">
      <h2 className="text-sm font-semibold mb-1 text-freight-800 border-b border-freight-100 pb-1">Prazo e Validade</h2>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
          <p className="font-medium text-freight-700 mb-0 text-center">Prazo Estimado de Entrega</p>
          <p className="text-freight-800 text-sm font-semibold text-center">
            {format(estimatedDelivery, "dd/MM/yyyy", { locale: ptBR })}
          </p>
        </div>
        <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
          <p className="font-medium text-freight-700 mb-0 text-center">Validade da Proposta</p>
          <p className="text-freight-800 text-sm font-semibold text-center">
            {format(validUntil, "dd/MM/yyyy", { locale: ptBR })}
          </p>
        </div>
      </div>
    </div>
  );
};
