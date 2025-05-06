
import { useState, useEffect } from "react";
import { Driver } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getDriversByUserId } from "@/utils/storage";

export const useQuotationDrivers = () => {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  
  useEffect(() => {
    if (user) {
      const userDrivers = getDriversByUserId(user.id);
      setDrivers(userDrivers);
    }
  }, [user]);

  return {
    drivers
  };
};
