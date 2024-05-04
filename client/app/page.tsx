import { AuthProvider } from "./components/AuthContext";

import Login from "./components/Login";

export default function Page() {

  return (
    <>
      <AuthProvider>
        <Login/>
      </AuthProvider>
    </>
  );
}
