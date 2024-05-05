"use client";
import React, { useState, useEffect } from "react";
import withProtectedRoute from "../../components/withProtectedRoute";
import io from "socket.io-client";

interface ListItem {
  username: string;
  email: string;
}

const Page: React.FC = () => {
  const [listData, setListData] = useState<ListItem[]>([]);

  useEffect(() => {
    const socket = io("http://localhost:5500");

    socket.emit("getUsers"); // Emit event to request users data

    // Define event listeners for success and error responses
    const handleSuccess = (users: ListItem[]) => {
      console.log(users);
      setListData(users);
    };

    const handleError = (errorMessage: string) => {
      console.error("Error fetching users:", errorMessage);
    };

    socket.on("getUsers:success", handleSuccess);
    socket.on("getUsers:error", handleError);

    // Cleanup function to disconnect socket when component unmounts
    return () => {
    };
  }, []); // Empty dependency array means this effect runs once on component mount


  return (
    <>
      <div className="text-center font-bold text-5xl my-0 py-14 bg-blue-900 text-white">
        Manage Access and Devices
      </div>
      <div className="text-center text-xl mt-8 mb-8 flex justify-center">
        <div className="md:w-[50%]">
          These signed in devices have been currently active on the dashboard.
          Manage all the users and their devices.
        </div>
      </div>
      <div className="flex justify-center items-center m-auto">
        <ul className="md:w-[70%] w-[90%]">
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
                    {item.username}
                  </p>
                  <p className="text-sm text-gray-500 truncate ">
                    {item.email}
                  </p>
                </div>
                <button className="inline-flex items-center text-base font-semibold text-white rounded p-2 bg-blue-900">
                  Devices
                </button>
              </div>
              <div className="border border-gray-200 my-1"></div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Page;
