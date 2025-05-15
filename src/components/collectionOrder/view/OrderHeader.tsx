
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
  senderCnpj?: string;
  senderAddress?: string;
  senderCity?: string;
  senderState?: string;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({
  createdAt,
  clientLogo,
  issuer,
  orderNumber,
}) => {
  // Function to check if issuer has a logo
  const issuerHasLogo = (): boolean => {
    if (!issuer) return false;
    
    // Check if it's a Client (has logo property)
    if ('logo' in issuer && issuer.logo) {
      return true;
    }
    
    // Check if it's a User (has companyLogo property)
    if ('companyLogo' in issuer && issuer.companyLogo) {
      return true;
    }
    
    return false;
  };

  return (
    <div className="mb-3 print:mb-2">
      {/* Logo do cliente se não houver logo do emissor */}
      {clientLogo && !issuerHasLogo() && (
        <div className="flex justify-center mb-2">
          <img
            src={clientLogo}
            alt="Logo do cliente"
            className="h-12 print:h-10 object-contain"
          />
        </div>
      )}
      
      {/* Detalhes do emissor (sem o campo solicitante duplicado) */}
      {issuer && <IssuerHeaderDetails issuer={issuer} />}
      
      <div className="text-center">
        <h2 className="text-xl print:text-lg font-bold text-freight-700">
          ORDEM DE COLETA {orderNumber && `Nº ${orderNumber}`}
        </h2>
        <p className="text-gray-500 text-xs">Data: {createdAt}</p>
      </div>
    </div>
  );
};
