"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "../components/AuthContext";
import { processEnv } from "@next/env";

const Page: React.FC = () => {
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // const {setDeviceInfo} = useAuth();
  const socket = io("http://localhost:5500"); // Establish Socket.IO connection
  useEffect(() => {
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
      localStorage.setItem("deviceInfo", JSON.stringify(device));
      localStorage.setItem("userId", device.userId);
      router.push("/dashboard/user");
    });

    socket.on("getDeviceByUniqueId:error", (errorMessage) => {
      console.error(errorMessage);
    //   router.push("/register");
    });
    return () => {
    };
  }, []);

  const handleVerify = () => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");

    // Emit verifyOTP event with OTP data to the server
    socket.emit("verifyOTP", { userId, otp });

    // Listen for server response
    socket.on("verifyOTP:success", (message:string) => {
      console.log(message);
        router.push("/dashboard/user");
      // }
    });

    socket.on("verifyOTP:error", (errorMessage: string) => {
      console.error(errorMessage);
      setError(errorMessage);
    });

  };
  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
      <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>Email Verification</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>We have sent a code to your email</p>
            </div>
          </div>

          <div>
            <form onSubmit={handleVerify}>
              <div className="form-control w-full max-w-xs m-auto py-3 items-center justify-center text-xl">
                <input
                  type="text"
                  placeholder="Enter your OTP here"
                  className="input w-full max-w-xs mb-3 border border-trueGray-900 py-3 text-center"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <div className="text-center">
                <button className="bg-blue-900 text-white w-full max-w-xs mt-5 px-1 py-2 rounded-lg">
                  Verify
                </button>
              </div>
            </form>
          </div>
          {error && <div className="text-center text-red-500">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Page;
