import { User, Client, Freight, Driver } from "@/types";

// User storage
export const getUsers = (): User[] => {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
};

export const updateUser = (updatedUser: User): void => {
  const users = getUsers();
  const index = users.findIndex(user => user.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    localStorage.setItem("users", JSON.stringify(users));
    
    // Atualizar o currentUser se for o usuário logado
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  }
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

export const getCurrentUser = (): User | null => {
  const currentUser = localStorage.getItem("currentUser");
  return currentUser ? JSON.parse(currentUser) : null;
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem("currentUser", JSON.stringify(user));
};

export const logoutUser = (): void => {
  localStorage.removeItem("currentUser");
};

// Client storage
export const getClients = (): Client[] => {
  const clients = localStorage.getItem("clients");
  return clients ? JSON.parse(clients) : [];
};

export const saveClient = (client: Client): void => {
  const clients = getClients();
  clients.push(client);
  localStorage.setItem("clients", JSON.stringify(clients));
};

export const updateClient = (updatedClient: Client): void => {
  const clients = getClients();
  const index = clients.findIndex(client => client.id === updatedClient.id);
  if (index !== -1) {
    clients[index] = updatedClient;
    localStorage.setItem("clients", JSON.stringify(clients));
  }
};

export const deleteClient = (clientId: string): void => {
  const clients = getClients();
  const updatedClients = clients.filter(client => client.id !== clientId);
  localStorage.setItem("clients", JSON.stringify(updatedClients));
};

export const getClientsByUserId = (userId: string): Client[] => {
  const clients = getClients();
  return clients.filter(client => client.userId === userId);
};

// Freight storage
export const getFreights = (): Freight[] => {
  const freights = localStorage.getItem("freights");
  return freights ? JSON.parse(freights) : [];
};

export const saveFreight = (freight: Freight): void => {
  const freights = getFreights();
  freights.push(freight);
  localStorage.setItem("freights", JSON.stringify(freights));
};

export const updateFreight = (updatedFreight: Freight): void => {
  const freights = getFreights();
  const index = freights.findIndex(freight => freight.id === updatedFreight.id);
  if (index !== -1) {
    freights[index] = updatedFreight;
    localStorage.setItem("freights", JSON.stringify(freights));
  }
};

export const deleteFreight = (freightId: string): void => {
  const freights = getFreights();
  const updatedFreights = freights.filter(freight => freight.id !== freightId);
  localStorage.setItem("freights", JSON.stringify(updatedFreights));
};

export const getFreightsByUserId = (userId: string): Freight[] => {
  const freights = getFreights();
  return freights.filter(freight => freight.userId === userId);
};

export const getFreightsByClientId = (clientId: string): Freight[] => {
  const freights = getFreights();
  return freights.filter(freight => freight.clientId === clientId);
};

// Drivers
export const getDrivers = (): Driver[] => {
  const data = localStorage.getItem("drivers");
  return data ? JSON.parse(data) : [];
};

export const getDriversByUserId = (userId: string): Driver[] => {
  try {
    const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');
    return drivers.filter((driver: Driver) => driver.userId === userId);
  } catch (error) {
    console.error('Error getting drivers:', error);
    return [];
  }
};

export const getDriverById = (id: string): Driver | undefined => {
  const drivers = getDrivers();
  return drivers.find((driver) => driver.id === id);
};

export const addDriver = (driver: Driver): void => {
  const drivers = getDrivers();
  localStorage.setItem("drivers", JSON.stringify([...drivers, driver]));
};

export const updateDriver = (driver: Driver): void => {
  const drivers = getDrivers();
  const index = drivers.findIndex((c) => c.id === driver.id);
  if (index !== -1) {
    drivers[index] = driver;
    localStorage.setItem("drivers", JSON.stringify(drivers));
  }
};

export const deleteDriver = (id: string): void => {
  const drivers = getDrivers();
  localStorage.setItem("drivers", JSON.stringify(drivers.filter((driver) => driver.id !== id)));
};
