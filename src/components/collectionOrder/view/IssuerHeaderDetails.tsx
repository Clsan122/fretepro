
import React from "react";
import { Client, User } from "@/types";

interface IssuerHeaderDetailsProps {
  issuer?: User | Client | null;
}

export const IssuerHeaderDetails: React.FC<IssuerHeaderDetailsProps> = ({ issuer }) => {
  // Apenas exibiremos informações mínimas aqui, já que as principais informações 
  // serão mostradas no OrderContent
  if (!issuer) return null;
  
  return (
    <div className="flex flex-col items-center mb-1">
      <div className="text-xs text-center">
        <span className="block text-gray-500">Data de emissão: {new Date().toLocaleDateString('pt-BR')}</span>
      </div>
    </div>
  );
};
