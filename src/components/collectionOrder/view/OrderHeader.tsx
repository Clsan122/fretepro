
import React from "react";
import { IssuerHeaderDetails } from "./IssuerHeaderDetails";
import { Client, User } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface OrderHeaderProps {
  createdAt: string;
  orderNumber?: string;
  issuer?: User | Client | null;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({
  createdAt,
  orderNumber,
  issuer,
}) => {
  const formattedDate = format(new Date(createdAt), "dd/MM/yyyy", { locale: ptBR });

  return (
    <div className="mb-3 print:mb-2">
      {/* Exibe informações do emissor acima do título */}
      {issuer && <IssuerHeaderDetails issuer={issuer} />}
      
      <div className="text-center">
        <h2 className="text-xl print:text-lg font-bold text-freight-700">
          ORDEM DE COLETA Nº {orderNumber}
        </h2>
        <p className="text-gray-500 text-xs">Data: {formattedDate}</p>
      </div>
    </div>
  );
};
