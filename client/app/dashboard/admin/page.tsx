"use client";
import React, { useState, useEffect, useReducer } from "react";
import io, { Socket } from "socket.io-client";
import { useRouter } from "next/navigation";
import LoginActivities from "../../components/LoginActivities";

interface ListItem {
  username: string;
  email: string;
  _id: string;
}

const Page: React.FC = () => {
  const [listData, setListData] = useState<ListItem[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();
  const adminId= process.env.NEXT_PUBLIC_ADMIN_ID
  useEffect(() => {
    // Establish Socket.IO connection
    const newSocket = io("http://localhost:5500");
    setSocket(newSocket);

    return () => {
    };
}, []);

  useEffect(() => {
    if (!socket) return; // Ensure socket is initialized

    const generateDeviceUniqueId = (userAgent: string): string => {
      const hash = require("crypto").createHash("sha256");
      hash.update(userAgent);
      return hash.digest("hex");
    };

    const userAgent = navigator.userAgent || "";
    const parser = require("ua-parser-js");
    const userAgentData = parser(userAgent);
    const browserType = userAgentData.browser.name || "Unknown Browser";
    const deviceType = userAgentData.device.type || "Unknown Device";
    const deviceInfo = `${browserType},${deviceType}`;
    const uniqueId = generateDeviceUniqueId(userAgent);

    socket.emit("getDeviceByUniqueId", uniqueId);

    // Listen for server response
    socket.on("getDeviceByUniqueId:success", (device) => {
      console.log("Device found:", device);
      router.push("/dashboard/admin");
    });

    socket.on("getDeviceByUniqueId:error", (errorMessage) => {
      console.error(errorMessage);
        router.push("/");
    });

    return () => {
      // Cleanup function to remove event listeners
      socket.off("getDeviceByUniqueId:success");
      socket.off("getDeviceByUniqueId:error");
    };
}, [socket]);

  useEffect(() => {
    // if (!socket) return;
    const socket = io("http://localhost:5500");

    socket.emit("getUsers");

    socket.on("getUsers:success", (users: ListItem[]) => {
      console.log("USERS",users);
      setListData(users);
    });

    socket.on("getUsers:error", (errorMessage: string) => {
      console.error("Error fetching users:", errorMessage);
    });
    return () => {
    };
  }, []);

  const handleDevices = (userId: string) => {
    setUserId(userId);
    setShow(true);
    if (!socket) return; // Ensure socket is initialized
  };

  return (
    <>
      <div className="text-center font-bold text:4xl md:text-5xl py-8 my-0 md:py-14 bg-blue-900 text-white">
        Manage Access and Devices
      </div>
      {!show ? (
        <>
          <div className="text-center mt-8 mb-8 flex justify-center">
            <div className="md:w-[50%] text-sm md:text-xl">
              These signed in devices have been currently active on the
              dashboard. Manage all the users and their devices.
            </div>
          </div>
          <div className="flex justify-center items-center m-auto">
            <ul className="md:w-[70%] w-[80%]">
              {listData.map((item, index) => (
                <li className="pb-3 sm:pb-4" key={index}>
                  <div className="flex items-center space-x-8 rtl:space-x-reverse">
                    <div className="flex-shrink-0">
                      <svg
                        className="feather feather-user"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item._id==adminId ? 'You' :  item.username}
                      </p>
                      <p className="text-sm text-gray-500 truncate ">
                        {item.email}
                      </p>
                    </div>
                    <button
                      className="inline-flex items-center text-sm md:text-base font-semibold text-white rounded p-2 bg-blue-900"
                      onClick={() => handleDevices(item._id)}
                    >
                      Devices
                    </button>
                  </div>
                  <div className="border border-gray-200 my-1"></div>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <>
        <button className="font-semibold rounded p-2 ml-8 mt-8" onClick={()=> setShow(false)}> ⬅️Back</button>
          <LoginActivities userId={userId}/>
        </>
      )}
    </>
  );
};

export default Page;
