
import React from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import QuotationViewActions from "@/components/quotation/view/QuotationViewActions";
import QuotationContent from "@/components/quotation/view/QuotationContent";
import QuotationLoading from "@/components/quotation/view/QuotationLoading";
import { useQuotationView } from "@/hooks/quotation/useQuotationView";
import { QuotationData } from "@/components/quotation/types";

const QuotationView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const {
    quotation,
    loading,
    sending,
    generating,
    sharing,
    previewing,
    handlePreviewPdf,
    handleSharePdf,
    handleSendQuotation,
    handleEdit
  } = useQuotationView(id);
  
  if (loading || !quotation) {
    return <QuotationLoading isLoading={loading} notFound={!loading && !quotation} />;
  }

  // Transform quotation to match QuotationData interface
  const quotationData: QuotationData = {
    id: quotation.id,
    orderNumber: quotation.orderNumber || `COT-${quotation.id.substring(0, 8)}`,
    creatorId: quotation.userId || quotation.creatorId,
    creatorName: quotation.creatorName || 'Transportadora',
    creatorLogo: quotation.creatorLogo,
    originCity: quotation.originCity,
    originState: quotation.originState,
    destinationCity: quotation.destinationCity,
    destinationState: quotation.destinationState,
    volumes: quotation.volumes || 0,
    weight: quotation.weight || 0,
    measurements: quotation.measurements || [],
    cargoType: quotation.cargoType || '',
    merchandiseValue: quotation.merchandiseValue || 0,
    vehicleType: quotation.vehicleType || '',
    freightValue: quotation.freightValue || quotation.totalPrice || 0,
    tollValue: quotation.tollValue || 0,
    insuranceValue: quotation.insuranceValue || 0,
    insuranceRate: quotation.insuranceRate || 0,
    otherCosts: quotation.otherCosts || 0,
    totalValue: quotation.totalValue || quotation.totalPrice || 0,
    notes: quotation.notes || '',
    createdAt: quotation.createdAt,
    userId: quotation.userId,
    status: quotation.status || 'open',
    pdfGenerated: quotation.pdfGenerated || false,
  };

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto pb-20 md:pb-10 px-2 sm:px-4">
        <QuotationViewActions 
          id={id!}
          quotation={quotation}
          sending={sending}
          generating={generating}
          sharing={sharing}
          handleSharePdf={handleSharePdf}
          handleSendQuotation={handleSendQuotation}
          handleEdit={handleEdit}
          handlePreviewPdf={handlePreviewPdf}
        />
        
        {/* Conteúdo do PDF */}
        <div className="print-container">
          <QuotationContent quotation={quotationData} />
        </div>
      </div>
    </Layout>
  );
};

export default QuotationView;
