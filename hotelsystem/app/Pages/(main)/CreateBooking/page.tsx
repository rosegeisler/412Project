"use client";
import SearchButton from "../../../components/SearchButton"; 
import { useRouter } from "next/navigation";
import { useState } from "react";
import Panel from "../../../components/Panel";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
 function CreateBookingContent() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<Guest[]>([]);
  const [selectedGuestId, setSelectedGuestId] = useState<number | null>(null);
  const [errorLabel, setError] = useState("");

  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "";
  

  type Guest = {
    GuestID: number;
    GuestName: string;
    PhoneNumber: string;
    LoyaltyMember: boolean;
  };

  const newGuest = () => {
    router.push(`/Pages/CreateBooking/CreateNewGuest?name=${name}`);
  };

  const bookingDates = () => {
    if(!selectedGuestId){
      setError("Must Select guest to proceed.")
      return
    }

    router.push(`/Pages/CreateBooking/BookingDates?GuestID=${selectedGuestId}&name=${name}`)
  };

  const handleSearch = async () => {
    try {
      setResults([]);
      const res = await fetch(
        `${API_BASE}/NewBooking/SelectGuest?textEntry=${searchText}`
      );
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <Panel>
      <div className="flex justify-between text-white">
        <h1 className="text-2xl">New Booking- Guest Selection</h1>
        <button 
          onClick={newGuest}
          className="btn w-fit px-6">
          Create new guest
        </button>
      </div>

      <div  className= "flex ">
        <input
        className="textfield" 
        placeholder="Guest Name"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
        <SearchButton onClick={handleSearch} />
      </div>

      <div className="table-div-style">
        <table className="table-style">
          <thead>
            <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Loyalty</th>
            </tr>
          </thead>

          <tbody>
            {results.map((guest, index) => {
            const isSelected = selectedGuestId === guest.GuestID;
            return (
              <tr
                key={guest.GuestID}
                onClick={() => setSelectedGuestId(guest.GuestID)}
                className={`
                ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}
                ${isSelected ? "bg-gray-700 border white" : ""}
                hover:bg-gray-700`}>
                <td className="p-3">{guest.GuestID}</td>
                <td className="p-3">{guest.GuestName}</td>
                <td className="p-3">{guest.PhoneNumber}</td>
                <td className="p-3">{guest.LoyaltyMember ? "Yes" : "No"}</td>
              </tr>
            );})}
          </tbody>
        </table>
      </div>

      <h2>{errorLabel}</h2>

      <div className="flex justify-end mt-auto">
        <button
        className="btn"
        onClick={bookingDates}>
        Next
        </button>
      </div>
      
    </Panel>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateBookingContent />
    </Suspense>
  );
}