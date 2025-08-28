import { supabase } from "@/integrations/supabase/client";
import { 
  saveClient, 
  saveFreight, 
  addDriver,
  getFreightsByUserId,
  getClientsByUserId,
  getDriversByUserId 
} from "@/utils/storage";

interface ForceSyncResult {
  success: boolean;
  message: string;
  details: {
    clients: number;
    drivers: number;
    freights: number;
  };
}

export const forceDataSync = async (userId: string): Promise<ForceSyncResult> => {
  try {
    console.log('=== INICIANDO SINCRONIZAÇÃO FORÇADA ===');
    console.log('User ID:', userId);

    let clientsCount = 0;
    let driversCount = 0;
    let freightsCount = 0;

    // 1. Sincronizar clientes do Supabase para localStorage
    const { data: supabaseClients, error: clientsError } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId);

    if (clientsError) {
      console.error('Erro ao buscar clientes:', clientsError);
    } else if (supabaseClients) {
      console.log(`Encontrados ${supabaseClients.length} clientes no Supabase`);
      
      for (const client of supabaseClients) {
        try {
          const localClient = {
            id: client.id,
            userId: client.user_id,
            name: client.name,
            city: client.city,
            state: client.state,
            cpf: client.cpf || '',
            cnpj: client.cnpj || '',
            email: client.email || '',
            phone: client.phone || '',
            address: client.address || '',
            logo: client.logo || '',
            personType: (client.person_type as 'physical' | 'legal') || 'physical',
            createdAt: client.created_at
          };
          
          saveClient(localClient);
          clientsCount++;
        } catch (error) {
          console.error('Erro ao salvar cliente local:', error);
        }
      }
    }

    // 2. Sincronizar motoristas do Supabase para localStorage
    const { data: supabaseDrivers, error: driversError } = await supabase
      .from('drivers')
      .select('*')
      .eq('user_id', userId);

    if (driversError) {
      console.error('Erro ao buscar motoristas:', driversError);
    } else if (supabaseDrivers) {
      console.log(`Encontrados ${supabaseDrivers.length} motoristas no Supabase`);
      
      for (const driver of supabaseDrivers) {
        try {
          const localDriver = {
            id: driver.id,
            userId: driver.user_id,
            name: driver.name,
            cpf: driver.cpf,
            phone: driver.phone,
            address: driver.address || '',
            licensePlate: driver.license_plate,
            trailerPlate: driver.trailer_plate || '',
            vehicleType: driver.vehicle_type,
            bodyType: driver.body_type,
            anttCode: driver.antt_code,
            vehicleYear: driver.vehicle_year,
            vehicleModel: driver.vehicle_model,
            createdAt: driver.created_at,
            updatedAt: driver.updated_at
          };
          
          addDriver(localDriver);
          driversCount++;
        } catch (error) {
          console.error('Erro ao salvar motorista local:', error);
        }
      }
    }

    // 3. Sincronizar fretes do Supabase para localStorage
    const { data: supabaseFreights, error: freightsError } = await supabase
      .from('freights')
      .select('*')
      .eq('user_id', userId);

    if (freightsError) {
      console.error('Erro ao buscar fretes:', freightsError);
    } else if (supabaseFreights) {
      console.log(`Encontrados ${supabaseFreights.length} fretes no Supabase`);
      
      for (const freight of supabaseFreights) {
        try {
          const localFreight = {
            id: freight.id,
            userId: freight.user_id,
            clientId: freight.client_id,
            driverId: freight.driver_id || '',
            originCity: freight.origin_city,
            originState: freight.origin_state,
            destinationCity: freight.destination_city,
            destinationState: freight.destination_state,
            distance: freight.distance,
            cargoType: freight.cargo_type,
            cargoDescription: freight.cargo_description || '',
            cargoWeight: freight.cargo_weight || 0,
            volumes: freight.volumes || 0,
            weight: freight.weight || 0,
            cubicMeasurement: freight.cubic_measurement || 0,
            dimensions: freight.dimensions || '',
            vehicleType: freight.vehicle_type || '',
            price: freight.price,
            freightValue: freight.freight_value,
            dailyRate: freight.daily_rate || 0,
            tollCosts: freight.toll_costs || 0,
            otherCosts: freight.other_costs || 0,
            thirdPartyDriverCost: freight.third_party_driver_cost || 0,
            tollExpenses: freight.toll_expenses || 0,
            fuelExpenses: freight.fuel_expenses || 0,
            mealExpenses: freight.meal_expenses || 0,
            accommodationExpenses: freight.accommodation_expenses || 0,
            helperExpenses: freight.helper_expenses || 0,
            totalValue: freight.total_value,
            status: freight.status as 'pending' | 'in transit' | 'delivered' | 'canceled',
            paymentStatus: freight.payment_status as 'pending' | 'paid' | 'overdue',
            paymentMethod: freight.payment_method || '',
            paymentTerm: freight.payment_term || '',
            paymentDate: freight.payment_date || '',
            paymentProof: freight.payment_proof || '',
            deliveryProof: freight.delivery_proof || '',
            proofOfDeliveryImage: freight.proof_of_delivery_image || '',
            observations: freight.observations || '',
            pixKey: freight.pix_key || '',
            requesterName: freight.requester_name || '',
            startDate: freight.start_date || '',
            endDate: freight.end_date || '',
            departureDate: freight.departure_date || freight.created_at,
            arrivalDate: freight.arrival_date || '',
            createdAt: freight.created_at,
            updatedAt: freight.updated_at,
            expenses: [] // Inicializar array vazio de despesas
          };
          
          saveFreight(localFreight);
          freightsCount++;
        } catch (error) {
          console.error('Erro ao salvar frete local:', error);
        }
      }
    }

    // Verificar dados locais após sincronização
    const localFreights = getFreightsByUserId(userId);
    const localClients = getClientsByUserId(userId);
    const localDrivers = getDriversByUserId(userId);

    console.log('=== RESULTADO DA SINCRONIZAÇÃO ===');
    console.log('Clientes sincronizados:', clientsCount);
    console.log('Motoristas sincronizados:', driversCount);
    console.log('Fretes sincronizados:', freightsCount);
    console.log('Total local após sync - Clientes:', localClients.length);
    console.log('Total local após sync - Motoristas:', localDrivers.length);
    console.log('Total local após sync - Fretes:', localFreights.length);

    return {
      success: true,
      message: `Sincronização concluída! ${clientsCount + driversCount + freightsCount} registros atualizados.`,
      details: {
        clients: clientsCount,
        drivers: driversCount,
        freights: freightsCount
      }
    };

  } catch (error) {
    console.error('Erro durante sincronização forçada:', error);
    return {
      success: false,
      message: 'Erro durante a sincronização. Verifique sua conexão.',
      details: {
        clients: 0,
        drivers: 0,
        freights: 0
      }
    };
  }
};