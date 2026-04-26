"use client";
import SearchButton from "../../../components/SearchButton"; 
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<Guest[]>([]);;

  type Guest = {
    GuestID: number;
    GuestName: string;
    PhoneNumber: string;
    LoyaltyMember: boolean;
  };

  const newGuest = () => {
    router.push("/Pages/CreateBooking/CreateNewGuest");
  };

  const bookingDates = () => {
    //TODO: Verify Guest has been selected
    router.push('/Pages/CreateBooking/BookingDates')
  };

  const handleSearch = async () => {
    try {
      setResults([]);
      const res = await fetch(
        `http://127.0.0.1:5000/NewBooking/SelectGuest?textEntry=${searchText}`
      );
      const data: Guest[] = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search failed:", err);
    }
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

        <div  className= "flex">
          <input
            className="textfield" 
            placeholder="Guest Name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)} />
          <SearchButton onClick={handleSearch} />
        </div>
        <h1> TABLE HERE</h1>
        <table className="w-full border mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Loyalty</th>
            </tr>
          </thead>
          <tbody>
            {results.map((guest) => (
              <tr key={guest.GuestID}>
                <td>{guest.GuestID}</td>
                <td>{guest.GuestName}</td>
                <td>{guest.PhoneNumber}</td>
                <td>{guest.LoyaltyMember ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="btn"
          onClick={bookingDates}>
          Next
        </button>
      </div>
    </div>
  );
}