"use client";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function NavbarContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Front Worker";
  const building = searchParams.get("building") || "Hotel";

  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 bg-[#050D36] text-white shadow-md">
      <h1 className="font-bold">{building} - {name}</h1>
      <div className="space-x-4">
        <Link href={`/Pages/CreateBooking?name=${name}&building=${building}`}>Create Booking</Link>
        <Link href={`/Pages/ManageBookings?name=${name}&building=${building}`}>Manage Bookings</Link>
        <Link href={`/Pages/Guests?name=${name}&building=${building}`}>View Guests</Link>
        <Link href={`/Pages/CheckIn?name=${name}&building=${building}`}>Check In</Link>
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