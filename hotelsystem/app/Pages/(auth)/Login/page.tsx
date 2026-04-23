"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    //TODO: Validate Login Here
    router.push("/Pages/CreateBooking");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm space-y-4 text-center">
        <h1>Company Name Login</h1>
        <input className="textfield" placeholder="Username" />
        <input className="textfield" placeholder="Password" />
        <button 
          onClick={handleLogin}
          className="btn w-fit px-6"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}