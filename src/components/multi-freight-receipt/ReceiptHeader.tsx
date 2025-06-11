
import React from 'react';
import { User } from '@/types';

interface ReceiptHeaderProps {
  user: User;
}

const ReceiptHeader: React.FC<ReceiptHeaderProps> = ({ user }) => {
  return (
    <div className="receipt-header mb-6">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">RECIBO DE FRETE</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-700">Transportadora</h2>
          <p className="text-gray-600">{user?.name || 'Não informado'}</p>
          <p className="text-gray-600">CPF: {user?.cpf || 'Não informado'}</p>
          {user?.phone && <p className="text-gray-600">Telefone: {user.phone}</p>}
          {user?.address && <p className="text-gray-600">Endereço: {user.address}</p>}
        </div>
        
        <div className="text-right">
          <p className="text-gray-600">Data de emissão: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptHeader;
