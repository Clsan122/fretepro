
import React from "react";

interface CompanyDetailsSectionProps {
  companyLogo: string;
  selectedIssuerId: string;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoRemove: () => void;
  onIssuerChange: (id: string) => void;
}

export const CompanyDetailsSection: React.FC<CompanyDetailsSectionProps> = ({
  selectedIssuerId,
  onIssuerChange,
}) => {
  // Este componente foi simplificado, removendo as opções de logotipo manual
  // O logotipo agora é obtido automaticamente do cliente selecionado
  return (
    <></>
  );
};
