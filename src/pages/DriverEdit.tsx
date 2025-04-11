
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import DriverForm from "@/components/DriverForm";
import { useNavigate, useParams } from "react-router-dom";
import { Driver } from "@/types";
import { getDriverById, updateDriver } from "@/utils/storage";
import { useToast } from "@/components/ui/use-toast";

const DriverEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [driver, setDriver] = useState<Driver | undefined>(undefined);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      const driverData = getDriverById(id);
      if (driverData) {
        setDriver(driverData);
      } else {
        toast({
          title: "Erro",
          description: "Motorista não encontrado!",
          variant: "destructive",
        });
        navigate("/drivers");
      }
    }
  }, [id, navigate, toast]);

  const handleSaveDriver = (updatedDriver: Driver) => {
    updateDriver(updatedDriver);
    toast({
      title: "Motorista atualizado",
      description: "O motorista foi atualizado com sucesso!",
    });
    navigate("/drivers");
  };

  const handleCancel = () => {
    navigate("/drivers");
  };

  if (!driver) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <p>Carregando...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-6">
        <DriverForm 
          onSave={handleSaveDriver} 
          onCancel={handleCancel}
          driverToEdit={driver}
          isStandalone={true}
        />
      </div>
    </Layout>
  );
};

export default DriverEdit;
