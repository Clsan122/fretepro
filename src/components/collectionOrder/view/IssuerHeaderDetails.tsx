
import React from "react";
import { Client, User } from "@/types";

interface IssuerHeaderDetailsProps {
  issuer?: User | Client | null;
}

export const IssuerHeaderDetails: React.FC<IssuerHeaderDetailsProps> = ({ issuer }) => {
  if (!issuer) return null;
  
  // Determine if it's a User or Client using type narrowing
  const isUser = 'companyName' in issuer || 'companyLogo' in issuer;
  const isClient = 'logo' in issuer;
  
  // Determine which logo to use and which name to display
  const logoSrc = isUser ? issuer.companyLogo : isClient ? issuer.logo : undefined;
  const displayName = isUser ? issuer.companyName || issuer.name : issuer.name;
  
  return (
    <div className="flex flex-col items-center mb-2 print:mb-1">
      {logoSrc && (
        <img
          src={logoSrc}
          alt="Logo do emissor"
          className="h-10 object-contain mb-1"
          style={{ maxHeight: 40, maxWidth: 120 }}
        />
      )}
      <div className="text-xs text-center space-y-0.5">
        <span className="block font-medium">{displayName}</span>
        {issuer.cnpj && <span className="block">CNPJ: {issuer.cnpj}</span>}
        {issuer.address && <span className="block">{issuer.address}</span>}
        {(issuer.city && issuer.state) && (
          <span className="block print-small-text">{issuer.city}/{issuer.state}</span>
        )}
      </div>
    </div>
  );
};
