
import React from "react";
import { Client, User } from "@/types";

interface IssuerHeaderDetailsProps {
  issuer?: User | Client | null;
}

export const IssuerHeaderDetails: React.FC<IssuerHeaderDetailsProps> = ({ issuer }) => {
  if (!issuer) return null;
  return (
    <div className="flex flex-col items-center mb-2 print:mb-1">
      {issuer.companyLogo || issuer.logo ? (
        <img
          src={issuer.companyLogo || issuer.logo}
          alt="Logo do emissor"
          className="h-10 object-contain mb-1"
          style={{ maxHeight: 40, maxWidth: 120 }}
        />
      ) : null}
      <div className="text-xs text-center space-y-0.5">
        <span className="block font-medium">{issuer.companyName || issuer.name}</span>
        {issuer.cnpj && <span className="block">CNPJ: {issuer.cnpj}</span>}
        {(issuer.address && issuer.city && issuer.state) && (
          <span className="block print-small-text">{issuer.address} - {issuer.city}/{issuer.state}</span>
        )}
      </div>
    </div>
  );
};
