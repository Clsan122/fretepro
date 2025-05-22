
import React from "react";
import { User, Client } from "@/types";
import { format } from "date-fns";

interface OrderHeaderProps {
  companyLogo?: string;
  createdAt: string;
  clientName?: string;
  clientLogo?: string;
  issuer?: User | Client | null;
  orderNumber?: string;
  senderCnpj?: string;
  senderAddress?: string;
  senderCity?: string;
  senderState?: string;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({
  createdAt,
  orderNumber,
  companyLogo,
  issuer,
  senderCnpj,
  senderAddress,
  senderCity,
  senderState
}) => {
  // Formatação de data se for uma string válida
  let formattedDate = createdAt;
  try {
    if (createdAt) {
      formattedDate = format(new Date(createdAt), 'dd/MM/yyyy');
    }
  } catch (e) {
    console.error("Erro ao formatar data:", e);
  }

  // Determine the company or user name based on the issuer type
  const issuerName = issuer ? 
    // Check if it's a User with companyName
    ('companyName' in issuer && issuer.companyName) || 
    // If not, check if it's a Client with name
    ('name' in issuer && issuer.name) || 
    // Default fallback
    "" 
    : "";

  return (
    <div className="mb-3 print:mb-2 space-y-2">
      {companyLogo && (
        <div className="flex justify-center mb-2">
          <img 
            src={companyLogo} 
            alt="Logo da Empresa" 
            className="max-h-16 max-w-[180px] object-contain"
          />
        </div>
      )}
      
      <div className="text-center">
        {issuer && (
          <p className="font-medium text-sm md:text-base">
            {issuerName}
          </p>
        )}
        
        {senderCnpj && (
          <p className="text-xs md:text-sm text-gray-600">
            CNPJ: {senderCnpj}
          </p>
        )}
        
        {(senderAddress || (senderCity && senderState)) && (
          <p className="text-xs md:text-sm text-gray-600">
            {senderAddress && `${senderAddress}, `}
            {senderCity && senderState && `${senderCity} - ${senderState}`}
          </p>
        )}
      </div>
      
      <div className="text-center">
        <p className="text-gray-500 text-xs md:text-sm">
          Data: {formattedDate} {orderNumber && <span className="ml-2">| Ordem: {orderNumber}</span>}
        </p>
      </div>
    </div>
  );
};
