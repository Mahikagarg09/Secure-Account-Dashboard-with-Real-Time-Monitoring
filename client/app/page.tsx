import { AuthContextProvider } from "./components/AuthContext";

import Login from "./components/Login";

export default function Page() {
  // const router = useRouter();

  return (
    <>
      <AuthContextProvider>
        <Login/>
      </AuthContextProvider>
    </>
  );
}
