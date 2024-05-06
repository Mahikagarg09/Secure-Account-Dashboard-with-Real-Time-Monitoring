import React, { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";

interface LoginActivity {
  device: string;
  timestamp: string;
  uniqueId: string;
}

interface Props {
  userId: string;
}

const LoginActivities: React.FC<Props> = ({ userId }) => {
  const [loginActivities, setLoginActivities] = useState<LoginActivity[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const[error,setError]=useState<string>("")

  useEffect(() => {
    const newSocket = io("http://localhost:5500");
    setSocket(newSocket);

    return () => {
    };
  }, []);

  useEffect(() => {
    if (!socket) return; // Ensure socket is initialized

    socket.emit("getLoginActivitiesByUserId", userId);
    console.log(userId);
    socket.on("getLoginActivitiesByUserId:success", (loginActivities) => {
      console.log("Login activities:", loginActivities);
      setLoginActivities(loginActivities);
    });

    socket.on("getLoginActivitiesByUserId:error", (errorMessage) => {
      console.error(errorMessage);
    });
  }, [socket, userId]);

  const handleSignout = (uniqueId: string, userId: string): void => {
    const socket = io("http://localhost:5500");
    console.log("Signout button clicked", uniqueId, "   ", userId);
    socket.emit("logout", { userId, deviceId: uniqueId });

    socket.on("logout:success", (message) => {
      console.log(message);
      setLoginActivities(prevActivities => prevActivities.filter(activity => activity.uniqueId !== uniqueId));
      // setError(message)
    });

    socket.on("logout:error",(message:string) =>{
      console.log(message);
      setError(message);
    })
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${formattedDate} ${hours}:${minutes}`;
  };

  return (
    <div className="w-[80%] flex justify-center items-center m-auto mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:w-[70%] w-[80%]">
        {error && <div className="text-red-500">{error}</div>}
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
              <span className="ml-2">{formatTimestamp(item.timestamp)}</span>
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
  );
};

export default LoginActivities;
