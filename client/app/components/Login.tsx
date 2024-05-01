"use client"
import Link from 'next/link'
import React from 'react'

export default function Login() {
  return (
    <div>
         <div className="h-screen bg-gray-200 py-20 p-4 md:p-20 lg:p-32">
            <div className=" pb-[80px] text-center ">
                <h1 className="text-3xl lg:text-[2.5rem]">Create New Account</h1>
                <p className="mt-5">
                    <Link href={`/register`}>Already have an account? <span className='text-blue-900 font-semibold'>Sign Up</span></Link>
                </p>
            </div>
            <div className="max-w-md bg-white rounded-lg overflow-hidden shadow-lg mx-auto">
                <div className="p-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
                    <p className="text-gray-700 mb-6 text-lg">Please sign in to your account</p>
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
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
                {/* {err && (
                    <div>
                        <p className="mt-5 text-center text-md font-semibold text-red-500">{err}</p>
                    </div>
                )} */}
            </div>
        </div>
    </div>
  )
}
