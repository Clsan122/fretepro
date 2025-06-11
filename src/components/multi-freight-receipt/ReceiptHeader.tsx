
import React from 'react';
import { User } from '@/types';

export interface ReceiptHeaderProps {
  currentUser: User;
}

const ReceiptHeader: React.FC<ReceiptHeaderProps> = ({ currentUser }) => {
  return (
    <div className="receipt-header mb-6 border-b pb-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            RECIBO DE FRETES
          </h1>
          <div className="text-sm text-gray-600">
            <p>Transportador: {currentUser?.name || 'Não informado'}</p>
            {currentUser?.cpf && <p>CPF: {currentUser.cpf}</p>}
            {currentUser?.email && <p>Email: {currentUser.email}</p>}
            {currentUser?.phone && <p>Telefone: {currentUser.phone}</p>}
          </div>
        </div>
        
        {currentUser?.avatar && (
          <div className="company-logo">
            <img 
              src={currentUser.avatar} 
              alt="Logo do usuário" 
              className="h-16 w-auto object-contain"
            />
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Data de emissão: {new Date().toLocaleDateString('pt-BR')}</p>
      </div>
    </div>
  );
};

export default ReceiptHeader;
