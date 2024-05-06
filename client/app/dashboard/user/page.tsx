"use client";
import React, {useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import LoginActivities from "../../components/LoginActivities";

const Page: React.FC = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const socket = io("http://localhost:5500");

    const generateDeviceUniqueId = (userAgent: string): string => {
      const hash = require("crypto").createHash("sha256");
      hash.update(userAgent);
      return hash.digest("hex");
    };
    const fetchUserData = () => {
      const userAgent = navigator.userAgent || "";
      const uniqueId = generateDeviceUniqueId(userAgent);

      socket.emit("getDeviceByUniqueId", uniqueId);

      socket.on("getDeviceByUniqueId:success", (device) => {
        setUserId(device.userId);
        router.push('/dashboard/user')
      });

      socket.on("getDeviceByUniqueId:error", (errorMessage) => {
        router.push("/");
      });
    };

    fetchUserData();

    return () => {
    };
  }, [router]);

  return (
    <>
      <div className="text-center font-bold text:4xl md:text-5xl py-8 my-0 md:py-14 bg-blue-900 text-white">
        Manage Access and Devices
      </div>
      <div className="text-center mt-8 mb-8 flex justify-center">
        <div className="w-[90%] md:w-[50%] text-base md:text-xl">
          These signed in devices have been currently active on this account.
          You can sign out any unfamiliar devices.
        </div>
      </div>
      <LoginActivities userId={userId}/>
    </>
  );
};

export default Page;
