
import React from "react";
import { User, Client } from "@/types";

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
  orderNumber
}) => {
  return (
    <div className="mb-3 print:mb-2 text-center">
      <p className="text-gray-500 text-xs md:text-sm">
        Data: {createdAt} {orderNumber && <span className="ml-2">| Ordem: {orderNumber}</span>}
      </p>
    </div>
  );
};
