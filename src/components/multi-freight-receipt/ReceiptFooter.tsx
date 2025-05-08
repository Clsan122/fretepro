
import React from "react";
import { User } from "@/types";
import { formatCurrency } from "@/utils/formatters";

interface ReceiptFooterProps {
  totalAmount: number;
  currentUser: User | null;
  requesterName?: string;
  paymentTerm?: string;
}

const ReceiptFooter: React.FC<ReceiptFooterProps> = ({ 
  totalAmount, 
  currentUser,
  requesterName,
  paymentTerm
}) => {
  // Converter valor para texto por extenso (simplificado)
  const amountInWords = totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '').trim();

  return (
    <div className="mt-4 print-compact border-t border-gray-300 pt-2">
      <h2 className="text-base font-semibold mb-1">RECIBO</h2>
      <p className="mb-2 text-sm">
        Recebi a importância de <strong>{formatCurrency(totalAmount)}</strong> ({amountInWords} reais) referente aos fretes acima listados.
      </p>
      
      {/* Payment and requester info */}
      <div className="mb-2 border-t border-b border-gray-200 py-1 text-xs print-small-text">
        {requesterName && (
          <p className="mb-0 font-semibold">Solicitante: {requesterName}</p>
        )}
        {paymentTerm && (
          <p className="mb-0 font-semibold">Prazo de Pagamento: {paymentTerm}</p>
        )}
        {currentUser?.pixKey && <p className="mb-0"><span className="font-medium">Chave PIX:</span> {currentUser.pixKey}</p>}
        {currentUser?.bankInfo && <p className="mb-0"><span className="font-medium">Banco:</span> {currentUser.bankInfo}</p>}
      </div>
      
      {/* Recipient information */}
      <div className="mb-2">
        <h3 className="text-sm font-semibold mb-0">Dados do Recebedor:</h3>
        <div className="text-xs">
          <p className="mb-0"><span className="font-medium">Nome:</span> {currentUser?.name || "___________________________"}</p>
          {currentUser?.cpf && <p className="mb-0"><span className="font-medium">CPF:</span> {currentUser.cpf}</p>}
          {currentUser?.phone && <p className="mb-0"><span className="font-medium">Telefone:</span> {currentUser.phone}</p>}
        </div>
      </div>
      
      {/* Signature section */}
      <div className="mt-3 pt-1 border-t border-gray-300 text-center">
        <p className="border-b border-black inline-block w-48">_______________________</p>
        <p className="mt-1 text-sm">{currentUser?.name || "Assinatura"}</p>
        {currentUser?.cpf && <p className="text-xs">CPF: {currentUser.cpf}</p>}
        {currentUser?.address && (
          <p className="text-xs mt-0">
            {currentUser.address}
            {currentUser.city && currentUser.state && ` - ${currentUser.city}/${currentUser.state}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default ReceiptFooter;
