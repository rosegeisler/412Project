"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const bookingDates = () => {
    //TODO: Create a Guest, get the new guest's guestID pass to next routes
    router.push('/Pages/CreateBooking/BookingDates')
  };

return (
    <div className="min-h-screen flex items-center justify-center">
    <div className="w-full max-w-md space-y-4 text-center">
        <h1>New Booking- New Guest</h1>
        <input className="textfield" placeholder="Guest Name" />
        <div className="flex">
            <label> Phone Number</label>
            <input className="textfield" placeholder="(***)" />
            <input className="textfield" placeholder="***" />
            <input className="textfield" placeholder="****" />
        </div>
        <input className="textfield" placeholder="Age" />
        <input type="checkbox" value="no"/>
        <label> Start Loyalty Membership </label>
        
        <button 
            className="btn"
            onClick={bookingDates}>
            Next
        </button>
    </div>
    </div>
);
}