
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Freight } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import FreightForm from "@/components/freight/FreightForm";
import { useToast } from "@/hooks/use-toast";
import { saveFreight } from "@/utils/storage";
import { v4 as uuidv4 } from "uuid";

const FreightNew: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSaveFreight = (freight: Freight) => {
    if (!user) return;
    
    // Garantir que tenha um ID e dados do usuário
    const newFreight: Freight = {
      ...freight,
      id: freight.id || uuidv4(),
      userId: user.id,
      createdAt: new Date().toISOString()
    };
    
    saveFreight(newFreight);
    
    toast({
      title: "Frete cadastrado",
      description: "O frete foi cadastrado com sucesso!"
    });
    
    navigate("/freights");
  };

  const handleCancel = () => {
    navigate("/freights");
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Cadastrar Novo Frete</h1>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6">
          <FreightForm 
            onSave={handleSaveFreight}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </Layout>
  );
};

export default FreightNew;
