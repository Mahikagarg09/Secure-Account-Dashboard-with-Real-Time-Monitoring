"use client";

// import withProtectedRoute from "../../components/withProtectedRoute";
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests

interface GridItem {
  title: string;
  timestamp: string;
}

const Page: React.FC = () => {
  const [gridData, setGridData] = useState<GridItem[]>([]);

  useEffect(() => {
    // Retrieve userId from localStorage
    const userId = localStorage.getItem('userId');

    // Make HTTP request to fetch user's login activities
    axios.get(`http://localhost:5500/api/user/${userId}`)
      .then(response => {
        // Extract login activities from response data
        const loginActivities = response.data.loginActivities;
        // Map login activities to GridItem format
        const gridItems = loginActivities.map((activity: any) => ({
          title: activity.device,
          timestamp: activity.timestamp,
        }));
        // Update state with login activities data
        setGridData(gridItems);
      })
      .catch(error => {
        console.error('Error fetching login activities:', error);
      });
  }, []); // Empty dependency array ensures this effect runs only once

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
