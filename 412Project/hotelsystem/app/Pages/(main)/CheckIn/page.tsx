"use client";

import { useEffect, useState } from "react";

type Booking = {
  BookingID: number;
  GuestName: string;
  RoomNumber: string;
  Ready: boolean;
  Status: string;
};

export default function CheckInPage() {
  const [guestName, setGuestName] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [message, setMessage] = useState("");

  const API_BASE = "http://127.0.0.1:5000";

  const loadBookings = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/CheckIn/Search?guestName=${encodeURIComponent(guestName)}`
      );

      const data = await res.json();
      setBookings(data);
    } catch (error) {
      setMessage("Could not load bookings. Backend may not be running yet.");
    }
  };

  const checkInGuest = async (bookingID: number) => {
    try {
      const res = await fetch(
        `${API_BASE}/CheckIn/CheckInGuest?bookingID=${bookingID}`,
        { method: "POST" }
      );

      if (!res.ok) {
        setMessage("Check in failed.");
        return;
      }

      setMessage(`Booking ${bookingID} checked in successfully.`);
      loadBookings();
    } catch (error) {
      setMessage("Could not check in guest. Backend may not be running yet.");
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Check In</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Guest Name Filter"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          style={{
            padding: "10px",
            width: "250px",
            marginRight: "10px",
          }}
        />

        <button onClick={loadBookings} style={{ padding: "10px 15px" }}>
          Search
        </button>
      </div>

      {message && <p>{message}</p>}

      <table border={1} cellPadding={10} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Guest Name</th>
            <th>Room Number</th>
            <th>Ready</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan={5}>No bookings found.</td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <tr key={booking.BookingID}>
                <td>{booking.GuestName}</td>
                <td>{booking.RoomNumber}</td>
                <td>{booking.Ready ? "Yes" : "No"}</td>
                <td>{booking.Status}</td>
                <td>
                  <button onClick={() => checkInGuest(booking.BookingID)}>
                    Check In
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}