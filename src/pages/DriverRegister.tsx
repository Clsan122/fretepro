
import React from "react";
import Layout from "@/components/Layout";
import DriverForm from "@/components/DriverForm";
import { useNavigate } from "react-router-dom";
import { Driver } from "@/types";
import { addDriver } from "@/utils/storage";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const DriverRegister: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSaveDriver = (driver: Driver) => {
    addDriver(driver);
    toast({
      title: "Motorista cadastrado",
      description: "O motorista foi cadastrado com sucesso!",
    });
    navigate("/drivers");
  };

  const handleCancel = () => {
    navigate("/drivers");
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6 max-w-4xl pb-20">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/drivers')}
            className="mr-3"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
          <h1 className="text-2xl font-bold">Cadastrar Motorista</h1>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6">
          <DriverForm 
            onSave={handleSaveDriver} 
            onCancel={handleCancel}
            isStandalone={true}
          />
        </div>
      </div>
    </Layout>
  );
};

export default DriverRegister;
