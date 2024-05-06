"use client";
import React, {useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import LoginActivities from "../../components/LoginActivities";

const Page: React.FC = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io("http://localhost:5500");

    // Function to generate unique device ID
    const generateDeviceUniqueId = (userAgent: string): string => {
      const hash = require("crypto").createHash("sha256");
      hash.update(userAgent);
      return hash.digest("hex");
    };
    const fetchUserData = () => {
      // Calculate unique ID for the device
      const userAgent = navigator.userAgent || "";
      const uniqueId = generateDeviceUniqueId(userAgent);

      // Emit event to check if device exists
      socket.emit("getDeviceByUniqueId", uniqueId);

      // Listen for server response
      socket.on("getDeviceByUniqueId:success", (device) => {
        console.log("Device found:", device);
        setUserId(device.userId);
        router.push('/dashboard/user')
      });

      socket.on("getDeviceByUniqueId:error", (errorMessage) => {
        console.error(errorMessage);
        router.push("/");
      });
    };

    fetchUserData();

    return () => {
    };
  }, [router]);

  return (
    <>
      <div className="text-center font-bold text-5xl my-0 py-14 bg-blue-900 text-white">
        Manage Access and Devices
      </div>
      <div className="text-center text-xl mt-8 mb-8 flex justify-center">
        <div className="md:w-[50%]">
          These signed in devices have been currently active on this account.
          You can sign out any unfamiliar devices.
        </div>
      </div>
      <LoginActivities userId={userId}/>
    </>
  );
};

export default Page;
