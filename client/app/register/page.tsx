import React from 'react'
import Register from '../components/Register'
import Link from 'next/link'

export default function page() {
    return (
        <div className='bg-gray-100 min-h-screen'>
            <div className="bg-gray-100 pt-[80px] pb-[150px] text-center ">
                <h1 className="text-3xl lg:text-[2.5rem]">Create New Account</h1>
                <p className="mt-5">
                    <Link href={`/`}>Already have an account? <span className='text-blue-900 font-semibold'>Log In</span></Link>
                </p>
            </div>
            <div className="bg-white sm:w-[90vw] xl:w-[50vw] mt-[-100px] mb-7 m-auto px-14 py-16 rounded-3xl">
                <Register/>
            </div>
        </div>
    )
}