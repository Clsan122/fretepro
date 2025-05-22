
import React from "react";
import { Freight, Client, User, Driver } from "@/types";

interface FreightFormPdfProps {
  freight: Freight;
  client: Client | null;
  driver?: Driver | null;
  sender: User;
}

const FreightFormPdf: React.FC<FreightFormPdfProps> = ({
  freight,
  client,
  driver,
  sender,
}) => {
  return (
    <>
      <style type="text/css">
        {`
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
              background-color: white !important;
            }
            * {
              box-sizing: border-box !important;
            }
            .text-xs, .text-sm, .text-base {
              font-size: 10px !important;
              line-height: 1.1 !important;
            }
            img {
              max-width: 150px !important;
              max-height: 100px !important;
              object-fit: contain !important;
            }
            .border-b {
              border-bottom-width: 1px !important;
            }
            .border-t {
              border-top-width: 1px !important;
            }
            table {
              page-break-inside: avoid !important;
            }
          }
        `}
      </style>
      
      <div id="freight-form-print" className="p-8 bg-white min-h-screen">
        {/* Cabeçalho com informações da empresa */}
        <div className="flex justify-between items-start mb-6 border-b border-gray-200 pb-4">
          {/* Logo e informações do emissor */}
          <div className="flex flex-col">
          {sender.companyLogo && (
            <img 
              src={sender.companyLogo} 
              alt="Logo da Empresa" 
              className="w-[150px] h-[100px] object-contain mb-0" 
            />
          )}
            <div className="text-sm">
              <div className="font-bold">{sender.companyName || sender.name}</div>
              <div>{sender.address}, {sender.city}/{sender.state}</div>
              <div>CNPJ: {sender.cnpj}</div>
              <div>Telefone: {sender.phone}</div>
              <div>Email: {sender.email}</div>
            </div>
          </div>

          {/* Informações do formulário */}
          <div className="text-right">
            <h2 className="text-xl font-bold mb-2">Formulário de Frete</h2>
            <div>Data de Emissão: {new Date().toLocaleDateString()}</div>
            <div>Número do Frete: {freight.id}</div>
          </div>
        </div>

        {/* Informações do Cliente */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <h3 className="text-lg font-bold mb-2">Informações do Cliente</h3>
          <div>Nome: {client?.name}</div>
          <div>CNPJ/CPF: {client?.cnpj || client?.cpf}</div>
          <div>Endereço: {client?.address}, {client?.city}/{client?.state}</div>
          <div>Telefone: {client?.phone}</div>
          <div>Email: {client?.email}</div>
        </div>

        {/* Informações do Motorista */}
        {driver && (
          <div className="mb-6 border-b border-gray-200 pb-4">
            <h3 className="text-lg font-bold mb-2">Informações do Motorista</h3>
            <div>Nome: {driver.name}</div>
            <div>CPF: {driver.cpf}</div>
            <div>Telefone: {driver.phone}</div>
            <div>Email: {driver.email}</div>
          </div>
        )}

        {/* Detalhes da Carga */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <h3 className="text-lg font-bold mb-2">Detalhes da Carga</h3>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="font-bold">Origem:</td>
                <td>{freight.originCity}, {freight.originState}</td>
                <td className="font-bold">Destino:</td>
                <td>{freight.destinationCity}, {freight.destinationState}</td>
              </tr>
              <tr>
                <td className="font-bold">Data de Saída:</td>
                <td>{freight.departureDate}</td>
                <td className="font-bold">Data de Entrega:</td>
                <td>{freight.arrivalDate}</td>
              </tr>
              <tr>
                <td className="font-bold">Tipo de Carga:</td>
                <td>{freight.cargoType}</td>
                <td className="font-bold">Peso Total:</td>
                <td>{freight.weight} kg</td>
              </tr>
              <tr>
                <td className="font-bold">Valor da Carga:</td>
                <td>R$ {freight.totalValue}</td>
                <td className="font-bold">Observações:</td>
                <td>{freight.observations}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Assinaturas */}
        <div className="flex justify-between items-end">
          <div className="text-center">
            <div className="border-t border-gray-500 w-64 mx-auto"></div>
            <div className="mt-2">Assinatura do Cliente</div>
          </div>
          <div className="text-center">
            <div className="border-t border-gray-500 w-64 mx-auto"></div>
            <div className="mt-2">Assinatura do Motorista</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FreightFormPdf;
