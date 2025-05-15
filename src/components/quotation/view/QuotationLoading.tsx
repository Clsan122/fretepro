
import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface QuotationLoadingProps {
  isLoading: boolean;
  notFound?: boolean;
}

const QuotationLoading: React.FC<QuotationLoadingProps> = ({ isLoading, notFound = false }) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p>Carregando cotação...</p>
        </div>
      </Layout>
    );
  }
  
  if (notFound) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-center text-muted-foreground mb-4">Cotação não encontrada</p>
          <Button onClick={() => navigate("/quotations")}>Voltar para cotações</Button>
        </div>
      </Layout>
    );
  }
  
  return null;
};

export default QuotationLoading;
