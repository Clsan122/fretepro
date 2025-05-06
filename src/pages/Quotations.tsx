
import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuotationsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNewQuotation = () => {
    navigate("/quotation");
  };

  return (
    <Layout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Cotações</h1>
          <Button onClick={handleNewQuotation} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Nova Cotação
          </Button>
        </div>

        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-center text-gray-500 py-8">
            As cotações salvas serão exibidas aqui.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default QuotationsPage;
