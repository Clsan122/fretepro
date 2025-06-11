import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuotationPdfDocument from '../QuotationPdfDocument';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { User, Quotation } from '@/types';

interface QuotationContentProps {
  quotation: Quotation;
  user: User | null;
}

const QuotationContent: React.FC<QuotationContentProps> = ({ quotation, user }) => {
  const handleCopyQuotation = () => {
    const quotationText = `
      Cotação #${quotation.id}
      Origem: ${quotation.originCity}, ${quotation.originState}
      Destino: ${quotation.destinationCity}, ${quotation.destinationState}
      Volumes: ${quotation.volumes}
      Peso: ${quotation.weight}
      Dimensões: ${quotation.dimensions}
      Tipo de Carga: ${quotation.cargoType}
      Tipo de Veículo: ${quotation.vehicleType}
      Preço por KM: ${formatCurrency(quotation.pricePerKm)}
      Custo de Pedágio: ${formatCurrency(quotation.tollCost)}
      Custos Adicionais: ${formatCurrency(quotation.additionalCosts)}
      Preço Total: ${formatCurrency(quotation.totalPrice)}
      Notas: ${quotation.notes || 'Nenhuma nota'}
    `;

    navigator.clipboard.writeText(quotationText);
  };

  // Usar dados do usuário em vez de empresa
  const companyName = user?.name || 'Transportadora';
  const companyCpf = user?.cpf || '';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes da Cotação</CardTitle>
        <CardDescription>Informações detalhadas da cotação.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Transportadora:</strong> {companyName}
            {companyCpf && <p><strong>CPF:</strong> {companyCpf}</p>}
          </div>
          <div>
            <strong>Cliente:</strong> {quotation.clientName}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Origem:</strong> {quotation.originCity}, {quotation.originState}
          </div>
          <div>
            <strong>Destino:</strong> {quotation.destinationCity}, {quotation.destinationState}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Volumes:</strong> {quotation.volumes}
          </div>
          <div>
            <strong>Peso:</strong> {quotation.weight}
          </div>
        </div>
        <div>
          <strong>Dimensões:</strong> {quotation.dimensions}
        </div>
        <div>
          <strong>Tipo de Carga:</strong> {quotation.cargoType}
        </div>
        <div>
          <strong>Tipo de Veículo:</strong> {quotation.vehicleType}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <strong>Preço por KM:</strong> {formatCurrency(quotation.pricePerKm)}
          </div>
          <div>
            <strong>Custo de Pedágio:</strong> {formatCurrency(quotation.tollCost)}
          </div>
          <div>
            <strong>Custos Adicionais:</strong> {formatCurrency(quotation.additionalCosts)}
          </div>
        </div>
        <div>
          <strong>Preço Total:</strong> {formatCurrency(quotation.totalPrice)}
        </div>
        <div>
          <strong>Notas:</strong> {quotation.notes || 'Nenhuma nota'}
        </div>
        <div>
          <Badge>Criada em: {new Date(quotation.createdAt).toLocaleDateString()}</Badge>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={handleCopyQuotation}>
            <Copy className="mr-2 h-4 w-4" />
            Copiar
          </Button>
          <PDFDownloadLink
            document={<QuotationPdfDocument quotationData={quotation} user={user} />}
            fileName={`cotacao-${quotation.id}.pdf`}
          >
            {({ loading }) => (
              <Button variant="default" size="sm" disabled={loading}>
                {loading ? (
                  <>Gerando PDF...</>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Baixar PDF
                  </>
                )}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuotationContent;
