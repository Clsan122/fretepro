
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
  // Converter valor para texto por extenso (simplificado)
  const amountInWords = totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '').trim();

  return (
    <div className="mt-8 print-compact scale-down border-t border-gray-300 pt-3">
      <h2 className="text-base font-semibold mb-1">RECIBO</h2>
      <p className="mb-2 text-sm">
        Recebi a importância de <strong>R$ {totalAmount.toFixed(2)}</strong> ({amountInWords} reais) referente aos fretes acima listados.
      </p>
      
      {/* Payment and requester info */}
      <div className="mb-3 border-t border-b border-gray-200 py-2 text-xs print-small-text">
        {requesterName && (
          <p className="mb-1 font-semibold">Solicitante: {requesterName}</p>
        )}
        {currentUser?.pixKey && <p className="mb-1"><span className="font-medium">Chave PIX:</span> {currentUser.pixKey}</p>}
        {currentUser?.bankInfo && <p className="mb-1"><span className="font-medium">Banco:</span> {currentUser.bankInfo}</p>}
      </div>
      
      {/* Recipient information */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold mb-1">Dados do Recebedor:</h3>
        <div className="text-xs">
          <p className="mb-1"><span className="font-medium">Nome:</span> {currentUser?.name || "___________________________"}</p>
          {currentUser?.cpf && <p className="mb-1"><span className="font-medium">CPF:</span> {currentUser.cpf}</p>}
          {currentUser?.phone && <p className="mb-1"><span className="font-medium">Telefone:</span> {currentUser.phone}</p>}
        </div>
      </div>
      
      {/* Signature section */}
      <div className="mt-6 pt-2 border-t border-gray-300 text-center">
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
