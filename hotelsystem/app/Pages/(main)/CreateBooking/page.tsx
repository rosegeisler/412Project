"use client";
import SearchButton from "../../../components/SearchButton"; 
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const newGuest = () => {
    router.push("/Pages/CreateBooking/CreateNewGuest");
  };

  const bookingDates = () => {
    //TODO: Verify Guest has been selected
    router.push('/Pages/CreateBooking/BookingDates')
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
    <div className="w-full max-w-md space-y-4 text-center">
      <div className="flex">
        <h1>New Booking- Guest Selection</h1>
        <button 
          onClick={newGuest}
          className="btn w-fit px-6">
          + Create new guest
          
        </button>

      </div>

        <div  className="= flex">
          <input className="textfield" placeholder="Guest Name" />
          <SearchButton onClick={() => console.log("Search clicked")} />
        </div>
        <h1> TABLE HERE</h1>
        <button
          className="btn"
          onClick={bookingDates}>
          Next
        </button>
      </div>
    </div>
  );
}