
import React from 'react';
import { formatPhone } from "@/utils/formatters";
import { CreatorInfo } from './helpers';

interface FooterProps {
  creatorInfo: CreatorInfo;
}

export const Footer: React.FC<FooterProps> = ({ creatorInfo }) => {
  return (
    <div className="mt-3 pt-2 border-t border-freight-200 text-center relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-freight-50 via-freight-200 to-freight-50"></div>
      <p className="mb-1 text-freight-800 font-medium text-xs">
        Agradecemos a preferência! Estamos à disposição para qualquer esclarecimento.
      </p>
      <div className="flex flex-wrap justify-center gap-2 text-xs text-freight-700">
        {creatorInfo.phone && (
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            {formatPhone(creatorInfo.phone)}
          </p>
        )}
        {creatorInfo.email && (
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            {creatorInfo.email}
          </p>
        )}
        <p className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          FreteValor © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};
