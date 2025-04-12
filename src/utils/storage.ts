
import { User, Client, Driver, Freight, CollectionOrder } from "@/types";

// Generic function to get items from localStorage
const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return defaultValue;
    }
    return JSON.parse(serializedValue) as T;
  } catch (error) {
    console.error(`Error getting item from localStorage with key "${key}":`, error);
    return defaultValue;
  }
};

// Generic function to set items in localStorage
const setLocalStorageItem = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error setting item in localStorage with key "${key}":`, error);
  }
};

// Users
export const getCurrentUser = (): User | null => {
  return getLocalStorageItem<User | null>('user', null);
};

export const setCurrentUser = (user: User): void => {
  setLocalStorageItem('user', user);
};

export const logoutUser = (): void => {
  localStorage.removeItem('user');
};

export const saveUser = (user: User): void => {
  setLocalStorageItem('user', user);
};

export const getUser = (): User | null => {
  return getLocalStorageItem<User | null>('user', null);
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getLocalStorageItem<User[]>('users', []);
  return users.find(user => user.email === email);
};

export const addUser = (user: User): void => {
  const users = getLocalStorageItem<User[]>('users', []);
  users.push(user);
  setLocalStorageItem('users', users);
};

export const updateUser = (user: User): void => {
  // Update the current user
  setCurrentUser(user);
  
  // Also update in the users array
  const users = getLocalStorageItem<User[]>('users', []);
  const updatedUsers = users.map(u => u.id === user.id ? user : u);
  setLocalStorageItem('users', updatedUsers);
};

// Clients
export const getClientsByUserId = (userId: string): Client[] => {
  const clients = getLocalStorageItem<Client[]>('clients', []);
  return clients.filter(client => client.userId === userId);
};

export const saveClient = (client: Client): void => {
  const clients = getLocalStorageItem<Client[]>('clients', []);
  const existingIndex = clients.findIndex(c => c.id === client.id);
  
  if (existingIndex >= 0) {
    clients[existingIndex] = client;
  } else {
    clients.push(client);
  }
  
  setLocalStorageItem('clients', clients);
};

export const addClient = (client: Client): void => {
  const clients = getLocalStorageItem<Client[]>('clients', []);
  clients.push(client);
  setLocalStorageItem('clients', clients);
};

export const updateClient = (client: Client): void => {
  const clients = getLocalStorageItem<Client[]>('clients', []);
  const updatedClients = clients.map(c => c.id === client.id ? client : c);
  setLocalStorageItem('clients', updatedClients);
};

export const deleteClient = (id: string): void => {
  const clients = getLocalStorageItem<Client[]>('clients', []);
  const updatedClients = clients.filter(client => client.id !== id);
  setLocalStorageItem('clients', updatedClients);
};

// Drivers
export const getDriversByUserId = (userId: string): Driver[] => {
  const drivers = getLocalStorageItem<Driver[]>('drivers', []);
  return drivers.filter(driver => driver.userId === userId);
};

export const getDriverById = (id: string): Driver | undefined => {
  const drivers = getLocalStorageItem<Driver[]>('drivers', []);
  return drivers.find(driver => driver.id === id);
};

export const addDriver = (driver: Driver): void => {
  const drivers = getLocalStorageItem<Driver[]>('drivers', []);
  drivers.push(driver);
  setLocalStorageItem('drivers', drivers);
};

export const updateDriver = (driver: Driver): void => {
  const drivers = getLocalStorageItem<Driver[]>('drivers', []);
  const updatedDrivers = drivers.map(d => d.id === driver.id ? driver : d);
  setLocalStorageItem('drivers', updatedDrivers);
};

export const deleteDriver = (id: string): void => {
  const drivers = getLocalStorageItem<Driver[]>('drivers', []);
  const updatedDrivers = drivers.filter(driver => driver.id !== id);
  setLocalStorageItem('drivers', updatedDrivers);
};

// Freights
export const getFreightsByUserId = (userId: string): Freight[] => {
  const freights = getLocalStorageItem<Freight[]>('freights', []);
  return freights.filter(freight => freight.userId === userId);
};

export const saveFreight = (freight: Freight): void => {
  const freights = getLocalStorageItem<Freight[]>('freights', []);
  const existingIndex = freights.findIndex(f => f.id === freight.id);
  
  if (existingIndex >= 0) {
    freights[existingIndex] = freight;
  } else {
    freights.push(freight);
  }
  
  setLocalStorageItem('freights', freights);
};

export const addFreight = (freight: Freight): void => {
  const freights = getLocalStorageItem<Freight[]>('freights', []);
  freights.push(freight);
  setLocalStorageItem('freights', freights);
};

export const updateFreight = (freight: Freight): void => {
  const freights = getLocalStorageItem<Freight[]>('freights', []);
  const updatedFreights = freights.map(f => f.id === freight.id ? freight : f);
  setLocalStorageItem('freights', updatedFreights);
};

export const deleteFreight = (id: string): void => {
  const freights = getLocalStorageItem<Freight[]>('freights', []);
  const updatedFreights = freights.filter(freight => freight.id !== id);
  setLocalStorageItem('freights', updatedFreights);
};

// Collection Orders
export const getCollectionOrdersByUserId = (userId: string): CollectionOrder[] => {
  const collectionOrders = getLocalStorageItem<CollectionOrder[]>('collectionOrders', []);
  return collectionOrders.filter(order => order.userId === userId);
};

export const getCollectionOrderById = (id: string): CollectionOrder | undefined => {
  const collectionOrders = getLocalStorageItem<CollectionOrder[]>('collectionOrders', []);
  return collectionOrders.find(order => order.id === id);
};

export const saveCollectionOrder = (order: CollectionOrder): void => {
  const collectionOrders = getLocalStorageItem<CollectionOrder[]>('collectionOrders', []);
  const existingIndex = collectionOrders.findIndex(o => o.id === order.id);

  if (existingIndex >= 0) {
    collectionOrders[existingIndex] = order;
  } else {
    collectionOrders.push(order);
  }

  setLocalStorageItem('collectionOrders', collectionOrders);
};

export const deleteCollectionOrder = (id: string): void => {
  const collectionOrders = getLocalStorageItem<CollectionOrder[]>('collectionOrders', []);
  const updatedOrders = collectionOrders.filter(order => order.id !== id);
  setLocalStorageItem('collectionOrders', updatedOrders);
};
