"use client";
import SearchButton from "../../../components/SearchButton"; 
import { useRouter } from "next/navigation";
import { useState } from "react";
import Panel from "../../../components/Panel";


export default function Home() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<Guest[]>([]);
  const [selectedGuestId, setSelectedGuestId] = useState<number | null>(null);

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
    if(!selectedGuestId){
      return
    }

    router.push('/Pages/CreateBooking/BookingDates')
  };

  const handleSearch = async () => {
    try {
      setResults([]);
      const res = await fetch(
        `http://127.0.0.1:5000/NewBooking/SelectGuest?textEntry=${searchText}`
      );
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md space-y-4 text-center">
          <Panel>
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
                <div className="max-h-80 overflow-y-auto mt-4">
                  <table >
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
                              cursor-pointer
                              transition
                              text-gray-200
                              ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}
                              ${isSelected ? "bg-gray-700 border-2 white-500" : ""}
                              hover:bg-gray-700
                            `}
                          >
                            <td className="p-2">{guest.GuestID}</td>
                            <td className="p-2">{guest.GuestName}</td>
                            <td className="p-2">{guest.PhoneNumber}</td>
                            <td className="p-2">{guest.LoyaltyMember ? "Yes" : "No"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  
                  </table>
                </div>
                <button
                  className="btn"
                  onClick={bookingDates}>
                  Next
                </button>
        </Panel>
      </div>
    </div>
  );
}