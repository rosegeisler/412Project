"use client";
import SearchButton from "../../../components/SearchButton";
import { useState, useEffect } from "react";
import Panel from "../../../components/Panel";

type Guest = {
  GuestID: number;
  GuestName: string;
  PhoneNumber: string;
  LoyaltyMember: boolean;
  TotalBookings: number;
  PassedBookings: number;
  UpcomingBookings: number;
  NextBooking: string | null;
};

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<Guest[]>([]);
  const [selectedGuestId, setSelectedGuestId] = useState<number | null>(null);

  const handleSearch = async () => {
    try {
      setResults([]);
      const res = await fetch(`/api/Guests?textEntry=${searchText}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const handleDelete = async (guestId: number) => {
  try {
    await fetch(`/api/Guests/Delete?guestID=${guestId}`, { method: "DELETE" });
    setResults(results.filter((g) => g.GuestID !== guestId));
  } catch (err) {
    console.error("Delete failed:", err);
  }
};

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div>
      <div className="flex mt-8 mx-auto max-w-5xl px-4">
        <input
          className="textfield flex-1"
          placeholder="Guest Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <SearchButton onClick={handleSearch} />
      </div>

      <Panel>
        <div className="flex justify-between text-white">
          <h1 className="text-2xl">Guests</h1>
        </div>

        <div className="table-div-style">
          <table className="table-style">
            <thead>
              <tr>
                
                <th>Name</th>
                <th>Loyalty</th>
                <th>TotalBookings</th>
                <th>Total Passed Bookings</th>
                <th>Upcoming Bookings</th>
                <th>Next Booking</th>
                <th>Contact</th>
                <th>Delete</th>
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
                      hover:bg-gray-700`}
                  >
                  
                    <td className="p-3">{guest.GuestName}</td>
                    <td className="p-3">{guest.LoyaltyMember ? "Yes" : "No"}</td>
                    <td className="p-3">{guest.TotalBookings}</td>
                    <td className="p-3">{guest.PassedBookings}</td>
                    <td className="p-3">{guest.UpcomingBookings}</td>
                    <td className="p-3">{guest.NextBooking ?? "—"}</td>
                    <td className="p-3">{guest.PhoneNumber}</td>
                    <td className="p-3">
                      <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(guest.GuestID);
                           }}
                            className="btn px-3 py-1 text-sm">
                            Delete
                        </button>
                    </td>


                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}