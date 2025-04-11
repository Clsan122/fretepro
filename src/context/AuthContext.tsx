
import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "@/types";
import { getCurrentUser, setCurrentUser, logoutUser } from "@/utils/storage";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  userDevices: string[];
  addDevice: (deviceId: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  setUser: () => {},
  userDevices: [],
  addDevice: () => {}
});

export const useAuth = () => useContext(AuthContext);

// Simple function to generate a device ID
const generateDeviceId = () => {
  return `device-${Math.random().toString(36).substring(2, 15)}`;
};

// Get or create a device ID for the current browser
const getOrCreateDeviceId = () => {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userDevices, setUserDevices] = useState<string[]>([]);
  const currentDeviceId = getOrCreateDeviceId();

  useEffect(() => {
    // Check if user is logged in on initial load
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
      
      // Load user devices
      const devices = localStorage.getItem(`devices_${storedUser.id}`);
      const devicesList = devices ? JSON.parse(devices) : [];
      
      // Add current device if not already in the list
      if (!devicesList.includes(currentDeviceId)) {
        devicesList.push(currentDeviceId);
        localStorage.setItem(`devices_${storedUser.id}`, JSON.stringify(devicesList));
      }
      
      setUserDevices(devicesList);
    }
  }, []);

  const login = (userData: User) => {
    setCurrentUser(userData);
    setUser(userData);
    setIsAuthenticated(true);
    
    // Initialize or update device list for this user
    const devices = localStorage.getItem(`devices_${userData.id}`);
    const devicesList = devices ? JSON.parse(devices) : [];
    
    // Add current device if not already in the list
    if (!devicesList.includes(currentDeviceId)) {
      devicesList.push(currentDeviceId);
      localStorage.setItem(`devices_${userData.id}`, JSON.stringify(devicesList));
    }
    
    setUserDevices(devicesList);
    toast.success(`Bem-vindo, ${userData.name}!`);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setIsAuthenticated(false);
    setUserDevices([]);
    toast.info("Você foi desconectado com sucesso");
  };

  const updateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUser(updatedUser);
    toast.success("Perfil atualizado com sucesso");
  };

  const addDevice = (deviceId: string) => {
    if (user) {
      const updatedDevices = [...userDevices, deviceId];
      setUserDevices(updatedDevices);
      localStorage.setItem(`devices_${user.id}`, JSON.stringify(updatedDevices));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated, 
      setUser: updateUser,
      userDevices,
      addDevice
    }}>
      {children}
    </AuthContext.Provider>
  );
};
