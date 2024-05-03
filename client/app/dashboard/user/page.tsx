"use client";
interface GridItem {
  title: string;
  timestamp: string;
}

const gridData: GridItem[] = [
  { title: 'Chrome, Web Browser', timestamp: '12/04/24 12:47pm GMT' },
  { title: 'Chrome, Web Browser', timestamp: '12/04/24 12:47pm GMT' },
  { title: 'Chrome, Web Browser', timestamp: '12/04/24 12:47pm GMT' },
  { title: 'Chrome, Web Browser', timestamp: '12/04/24 12:47pm GMT' },

];
const Page: React.FC = () => {
  return (
    <>
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
            <button className="bg-blue-900 text-white mt-4 py-2 px-6 rounded w-full text-center">
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
