
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
  // Removida a exibição do logo para evitar duplicação
  return (
    <div className="mb-3 print:mb-2 text-center">
      <p className="text-gray-500 text-xs">Data: {createdAt}</p>
    </div>
  );
};
