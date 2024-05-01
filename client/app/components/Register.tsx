"use client"
import React from 'react'

export default function Register() {
  return (
    <div>
            <form 
            // onSubmit={handleSubmit}
            >
                <div className="mb-4">
                    <label className="block text-blue-900 font-bold mb-2 text-xl" htmlFor="email">
                        Email
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username"
                        type="email"
                        placeholder="Email"
                        // onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-blue-900 text-xl font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        placeholder="Password"
                        // onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div className="flex items-center justify-center">
                    <button className="bg-blue-900 hover:bg-blue-700 text-white text-2xl font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Sign Up
                    </button>
                </div>
            </form>
        {/* {err && (
            <div>
                <p className="mt-5 text-center text-md font-semibold text-red-500">{err}</p>
            </div>
        )} */}
</div>
  )
}
