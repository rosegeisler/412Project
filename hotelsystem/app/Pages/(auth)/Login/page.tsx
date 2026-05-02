"use client";

import { useRouter } from "next/navigation";
import Panel from "../../../components/Panel";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorLabel, setError] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const handleLogin = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/Login?username=${userName}&password=${password}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError("Invalid username or password");
        return;
      }

      router.push(`/Pages/CreateBooking?name=${data.name}&staffid=${data.staffid}`);

    } catch (err) {
      console.error("Login failed:", err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-panel-dark  text-white shadow-md w-full max-w-sm space-y-4 text-center p-8">
        <h1  className="panel-large-text" >Company Name Login</h1>
        <input className="textfield" placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)} />
        <input className="textfield" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} 
          onKeyDown={(e) => e.key === "Enter" && handleLogin()} />

        <h2>{errorLabel}</h2>
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