"use client";

import SearchButton from "../../../components/SearchButton";
import { useState, useEffect, useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

type Booking = {
  BookingID: number;
  GuestName: string;
  PhoneNumber: string;
  LoyaltyMember: boolean;
  RoomNumber: string;
  RoomType: string;
  BedCount: number;
  Ready: boolean;
  Status: "Reserved" | "Paid" | "Canceled";
};

type SortKey =
  | "BookingID"
  | "GuestName"
  | "RoomNumber"
  | "RoomType"
  | "BedCount"
  | "Ready"
  | "Status";

type SortDir = "asc" | "desc";

export default function Home() {
  const [guestNameFilter, setGuestNameFilter] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("BookingID");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [errorLabel, setError] = useState("");

  const handleSearch = useCallback(async () => {
    try {
      setError("");
      setBookings([]);

      const params = new URLSearchParams();
      if (guestNameFilter) params.append("guestName", guestNameFilter);

      const res = await fetch(`${API_BASE}/CheckIn/Search?${params.toString()}`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to load check-in bookings");
    }
  }, [guestNameFilter]);

  useEffect(() => {
    handleSearch();
  }, []);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const arrow = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? "▲" : "▼") : "↕";

  const sortedBookings = [...bookings].sort((a, b) => {
    let cmp = 0;
    const av = a[sortKey];
    const bv = b[sortKey];

    if (sortKey === "BookingID" || sortKey === "BedCount") {
      cmp = Number(av) - Number(bv);
    } else if (sortKey === "Ready") {
      cmp = Number(av) - Number(bv);
    } else {
      cmp = String(av).localeCompare(String(bv));
    }

    if (cmp === 0 && sortKey !== "BookingID") {
      cmp = a.BookingID - b.BookingID;
    }

    return sortDir === "asc" ? cmp : -cmp;
  });

  const checkInGuest = async (bookingID: number) => {
    try {
      const res = await fetch(
        `${API_BASE}/CheckIn/CheckInGuest?bookingID=${bookingID}`,
        { method: "POST" }
      );

      if (!res.ok) throw new Error("Failed");

      setBookings((prev) =>
        prev.map((b) =>
          b.BookingID === bookingID
            ? { ...b, Status: "Paid", Ready: false }
            : b
        )
      );
    } catch (err) {
      console.error("Check-in failed:", err);
      setError("Failed to check in guest");
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center p-6">
      <div className="w-full max-w-7xl space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="textfield flex-1 min-w-[220px]"
            placeholder="Guest Name Filter"
            value={guestNameFilter}
            onChange={(e) => setGuestNameFilter(e.target.value)}
          />
          <SearchButton onClick={handleSearch} />
        </div>

        <div className="bg-panel-dark p-4 rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-200">
              <thead>
                <tr className="text-white whitespace-nowrap">
                  <th className="p-2">
                    <button onClick={() => toggleSort("BookingID")} className="btn w-fit px-3 py-1">
                      BookingID {arrow("BookingID")}
                    </button>
                  </th>
                  <th className="p-2">
                    <button onClick={() => toggleSort("GuestName")} className="btn w-fit px-3 py-1">
                      Guest {arrow("GuestName")}
                    </button>
                  </th>
                  <th className="p-2">Phone</th>
                  <th className="p-2">Loyalty</th>
                  <th className="p-2">
                    <button onClick={() => toggleSort("RoomNumber")} className="btn w-fit px-3 py-1">
                      Room {arrow("RoomNumber")}
                    </button>
                  </th>
                  <th className="p-2">
                    <button onClick={() => toggleSort("RoomType")} className="btn w-fit px-3 py-1">
                      Type {arrow("RoomType")}
                    </button>
                  </th>
                  <th className="p-2">
                    <button onClick={() => toggleSort("BedCount")} className="btn w-fit px-3 py-1">
                      Beds {arrow("BedCount")}
                    </button>
                  </th>
                  <th className="p-2">
                    <button onClick={() => toggleSort("Ready")} className="btn w-fit px-3 py-1">
                      Ready {arrow("Ready")}
                    </button>
                  </th>
                  <th className="p-2">
                    <button onClick={() => toggleSort("Status")} className="btn w-fit px-3 py-1">
                      Status {arrow("Status")}
                    </button>
                  </th>
                  <th className="p-2"></th>
                </tr>
              </thead>

              <tbody>
                {sortedBookings.length === 0 && (
                  <tr>
                    <td colSpan={10} className="p-4 text-center text-gray-400">
                      No guests to check in. Use the filter above and search.
                    </td>
                  </tr>
                )}

                {sortedBookings.map((b, index) => (
                  <tr
                    key={b.BookingID}
                    className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}
                  >
                    <td className="p-2">{b.BookingID}</td>
                    <td className="p-2">{b.GuestName}</td>
                    <td className="p-2">{b.PhoneNumber}</td>
                    <td className="p-2">{b.LoyaltyMember ? "Yes" : "No"}</td>
                    <td className="p-2">{b.RoomNumber}</td>
                    <td className="p-2">{b.RoomType}</td>
                    <td className="p-2">{b.BedCount}</td>

                    <td className="p-2">
                      {b.Ready ? (
                        <span className="text-green-400">Ready</span>
                      ) : (
                        <span className="text-red-400">Not Ready</span>
                      )}
                    </td>

                    <td className="p-2">
                      {b.Status === "Paid" ? (
                        <span className="text-green-400">Paid</span>
                      ) : (
                        <span>{b.Status}</span>
                      )}
                    </td>

                    <td className="p-2">
                      {b.Status === "Paid" ? (
                        <span className="text-gray-400">Checked In</span>
                      ) : (
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white rounded-full px-3 py-1 text-sm transition"
                          onClick={() => checkInGuest(b.BookingID)}
                        >
                          Check In
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {errorLabel && <h1 className="text-red-400 mt-2">{errorLabel}</h1>}
        </div>
      </div>
    </div>
  );
}