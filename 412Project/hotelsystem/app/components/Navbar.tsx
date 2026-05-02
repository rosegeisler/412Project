"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 bg-[#050D36] text-white shadow-md">
      <h1 className="font-bold">Building Name - Front Worker Name</h1>
      <div className="space-x-4">
        <Link href="/Pages/CreateBooking">Create Booking</Link>
        <Link href="/Pages/ManageBookings">Manage Bookings</Link>
        <Link href="/Pages/Guests">View Guests</Link>
        <Link href="/Pages/CheckIn">Check In</Link>
        <Link href="/Pages/Login">Log out</Link>
      </div>
    </nav>
  );
}