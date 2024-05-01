"use client";
const Page: React.FC = () => {
  return (
    <>
      <div className="text-center font-bold text-5xl mt-16">
        Manage Access and Devices
      </div>
      <div className="text-center text-xl mt-8 mb-8">
        These signed in devices have been currently active on this account. You
        can sign out any unfamiliar devices.
      </div>
      <div className="w-[80%] flex justify-center items-center m-auto">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-200 rounded-md p-5">
            <div className="font-bold">
                PC-CHROME Web Browser
            </div>
            <div className="border-b "></div>
        </div>
        <div className="bg-gray-200 rounded-md p-5">01</div>
        <div className="bg-gray-200 rounded-md p-5">01</div>
        <div className="bg-gray-200 rounded-md p-5">01</div>
      </div>
      </div>
    </>
  );
};

export default Page;
