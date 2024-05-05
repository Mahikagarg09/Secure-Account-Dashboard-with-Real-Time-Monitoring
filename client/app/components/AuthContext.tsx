"use client";
// export default AuthContext;
import { createContext, useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";

// Define the context
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
    // Connect to the Socket.IO server
    const socket = io("http://localhost:5500");
  
    // Function to fetch user data based on unique device ID
    const fetchUserData = () => {
      // Calculate unique ID for the device
      const userAgent = navigator.userAgent || "";
      const parser = require("ua-parser-js");
      const userAgentData = parser(userAgent);
      const browserType = userAgentData.browser.name || "Unknown Browser";
      const deviceType = userAgentData.device.type || "Unknown Device";
      const deviceInfo = `${browserType},${deviceType}`;
      const uniqueId = generateDeviceUniqueId(userAgent);

      // Emit event to check if device exists
      socket.emit("getDeviceByUniqueId", uniqueId);

      // Listen for server response
      socket.on("getDeviceByUniqueId:success", (device) => {
        setDeviceInfo(device);
        console.log("here I saved1")
        // localStorage.setItem("deviceInfo",device);
        router.push("/dashboard/user");
      });

      socket.on("getDeviceByUniqueId:error", (errorMessage) => {
        console.error(errorMessage);
        router.push("/");
      });
    };
    fetchUserData();
    return () => {
    };
  }, []);

  // Function to generate a unique ID for the device
  const generateDeviceUniqueId = (userAgent: string): string => {
    const hash = require("crypto").createHash("sha256");
    hash.update(userAgent);
    return hash.digest("hex");
  };
  console.log(deviceInfo)
  return (
    <AuthContext.Provider value={{ setDeviceInfo,deviceInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

