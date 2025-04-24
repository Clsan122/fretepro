import { CollectionOrder, Client, Driver, User, Freight } from "@/types";

const COLLECTION_ORDERS_KEY = "collectionOrders";
const CLIENTS_KEY = "clients";
const DRIVERS_KEY = "drivers";
const USERS_KEY = "users";
const FREIGHTS_KEY = "freights";

// Generic function to get items from localStorage
function getItems<T>(key: string): T[] {
  const storedItems = localStorage.getItem(key);
  return storedItems ? JSON.parse(storedItems) : [];
}

// Generic function to save items to localStorage
function saveItems<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

// Collection Orders
export const getCollectionOrders = (): CollectionOrder[] => getItems<CollectionOrder>(COLLECTION_ORDERS_KEY);
export const saveCollectionOrders = (orders: CollectionOrder[]): void => saveItems<CollectionOrder>(COLLECTION_ORDERS_KEY, orders);
export const saveCollectionOrder = (order: CollectionOrder): void => {
  const orders = getCollectionOrders();
  const existingIndex = orders.findIndex(o => o.id === order.id);

  if (existingIndex > -1) {
    orders[existingIndex] = order;
  } else {
    orders.push(order);
  }

  saveCollectionOrders(orders);
};
export const getCollectionOrderById = (id: string): CollectionOrder | undefined => {
  const orders = getCollectionOrders();
  return orders.find(order => order.id === id);
};
export const deleteCollectionOrder = (id: string): void => {
  const orders = getCollectionOrders();
  const updatedOrders = orders.filter(order => order.id !== id);
  saveCollectionOrders(updatedOrders);
};

// Clients
export const getClients = (): Client[] => getItems<Client>(CLIENTS_KEY);
export const saveClients = (clients: Client[]): void => saveItems<Client>(CLIENTS_KEY, clients);
export const saveClient = (client: Client): void => {
  const clients = getClients();
  const existingIndex = clients.findIndex(c => c.id === client.id);

  if (existingIndex > -1) {
    clients[existingIndex] = client;
  } else {
    clients.push(client);
  }

  saveClients(clients);
};
export const getClientsByUserId = (userId: string): Client[] => {
  const clients = getClients();
  return clients.filter(client => client.userId === userId);
};
export const getClientById = (clientId: string) => {
  const clients = getClients();
  return clients.find(client => client.id === clientId) || null;
};

// Drivers
export const getDrivers = (): Driver[] => getItems<Driver>(DRIVERS_KEY);
export const saveDrivers = (drivers: Driver[]): void => saveItems<Driver>(DRIVERS_KEY, drivers);
export const saveDriver = (driver: Driver): void => {
  const drivers = getDrivers();
  const existingIndex = drivers.findIndex(d => d.id === driver.id);

  if (existingIndex > -1) {
    drivers[existingIndex] = driver;
  } else {
    drivers.push(driver);
  }

  saveDrivers(drivers);
};
export const getDriversByUserId = (userId: string): Driver[] => {
  const drivers = getDrivers();
  return drivers.filter(driver => driver.userId === userId);
};
export const getDriverById = (driverId: string): Driver | undefined => {
  const drivers = getDrivers();
  return drivers.find(driver => driver.id === driverId);
};
export const deleteDriver = (id: string): void => {
  const drivers = getDrivers();
  const updatedDrivers = drivers.filter(driver => driver.id !== id);
  saveDrivers(updatedDrivers);
};

// Users
export const getUsers = (): User[] => getItems<User>(USERS_KEY);
export const saveUsers = (users: User[]): void => saveItems<User>(USERS_KEY, users);
export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);

  if (existingIndex > -1) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }

  saveUsers(users);
};
export const getUserById = (userId: string) => {
  const users = getUsers();
  return users.find(user => user.id === userId) || null;
};

// Freights
export const getFreights = (): Freight[] => getItems<Freight>(FREIGHTS_KEY);
export const saveFreights = (freights: Freight[]): void => saveItems<Freight>(FREIGHTS_KEY, freights);
export const saveFreight = (freight: Freight): void => {
  const freights = getFreights();
  const existingIndex = freights.findIndex(f => f.id === freight.id);

  if (existingIndex > -1) {
    freights[existingIndex] = freight;
  } else {
    freights.push(freight);
  }

  saveFreights(freights);
};
export const getFreightById = (id: string): Freight | undefined => {
  const freights = getFreights();
  return freights.find(freight => freight.id === id);
};
export const getFreightsByUserId = (userId: string): Freight[] => {
  const freights = getFreights();
  return freights.filter(freight => freight.userId === userId);
};
export const deleteFreight = (id: string): void => {
  const freights = getFreights();
  const updatedFreights = freights.filter(freight => freight.id !== id);
  saveFreights(updatedFreights);
};
