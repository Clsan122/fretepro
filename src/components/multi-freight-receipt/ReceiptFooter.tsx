
import React from "react";
import { User } from "@/types";

interface ReceiptFooterProps {
  totalAmount: number;
  currentUser: User | null;
}

const ReceiptFooter: React.FC<ReceiptFooterProps> = ({ totalAmount, currentUser }) => {
  return (
    <div className="mt-3 print-compact scale-down">
      <h2 className="text-base font-semibold mb-1">RECIBO</h2>
      <p className="mb-2 text-sm">
        Recebi a importância de <strong>R$ {totalAmount.toFixed(2)}</strong> ({totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '').trim()} reais) referente aos fretes acima listados.
      </p>
      
      {/* Dados de pagamento */}
      {currentUser && (currentUser.pixKey || currentUser.bankInfo) && (
        <div className="mb-2 border-t border-b border-gray-200 py-2 text-xs print-small-text">
          <h3 className="font-semibold">Dados para Pagamento:</h3>
          {currentUser.pixKey && <p>PIX: {currentUser.pixKey}</p>}
          {currentUser.bankInfo && <p>Banco: {currentUser.bankInfo}</p>}
        </div>
      )}
      
      <div className="mt-4 pt-2 border-t border-gray-300 text-center">
        <p>_______________________________________________________</p>
        <p className="mt-1 text-sm">{currentUser?.name || "Assinatura"}</p>
        {currentUser?.cpf && <p className="text-xs">CPF: {currentUser.cpf}</p>}
      </div>
    </div>
  );
};

export default ReceiptFooter;
