"use client"
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Page: React.FC = () => {
    const [otp, setOtp] = useState<string>("");
    const [error, setError] = useState<string | null>(null); // State to hold error information
    const router = useRouter();

    // const getDeviceInfo = (): string => {
    //     // Check if navigator object is available
    //     if (typeof navigator !== 'undefined') {
    //       const userAgent = navigator.userAgent;
      
    //       // Check for common keywords to identify the browser and device
    //       let browser = "Unknown Browser";
      
    //       if (userAgent.match(/Firefox/i)) {
    //         browser = 'Firefox';
    //       } else if (userAgent.match(/Chrome/i)) {
    //         browser = 'Chrome';
    //       } else if (userAgent.match(/Safari/i)) {
    //         browser = 'Safari';
    //       } else if (userAgent.match(/Opera|OPR/i)) {
    //         browser = 'Opera';
    //       } else if (userAgent.match(/Edge/i)) {
    //         browser = 'Edge';
    //       } else if (userAgent.match(/MSIE|Trident/i)) {
    //         browser = 'Internet Explorer';
    //       }
      
    //       let device = 'Unknown Device';
      
    //       if (userAgent.match(/Android/i)) {
    //         device = 'Android Device';
    //       } else if (userAgent.match(/iPhone|iPad|iPod/i)) {
    //         device = 'iOS Device';
    //       } else if (userAgent.match(/Windows Phone/i)) {
    //         device = 'Windows Phone';
    //       } else if (userAgent.match(/Windows NT/i)) {
    //         device = 'Windows PC';
    //       } else if (userAgent.match(/Macintosh/i)) {
    //         device = 'Macintosh';
    //       } else if (userAgent.match(/Linux/i)) {
    //         device = 'Linux PC';
    //       }
      
    //       return ` ${browser}, ${device}`;
    //     } else {
    //       return "Unknown Device";
    //     }
    //   };
      
    //   const deviceInfo = getDeviceInfo();
    //   console.log(deviceInfo);

    const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const params = new URLSearchParams(window.location.search);
        const userId = params.get("userId");

        console.log(userId);

        try {
            const response = await axios.post<{ status: string }>("http://localhost:5500/api/auth/verifyOTP", { userId, otp });
            console.log(response);
            const status = response.data.status;

            if (status === 'VERIFIED') {
                // Navigate to home page after successful verification
                console.log("yes")
                router.push('/user');
            }
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred");
        }
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
                        <form 
                        onSubmit={handleVerify}
                        >
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
                    {error && (
                        <div className="text-center text-red-500">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
  )
}

export default Page;
