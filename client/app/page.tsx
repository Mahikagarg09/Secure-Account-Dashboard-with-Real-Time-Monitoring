import AuthContext from "./components/AuthContext";

import Login from "./components/Login";

export default function Page() {

  return (
    <>
      <AuthContext>
        <Login/>
      </AuthContext>
    </>
  );
}
