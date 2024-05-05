"use client";

// import withProtectedRoute from "../../components/withProtectedRoute";
import React, { use, useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
// import { useAuth } from '../../components/AuthContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthContext';
import { io } from 'socket.io-client';

interface GridItem {
  title: string;
  timestamp: string;
}

//MAKE A DUMMY GRID DATA
const gridData: GridItem[] = [
  {
    title: 'Chrome,Desktop',
    timestamp: '2021-10-01T10:00:00.000Z',
  },
  {
    title: 'Safari,Mobile',
    timestamp: '2021-10-01T10:00:00.000Z',
  },
  {
    title: 'Firefox,Tablet',
    timestamp: '2021-10-01T10:00:00.000Z',
  },
  {
    title: 'Edge,Desktop',
    timestamp: '2021-10-01T10:00:00.000Z',
  },
];

const Page: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io("http://localhost:5500");

    // Function to generate unique device ID
    const generateDeviceUniqueId = (userAgent: string): string => {
      const hash = require("crypto").createHash("sha256");
      hash.update(userAgent);
      return hash.digest("hex");
    };

    // Function to fetch user data based on unique device ID
    const fetchUserData = () => {
      // Calculate unique ID for the device
      const userAgent = navigator.userAgent || "";
      const uniqueId = generateDeviceUniqueId(userAgent);

      // Emit event to check if device exists
      socket.emit("getDeviceByUniqueId", uniqueId);

      // Listen for server response
      socket.on("getDeviceByUniqueId:success", (device) => {
        console.log("Device found:", device);
        // Perform actions based on the retrieved device data
        // For example, update state or display user information
        router.push("/dashboard/user");
      });

      socket.on("getDeviceByUniqueId:error", (errorMessage) => {
        console.error(errorMessage);
        router.push("/");
      });
    };

    // Call the function to fetch user data when the component mounts
    fetchUserData();

    // Clean up event listeners and socket connection when component unmounts
    return () => {
      socket.disconnect();
    };
  }, [router]);

  const handleSignout = () => {
    // Implement signout functionality here
    console.log('Signout button clicked');
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
      <div className="w-[80%] flex justify-center items-center m-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:w-[70%] w-[80%]">
          {gridData.map((item, index) => (
            <div key={index} className="border border-gray-400 rounded-md p-5 w-full mb-4">
              <div className="font-bold">{item.title}</div>
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
                <button onClick={handleSignout} className="bg-blue-900 text-white mt-4 py-2 px-6 rounded w-full text-center">
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

// export default withProtectedRoute(Page);
