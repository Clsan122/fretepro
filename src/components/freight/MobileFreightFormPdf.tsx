
import React from "react";
import { Freight, Client, User, Driver } from "@/types";

interface MobileFreightFormPdfProps {
  freight: Freight;
  client: Client | null;
  driver?: Driver | null;
  sender: User;
}

const MobileFreightFormPdf: React.FC<MobileFreightFormPdfProps> = ({
  freight,
  client,
  driver,
  sender,
}) => {
  return (
    <>
      <style type="text/css" media="print">
        {`
          @page {
            size: A4;
            margin: 3mm;
            scale: 0.85;
          }
          
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            background-color: white !important;
            font-family: Arial, sans-serif !important;
            font-size: 8px !important;
            line-height: 1.2 !important;
            zoom: 0.8;
          }
          
          * {
            box-sizing: border-box !important;
          }
          
          #freight-form-print {
            width: 100% !important;
            max-width: 100% !important;
            font-size: 8px !important;
            padding: 2mm !important;
            background: white !important;
            color: black !important;
          }
          
          img {
            max-width: 80px !important;
            max-height: 50px !important;
            object-fit: contain !important;
          }
          
          .text-xs, .text-sm, .text-base {
            font-size: 7px !important;
            line-height: 1.1 !important;
          }
          
          .text-lg {
            font-size: 9px !important;
            line-height: 1.2 !important;
          }
          
          .text-xl {
            font-size: 10px !important;
            line-height: 1.2 !important;
          }
          
          table {
            page-break-inside: avoid !important;
            font-size: 7px !important;
            width: 100% !important;
            border-collapse: collapse !important;
          }
          
          td, th {
            padding: 1mm !important;
            border: 0.1mm solid #ddd !important;
          }
          
          .mb-6 {
            margin-bottom: 2mm !important;
          }
          
          .pb-4 {
            padding-bottom: 1mm !important;
          }
          
          .p-8 {
            padding: 2mm !important;
          }
          
          .border-b {
            border-bottom: 0.1mm solid #ddd !important;
          }
          
          .border-t {
            border-top: 0.1mm solid #ddd !important;
          }
          
          /* Mobile specific optimizations */
          @media screen and (max-width: 640px) {
            body {
              zoom: 0.7 !important;
            }
            
            #freight-form-print {
              padding: 1mm !important;
            }
            
            img {
              max-width: 60px !important;
              max-height: 40px !important;
            }
            
            table {
              font-size: 6px !important;
            }
            
            td, th {
              padding: 0.5mm !important;
            }
          }
        `}
      </style>
      
      <div id="freight-form-print" className="bg-white min-h-screen">
        {/* Cabeçalho compacto */}
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6 border-b border-gray-200 pb-4">
          <div className="flex flex-col mb-4 sm:mb-0">
            {sender.companyLogo && (
              <img 
                src={sender.companyLogo} 
                alt="Logo da Empresa" 
                className="mb-2" 
              />
            )}
            <div className="text-sm space-y-1">
              <div className="font-bold">{sender.companyName || sender.name}</div>
              <div>{sender.address}, {sender.city}/{sender.state}</div>
              <div>CNPJ: {sender.cnpj}</div>
              <div>Tel: {sender.phone} | Email: {sender.email}</div>
            </div>
          </div>

          <div className="text-right">
            <h2 className="text-xl font-bold mb-2">Formulário de Frete</h2>
            <div className="text-sm space-y-1">
              <div>Data: {new Date().toLocaleDateString()}</div>
              <div>Nº: {freight.id}</div>
            </div>
          </div>
        </div>

        {/* Layout em grid para mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Informações do Cliente */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-bold mb-2">Cliente</h3>
            <div className="text-sm space-y-1">
              <div><strong>Nome:</strong> {client?.name}</div>
              <div><strong>Doc:</strong> {client?.cnpj || client?.cpf}</div>
              <div><strong>End:</strong> {client?.address}</div>
              <div><strong>Cidade:</strong> {client?.city}/{client?.state}</div>
              <div><strong>Tel:</strong> {client?.phone}</div>
            </div>
          </div>

          {/* Informações do Motorista */}
          {driver && (
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-bold mb-2">Motorista</h3>
              <div className="text-sm space-y-1">
                <div><strong>Nome:</strong> {driver.name}</div>
                <div><strong>CPF:</strong> {driver.cpf}</div>
                <div><strong>Tel:</strong> {driver.phone}</div>
              </div>
            </div>
          )}
        </div>

        {/* Detalhes da Carga - Layout mobile otimizado */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Detalhes da Carga</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><strong>Origem:</strong> {freight.originCity}/{freight.originState}</div>
            <div><strong>Destino:</strong> {freight.destinationCity}/{freight.destinationState}</div>
            <div><strong>Saída:</strong> {freight.departureDate}</div>
            <div><strong>Chegada:</strong> {freight.arrivalDate}</div>
            <div><strong>Tipo:</strong> {freight.cargoType}</div>
            <div><strong>Peso:</strong> {freight.weight} kg</div>
            <div><strong>Valor:</strong> R$ {freight.totalValue}</div>
            <div><strong>Obs:</strong> {freight.cargoDescription || "—"}</div>
          </div>
        </div>

        {/* Assinaturas compactas */}
        <div className="grid grid-cols-2 gap-8 mt-8">
          <div className="text-center">
            <div className="border-t border-gray-500 mb-2"></div>
            <div className="text-sm">Assinatura do Cliente</div>
          </div>
          <div className="text-center">
            <div className="border-t border-gray-500 mb-2"></div>
            <div className="text-sm">Assinatura do Motorista</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileFreightFormPdf;
