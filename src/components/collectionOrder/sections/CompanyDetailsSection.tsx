
import React from "react";
import { CompanyLogoSection } from "../CompanyLogoSection";

interface CompanyDetailsSectionProps {
  companyLogo: string;
  selectedIssuerId: string;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoRemove: () => void;
  onIssuerChange: (id: string) => void;
}

export const CompanyDetailsSection: React.FC<CompanyDetailsSectionProps> = ({
  companyLogo,
  selectedIssuerId,
  onLogoUpload,
  onLogoRemove,
  onIssuerChange,
}) => {
  return (
    <CompanyLogoSection
      companyLogo={companyLogo}
      handleLogoUpload={onLogoUpload}
      handleRemoveLogo={onLogoRemove}
      selectedIssuerId={selectedIssuerId}
      onIssuerChange={onIssuerChange}
    />
  );
};
