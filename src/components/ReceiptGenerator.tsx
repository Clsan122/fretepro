import React from "react";
import { Freight, Client, User, Driver } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReceiptGeneratorProps {
  freight: Freight;
  clients: Client[];
  user: User | null;
  driver?: Driver;
}

const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({ freight, clients, user, driver }) => {
  const client = clients.length > 0 ? clients[0] : null;

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">RECIBO DE PRESTAÇÃO DE SERVIÇO DE TRANSPORTE</h1>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Informações do Cliente</h2>
        {client ? (
          <>
            <p><strong>Nome:</strong> {client.name}</p>
            {client.cnpj && <p><strong>CNPJ:</strong> {client.cnpj}</p>}
            {client.address && <p><strong>Endereço:</strong> {client.address}</p>}
            <p><strong>Cidade:</strong> {client.city} - {client.state}</p>
          </>
        ) : (
          <p>Cliente não encontrado.</p>
        )}
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Detalhes do Frete</h2>
        <p><strong>Origem:</strong> {freight.originCity} - {freight.originState}</p>
        <p><strong>Destino:</strong> {freight.destinationCity} - {freight.destinationState}</p>
        <p><strong>Data de Criação:</strong> {format(new Date(freight.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
        <p><strong>Valor Total:</strong> R$ {freight.totalValue.toFixed(2)}</p>
        <p><strong>Tipo de Carga:</strong> {freight.cargoType}</p>
        {freight.cargoWeight && <p><strong>Peso da Carga:</strong> {freight.cargoWeight} kg</p>}
        {freight.cargoDescription && <p><strong>Descrição da Carga:</strong> {freight.cargoDescription}</p>}
      </div>

      {driver && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Informações do Motorista</h2>
          <p><strong>Nome:</strong> {driver.name}</p>
          <p><strong>CPF:</strong> {driver.cpf}</p>
          <p><strong>Placa do Veículo:</strong> {driver.licensePlate}</p>
        </div>
      )}

      {user && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Informações da Empresa</h2>
          <p><strong>Nome da Empresa:</strong> {user.companyName}</p>
          {user.cnpj && <p><strong>CNPJ:</strong> {user.cnpj}</p>}
          {user.address && <p><strong>Endereço:</strong> {user.address}</p>}
          <p><strong>Cidade:</strong> {user.city} - {user.state}</p>
        </div>
      )}
      
      {/* Add requester name before signature if available */}
      {freight.requesterName && (
        <div className="mt-4 mb-2 text-sm">
          <p><strong>Solicitante:</strong> {freight.requesterName}</p>
        </div>
      )}
      
      {/* Signature section */}
      <div className="mt-8">
        <p className="text-center">__________________________________________</p>
        <p className="text-center">Assinatura</p>
      </div>
    </div>
  );
};

export default ReceiptGenerator;
