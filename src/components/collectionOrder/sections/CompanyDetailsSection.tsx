
import React from "react";
import { CompanyLogoSection } from "../CompanyLogoSection";

interface CompanyDetailsSectionProps {
  companyLogo: string;
  selectedIssuerId: string;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoRemove: () => void;
  onIssuerChange: (id: string) => void;
  isUploading?: boolean;
}

export const CompanyDetailsSection: React.FC<CompanyDetailsSectionProps> = ({
  companyLogo,
  selectedIssuerId,
  onLogoUpload,
  onLogoRemove,
  onIssuerChange,
  isUploading = false
}) => {
  return (
    <CompanyLogoSection
      companyLogo={companyLogo}
      handleLogoUpload={onLogoUpload}
      selectedIssuerId={selectedIssuerId}
      onIssuerChange={onIssuerChange}
      handleRemoveLogo={onLogoRemove}
      isUploading={isUploading}
    />
  );
};
