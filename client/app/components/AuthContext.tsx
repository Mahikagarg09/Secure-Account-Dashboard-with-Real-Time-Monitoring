"use client";
import { createContext, useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";

interface AuthContextType {
  deviceInfo: string | null;
  setDeviceInfo: React.Dispatch<React.SetStateAction<string | null>>;
}

const initialAuthContext: AuthContextType = {
  deviceInfo: null,
  setDeviceInfo: () => {} 
};

export const AuthContext = createContext<AuthContextType>(initialAuthContext);

export const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [deviceInfo, setDeviceInfo] = useState<string | null>(null);

  useEffect(() => {
    const socket = io("https://secure-account-dashboard-with-real-time.onrender.com");
  
    const fetchUserData = () => {
      const userAgent = navigator.userAgent || "";
      const parser = require("ua-parser-js");
      const userAgentData = parser(userAgent);
      const browserType = userAgentData.browser.name || "Unknown Browser";
      const deviceType = userAgentData.device.type || "Unknown Device";
      const deviceInfo = `${browserType},${deviceType}`;
      const uniqueId = generateDeviceUniqueId(userAgent);

      socket.emit("getDeviceByUniqueId", uniqueId);

      socket.on("getDeviceByUniqueId:success", (device) => {
        setDeviceInfo(device);
        router.push("/dashboard/user");
      });

      socket.on("getDeviceByUniqueId:error", (errorMessage) => {
        router.push("/");
      });
    };
    fetchUserData();
    return () => {
    };
  }, []);

  const generateDeviceUniqueId = (userAgent: string): string => {
    const hash = require("crypto").createHash("sha256");
    hash.update(userAgent);
    return hash.digest("hex");
  };
  return (
    <AuthContext.Provider value={{ setDeviceInfo,deviceInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

