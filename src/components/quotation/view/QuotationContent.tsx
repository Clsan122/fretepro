
import React from 'react';
import { QuotationData } from '../types';
import { useAuth } from '@/context/auth/AuthProvider';
import { FreightQuotationPdf } from '../FreightQuotationPdf';

interface QuotationContentProps {
  quotation: QuotationData;
}

const QuotationContent: React.FC<QuotationContentProps> = ({ quotation }) => {
  const { user } = useAuth();

  const creatorInfo = {
    name: user?.name || 'Transportadora',
    cpf: user?.cpf || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    avatar: user?.avatar || undefined,
  };

  return (
    <div className="bg-white">
      <FreightQuotationPdf 
        quotation={quotation} 
        creatorInfo={creatorInfo} 
      />
    </div>
  );
};

export default QuotationContent;
