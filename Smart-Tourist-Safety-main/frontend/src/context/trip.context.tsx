import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getTrips } from "../api"; // your api.ts
import { Trip } from "../types"; // define a Trip type similar to your TripManagement

interface TripContextType {
  trips: Trip[];
  refreshTrips: () => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider = ({ children, token }: { children: ReactNode; token: string }) => {
  const [trips, setTrips] = useState<Trip[]>([]);

  const refreshTrips = async () => {
    try {
      const data = await getTrips(token);
      setTrips(data);
    } catch (err) {
      console.error("Failed to fetch trips:", err);
    }
  };

  useEffect(() => {
    refreshTrips();
  }, [token]);

  return (
    <TripContext.Provider value={{ trips, refreshTrips }}>
      {children}
    </TripContext.Provider>
  );
};

// Custom hook for easy usage
export const useTrips = () => {
  const context = useContext(TripContext);
  if (!context) throw new Error("useTrips must be used inside TripProvider");
  return context;
};
