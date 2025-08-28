import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { getFreightsByUserId, getClientsByUserId, getDriversByUserId } from '@/utils/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DataDebugger: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const freights = getFreightsByUserId(user.id);
  const clients = getClientsByUserId(user.id);
  const drivers = getDriversByUserId(user.id);

  const simpleFreights = freights.filter(f => f.totalValue > 0);

  return (
    <Card className="mb-4 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-sm text-yellow-800">Debug - Dados Locais</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div><strong>Usuário:</strong> {user.id}</div>
        <div><strong>Total Fretes:</strong> {freights.length}</div>
        <div><strong>Fretes Simples:</strong> {simpleFreights.length}</div>
        <div><strong>Clientes:</strong> {clients.length}</div>
        <div><strong>Motoristas:</strong> {drivers.length}</div>
        
        {freights.length > 0 && (
          <div className="mt-3">
            <div><strong>Últimos 3 fretes:</strong></div>
            {freights.slice(0, 3).map(f => (
              <div key={f.id} className="ml-2 text-xs">
                • {f.id.slice(0, 8)} - R$ {f.totalValue} - {f.originCity} → {f.destinationCity}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataDebugger;