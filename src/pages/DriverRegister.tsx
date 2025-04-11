
import React from "react";
import Layout from "@/components/Layout";
import DriverForm from "@/components/DriverForm";
import { useNavigate } from "react-router-dom";
import { Driver } from "@/types";
import { addDriver } from "@/utils/storage";
import { useToast } from "@/components/ui/use-toast";

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
      <div className="p-4 md:p-6">
        <DriverForm 
          onSave={handleSaveDriver} 
          onCancel={handleCancel}
          isStandalone={true}
        />
      </div>
    </Layout>
  );
};

export default DriverRegister;
