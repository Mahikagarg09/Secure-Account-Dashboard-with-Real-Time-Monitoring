"use client"
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const socket = io("http://localhost:5500");

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

    const handleSuccess = (device: any) => {
      console.log("Device found:", device);
      router.push("/dashboard/user");
    };

    const handleError = (errorMessage: string) => {
      console.error(errorMessage);
      router.push("/register");
    };

    socket.emit("getDeviceByUniqueId", uniqueId);

    // Listen for server response
    socket.on("getDeviceByUniqueId:success", handleSuccess);
    socket.on("getDeviceByUniqueId:error", handleError);

    return () => {
    };
  }, [router, socket]);

  const handleSubmit = () => {
    // Emit the registration data to the server
    socket.emit("register", { username, email, password });

    // Event listener for register:success
    socket.on("register:success",(message:string) => {
      console.log(message);
      router.push("/dashboard/user");
    });
    // Event listener for register:error
    socket.on("register:error",(message:string) => {
      setError(message)
      console.log(message);
      // router.push("/dashboard/user");
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-blue-900 font-bold mb-2 text-xl"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-blue-900 font-bold mb-2 text-xl"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-blue-900 text-xl font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            className="bg-blue-900 hover:bg-blue-700 text-white text-2xl font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign Up
          </button>
        </div>
      </form>
      {error && (
        <div>
          <p className="mt-5 text-center text-md font-semibold text-red-500">
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default Register;
