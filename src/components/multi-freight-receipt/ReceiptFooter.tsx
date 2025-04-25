
import React from "react";
import { User } from "@/types";

interface ReceiptFooterProps {
  totalAmount: number;
  currentUser: User | null;
  requesterName?: string;
}

const ReceiptFooter: React.FC<ReceiptFooterProps> = ({ 
  totalAmount, 
  currentUser,
  requesterName
}) => {
  return (
    <div className="mt-3 print-compact scale-down">
      <h2 className="text-base font-semibold mb-1">RECIBO</h2>
      <p className="mb-2 text-sm">
        Recebi a importância de <strong>R$ {totalAmount.toFixed(2)}</strong> ({totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '').trim()} reais) referente aos fretes acima listados.
      </p>
      
      {/* Payment and requester info */}
      <div className="mb-2 border-t border-b border-gray-200 py-2 text-xs print-small-text">
        {requesterName && (
          <p className="mb-1">Solicitante: {requesterName}</p>
        )}
        {currentUser?.pixKey && <p>Chave PIX: {currentUser.pixKey}</p>}
        {currentUser?.bankInfo && <p>Banco: {currentUser.bankInfo}</p>}
      </div>
      
      {/* Signature section */}
      <div className="mt-4 pt-2 border-t border-gray-300 text-center">
        <p>_______________________________________________________</p>
        <p className="mt-1 text-sm">{currentUser?.name || "Assinatura"}</p>
        {currentUser?.cpf && <p className="text-xs">CPF: {currentUser.cpf}</p>}
        {currentUser?.address && (
          <p className="text-xs mt-1">
            {currentUser.address}
            {currentUser.city && currentUser.state && ` - ${currentUser.city}/${currentUser.state}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default ReceiptFooter;
