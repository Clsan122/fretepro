
import React from "react";
import { IssuerHeaderDetails } from "./IssuerHeaderDetails";
import { Client, User } from "@/types";

interface OrderHeaderProps {
  companyLogo?: string;
  createdAt: string;
  clientName?: string;
  clientLogo?: string;
  issuer?: User | Client | null;
  orderNumber?: string;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({
  companyLogo,
  createdAt,
  clientName,
  clientLogo,
  issuer,
  orderNumber,
}) => {
  return (
    <div className="mb-3 print:mb-2">
      {/* Logo e informações do emissor */}
      {issuer && <IssuerHeaderDetails issuer={issuer} />}

      {clientLogo && !issuer?.logo && (
        <div className="flex justify-center mb-2">
          <img
            src={clientLogo}
            alt="Logo do cliente"
            className="h-12 print:h-10 object-contain"
          />
        </div>
      )}
      
      <div className="text-center">
        <h2 className="text-xl print:text-lg font-bold text-freight-700">
          ORDEM DE COLETA {orderNumber && `Nº ${orderNumber}`}
        </h2>
        <p className="text-gray-500 text-xs">Data: {createdAt}</p>
        {clientName && <p className="font-medium text-xs">Solicitante: {clientName}</p>}
      </div>
    </div>
  );
};
