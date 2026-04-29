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
      <div className="bg-panel-dark  text-white shadow-md w-full max-w-sm space-y-4 text-center p-8">
        <h1  className="panel-large-text" >Company Name Login</h1>
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