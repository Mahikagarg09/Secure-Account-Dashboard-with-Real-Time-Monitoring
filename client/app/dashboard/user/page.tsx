"use client";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";

const Page: React.FC = () => {
  const router = useRouter();
  const [loginActivities, setLoginActivities] = useState<any[]>([]);
  const [error,setError]=useState<string>("")
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
        socket.emit("getLoginActivitiesByUserId", device.userId);
        setUserId(device.userId);
        router.push('/dashboard/user')
      });

      socket.on("getLoginActivitiesByUserId:success", (loginActivities) => {
        console.log("Login activities:", loginActivities);
        setLoginActivities(loginActivities);
      });

      socket.on("getDeviceByUniqueId:error", (errorMessage) => {
        console.error(errorMessage);
        router.push("/");
      });
    };

    fetchUserData();

    return () => {
      // socket.disconnect();
    };
  }, [router]);

  const handleSignout = (uniqueId: string, userId: string): void => {
    const socket = io("http://localhost:5500");
    console.log("Signout button clicked", uniqueId, "   ", userId);
    socket.emit("logout", { userId, deviceId: uniqueId });

    socket.on("logout:success", (message) => {
      console.log(message);
      // setError(message)
    });

    socket.on("logout:error",(message:string) =>{
      console.log(message);
      setError(message);
    })
  };

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
      {error && (
        <div>{error}</div>
      )}
      <div className="w-[80%] flex justify-center items-center m-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:w-[70%] w-[80%]">
          {loginActivities.map((item, index) => (
            <div
              key={index}
              className="border border-gray-400 rounded-md p-5 w-full mb-4"
            >
              <div className="font-bold">{item.device}</div>
              <div className="border border-gray-100 my-2"></div>
              <div className="mb-2">Logged in at</div>
              <div className="flex items-center">
                <svg
                  width="24"
                  height="24"
                  xmlns="http://www.w3.org/2000/svg"
                  fillRule="evenodd"
                  clipRule="evenodd"
                >
                  <path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 11h6v1h-7v-9h1v8z" />
                </svg>
                <span className="ml-2">{item.timestamp}</span>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => handleSignout(item.uniqueId,userId)}
                  className="bg-blue-900 text-white mt-4 py-2 px-6 rounded w-full text-center"
                >
                  Signout
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
