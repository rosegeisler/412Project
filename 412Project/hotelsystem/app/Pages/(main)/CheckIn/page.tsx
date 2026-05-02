"use client";

import { useEffect, useState } from "react";
import SearchButton from "../../../components/SearchButton";
import Panel from "../../../components/Panel";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

type Booking = {
  BookingID: number;
  GuestName: string;
  PhoneNumber: string;
  LoyaltyMember: boolean;
  RoomID: number;
  RoomNumber: string;
  RoomType: string;
  BedCount: number;
  Ready: boolean;
  Status: string;
};

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<Booking[]>([]);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    try {
      setMessage("");
      const res = await fetch(
        `${API_BASE}/CheckIn/Search?guestName=${encodeURIComponent(searchText)}`
      );

      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search failed:", err);
      setMessage("Could not load check-in results.");
    }
  };

  const handleCheckIn = async (bookingID: number) => {
    try {
      setMessage("");

      const res = await fetch(
        `${API_BASE}/CheckIn/CheckInGuest?bookingID=${bookingID}`,
        { method: "POST" }
      );

      if (!res.ok) {
        setMessage("Check in failed.");
        return;
      }

      setMessage(`Booking ${bookingID} checked in successfully.`);
      handleSearch();
    } catch (err) {
      console.error("Check in failed:", err);
      setMessage("Could not check in guest.");
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <Panel>
      <div className="flex justify-between text-white">
        <h1 className="text-2xl">Check In</h1>
      </div>

      <div className="flex">
        <input
          className="textfield"
          placeholder="Guest Name Filter"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <SearchButton onClick={handleSearch} />
      </div>

      <div className="table-div-style">
        <table className="table-style">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Guest</th>
              <th>Phone</th>
              <th>Loyalty</th>
              <th>Room</th>
              <th>Type</th>
              <th>Beds</th>
              <th>Ready</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {results.map((booking, index) => (
              <tr
                key={booking.BookingID}
                className={`
                  ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}
                  hover:bg-gray-700
                `}
              >
                <td className="p-3">{booking.BookingID}</td>
                <td className="p-3">{booking.GuestName}</td>
                <td className="p-3">{booking.PhoneNumber}</td>
                <td className="p-3">
                  {booking.LoyaltyMember ? "Yes" : "No"}
                </td>
                <td className="p-3">{booking.RoomNumber}</td>
                <td className="p-3">{booking.RoomType}</td>
                <td className="p-3">{booking.BedCount}</td>
                <td className="p-3">{booking.Ready ? "Yes" : "No"}</td>
                <td className="p-3">{booking.Status}</td>
                <td className="p-3">
                  <button
                    className="btn"
                    disabled={booking.Status === "Paid"}
                    onClick={() => handleCheckIn(booking.BookingID)}
                  >
                    {booking.Status === "Paid" ? "Checked In" : "Check In"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {results.length === 0 && (
        <h2 className="text-white">No bookings found.</h2>
      )}

      {message && <h2 className="text-white">{message}</h2>}
    </Panel>
  );
}