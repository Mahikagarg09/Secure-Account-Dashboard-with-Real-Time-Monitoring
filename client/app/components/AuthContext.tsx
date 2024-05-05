"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface AuthContextProps {
  children: React.ReactNode;
}

const AuthContext: React.FC<AuthContextProps> = ({ children }) => {
  const router = useRouter();
  function generateDeviceUniqueId(userAgent) {
    const hash = require("crypto").createHash("sha256");
    hash.update(userAgent);
    return hash.digest("hex");
  }
   console.log("before useffect")
  useEffect(() => {
    console.log("working")
    // Function to fetch user data based on unique device ID
    const fetchUserData = async () => {
        // Calculate unique ID for the device
        const userAgent = navigator.userAgent || "";
        const parser = require("ua-parser-js");
        const userAgentData = parser(userAgent);
        const browserType = userAgentData.browser.name || "Unknown Browser";
        const deviceType = userAgentData.device.type || "Unknown Device";
        const deviceInfo = `${browserType},${deviceType}`;
        const uniqueId = generateDeviceUniqueId(userAgent);
        console.log(uniqueId);

        try {
            // Send request to check if device exists
            const response = await axios.get(
                `http://localhost:5500/api/user/devices?uniqueId=${uniqueId}`
            );

            if (response.status === 200) {
                console.log(response.data);
                localStorage.setItem("userId", response.data.userId);
                // setUserId(response.data.userId); // Assuming the server returns the userId associated with the device
                router.push("/dashboard/user");
            } else {
                console.log("Device not found");
                router.push("/");
                throw new Error("Device not found");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    // Call the function to fetch user data when the component mounts
    fetchUserData();
}, []);


  // Return the child components
  return <>{children}</>;
};

export default AuthContext;
