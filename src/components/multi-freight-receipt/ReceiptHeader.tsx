
import React from "react";
import { User } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Logo from "@/components/Logo";

interface ReceiptHeaderProps {
  dateRangeText: string;
  currentUser: User | null;
}

const ReceiptHeader: React.FC<ReceiptHeaderProps> = ({ dateRangeText, currentUser }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between mb-2 print-compact">
      <div className="flex items-center gap-2">
        <div className="hidden print:block">
          <Logo size="sm" variant="icon" className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-xl font-bold">RECIBO DE FRETE</h1>
          <p className="text-gray-500 text-xs">Período: {dateRangeText}</p>
        </div>
      </div>
      
      {currentUser && (
        <div className="text-right text-xs print-small-text">
          {currentUser.companyName && <p className="font-semibold">{currentUser.companyName}</p>}
          {currentUser.cnpj && <p>CNPJ: {currentUser.cnpj}</p>}
          {currentUser.phone && <p>Tel: {currentUser.phone}</p>}
          {currentUser.address && <p>{currentUser.address}</p>}
          {currentUser.city && currentUser.state && <p>{currentUser.city} - {currentUser.state}</p>}
        </div>
      )}
    </div>
  );
};

export default ReceiptHeader;
