"use client"

// Page.tsx
import { useRouter } from 'next/navigation';
import AuthContext from "./components/AuthContext";
import Login from "./components/Login";

export default function Page() {
  const router = useRouter();

  return (
    <>
      <AuthContext router={router}>
        <Login />
      </AuthContext>
    </>
  );
}
