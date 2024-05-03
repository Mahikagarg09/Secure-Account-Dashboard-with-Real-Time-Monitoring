export default function layout({ children }) {
    return (
        <>
          <div className="text-center font-bold text-5xl my-0 py-14 bg-blue-900 text-white">
            Manage Access and Devices
          </div>
          <div>{children}</div>
        </>
    )
}