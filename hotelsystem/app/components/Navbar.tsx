"use client";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function NavbarContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Front Worker";

  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 bg-[#050D36] text-white shadow-md">
      <h1 className="font-bold">Building Name - {name}</h1>
      <div className="space-x-4">
        <Link href={`/Pages/CreateBooking?name=${name}`}>Create Booking</Link>
        <Link href={`/Pages/ManageBookings?name=${name}`}>Manage Bookings</Link>
        <Link href={`/Pages/Guests?name=${name}`}>View Guests</Link>
        <Link href={`/Pages/CheckIn?name=${name}`}>Check In</Link>
        <Link href="/Pages/Login">Log out</Link>
      </div>
    </nav>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={
      <nav className="w-full flex justify-between items-center px-6 py-4 bg-[#050D36] text-white shadow-md">
        <h1 className="font-bold">Building Name - Front Worker</h1>
      </nav>
    }>
      <NavbarContent />
    </Suspense>
  );
}