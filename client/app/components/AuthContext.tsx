"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import io from 'socket.io-client';

const socket = io('http://localhost:5500');

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));

    if (userId) {
      router.push("/dashboard/user");
    } else {
      router.push("/");
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ userId }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
