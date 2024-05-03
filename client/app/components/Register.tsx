"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Register: React.FC = () => {
  const router = useRouter();
  const [username, setusername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !email || !password) {
        setError("All fields are necessary");
        return;
    }

    const res = {
        username,
        email,
        password
    };

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
        setError("Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long.");
        return;
    }

    try {
        const response = await axios.post("http://localhost:5500/api/auth/register", res);
        // const user_id = response.data.data.userId;

        // router.push(`/verify?userId=${user_id}`);
        router.push('/user');

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("An error occurred while registering:", error.response?.data || error.message);
        } else {
            console.error("An error occurred while registering:", error.message);
        }
        setError("An error occurred while registering");
    }
};
  return (
    <div>
      <form
      onSubmit={handleSubmit}
      >
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
            onChange={e => setusername(e.target.value)}
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
            onChange={e => setEmail(e.target.value)}
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
            onChange={e => setPassword(e.target.value)}
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
                <p className="mt-5 text-center text-md font-semibold text-red-500">{error}</p>
            </div>
        )}
    </div>
  );
};

export default Register;
