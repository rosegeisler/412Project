"use client";
import SearchButton from "../../../components/SearchButton";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams  } from "next/navigation";
import Panel from "../../../components/Panel";
import { Suspense } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

type Booking = {
  BookingID: number;
  GuestName: string;
  RoomNumber: string;
  StartDate: string;
  EndDate: string;
  Ready: boolean;
  Status: "Reserved" | "Paid" | "Canceled";
  HousekeeperName: string | null;
};

type SortKey =
  | "BookingID"
  | "GuestName"
  | "RoomNumber"
  | "StartDate"
  | "EndDate"
  | "Ready"
  | "Status"
  | "HousekeeperName";

type SortDir = "asc" | "desc";
function ManageBookings() {
  const router = useRouter();
  const [guestNameFilter, setGuestNameFilter] = useState("");
  const [roomNumberFilter, setRoomNumberFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [missingHousekeeperOnly, setMissingHousekeeperOnly] = useState(false);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("BookingID");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [errorLabel, setError] = useState("");

  const searchParams = useSearchParams();
  const name = searchParams.get('name')

  const handleSearch = useCallback(async () => {
    try {
      setError("");
      setBookings([]);

      const params = new URLSearchParams();
      if (guestNameFilter) params.append("guestName", guestNameFilter);
      if (roomNumberFilter) params.append("roomNumber", roomNumberFilter);
      if (dateFilter) params.append("date", dateFilter);
      if (missingHousekeeperOnly) params.append("missingHousekeeper", "true");

      const res = await fetch(
        `${API_BASE}/ManageBookings/Search?${params.toString()}`
      );
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to load bookings");
    }
  }, [guestNameFilter, roomNumberFilter, dateFilter, missingHousekeeperOnly]);

  // load on first render only
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    if (sortKey === "BookingID") {
      cmp = (av as number) - (bv as number);
    } else if (sortKey === "StartDate" || sortKey === "EndDate") {
      // sort date YYY-MM-DD
      cmp = String(av).localeCompare(String(bv));
    } else if (sortKey === "Ready") {
      // not-ready first when ascending
      cmp = Number(av) - Number(bv);
    } else if (sortKey === "HousekeeperName") {
      // unassigned (null) goes first regardless of direction
      if (av == null && bv == null) cmp = 0;
      else if (av == null) cmp = -1;
      else if (bv == null) cmp = 1;
      else cmp = String(av).localeCompare(String(bv));
    } else {
      // GuestName, RoomNumber, Status are plain string compare
      cmp = String(av).localeCompare(String(bv));
    }

    if (cmp === 0 && sortKey !== "BookingID") {
      cmp = a.BookingID - b.BookingID;
    }

    return sortDir === "asc" ? cmp : -cmp;
  });

  const markComplete = async (bookingID: number) => {
    try {
      const res = await fetch(
        `${API_BASE}/ManageBookings/MarkReady?bookingID=${bookingID}`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error("Failed");
      setBookings((prev) =>
        prev.map((b) =>
          b.BookingID === bookingID ? { ...b, Ready: true } : b
        )
      );
    } catch (err) {
      console.error("Mark complete failed:", err);
    }
  };

  const markPaid = async (bookingID: number) => {
    try {
      const res = await fetch(
        `${API_BASE}/ManageBookings/MarkPaid?bookingID=${bookingID}`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error("Failed");
      setBookings((prev) =>
        prev.map((b) =>
          b.BookingID === bookingID ? { ...b, Status: "Paid" } : b
        )
      );
    } catch (err) {
      console.error("Mark paid failed:", err);
    }
  };

  const removeHousekeeper = async (bookingID: number) => {
    if (!window.confirm("Remove housekeeper from this booking?")) return;
    try {
      const res = await fetch(
        `${API_BASE}/ManageBookings/RemoveHousekeeper?bookingID=${bookingID}`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error("Failed");
      setBookings((prev) =>
        prev.map((b) =>
          b.BookingID === bookingID ? { ...b, HousekeeperName: null } : b
        )
      );
    } catch (err) {
      console.error("Remove housekeeper failed:", err);
    }
  };

  return (
    <Panel>
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="textfield flex-1 min-w-[180px]"
            placeholder="Guest Name Filter"
            value={guestNameFilter}
            onChange={(e) => setGuestNameFilter(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <input
            className="textfield flex-1 min-w-[160px]"
            placeholder="Room Number"
            value={roomNumberFilter}
            onChange={(e) => setRoomNumberFilter(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <input
            type="date"
            className="textfield w-44"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <label className="flex items-center gap-2 text-white text-sm">
            <input
              type="checkbox"
              className="w-5 h-5"
              checked={missingHousekeeperOnly}
              onChange={(e) => setMissingHousekeeperOnly(e.target.checked)}
            />
            Limit to missing Housekeeper
          </label>
          <SearchButton onClick={handleSearch} />
        </div>
        <div className="table-div-style">
            <table className="table-style">
              <thead>
                <tr className="text-white whitespace-nowrap">
                  <th className="p-2">
                    <button
                      onClick={() => toggleSort("BookingID")}
                      className="btn w-fit px-3 py-1"
                    >
                      BookingID {arrow("BookingID")}
                    </button>
                  </th>
                  <th className="p-2">
                    <button
                      onClick={() => toggleSort("GuestName")}
                      className="btn w-fit px-3 py-1"
                    >
                      Guest {arrow("GuestName")}
                    </button>
                  </th>
                  <th className="p-2">
                    <button
                      onClick={() => toggleSort("RoomNumber")}
                      className="btn w-fit px-3 py-1"
                    >
                      Room {arrow("RoomNumber")}
                    </button>
                  </th>
                  <th className="p-2">
                    <button
                      onClick={() => toggleSort("StartDate")}
                      className="btn w-fit px-3 py-1"
                    >
                      Check In {arrow("StartDate")}
                    </button>
                  </th>
                  <th className="p-2">
                    <button
                      onClick={() => toggleSort("EndDate")}
                      className="btn w-fit px-3 py-1"
                    >
                      Check Out {arrow("EndDate")}
                    </button>
                  </th>
                  <th className="p-2">
                    <button
                      onClick={() => toggleSort("Ready")}
                      className="btn w-fit px-3 py-1"
                    >
                      Ready {arrow("Ready")}
                    </button>
                  </th>
                  <th className="p-2">
                    <button
                      onClick={() => toggleSort("Status")}
                      className="btn w-fit px-3 py-1"
                    >
                      Status {arrow("Status")}
                    </button>
                  </th>
                  <th className="p-2">
                    <button
                      onClick={() => toggleSort("HousekeeperName")}
                      className="btn w-fit px-3 py-1"
                    >
                      House Keeper {arrow("HousekeeperName")}
                    </button>
                  </th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {sortedBookings.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-4 text-center text-gray-400">
                      No bookings to show. Use the filters above and search.
                    </td>
                  </tr>
                )}
                {sortedBookings.map((b, index) => (
                  <tr
                    key={b.BookingID}
                    className={
                      index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
                    }
                  >
                    <td className="p-2">{b.BookingID}</td>
                    <td className="p-2">{b.GuestName}</td>
                    <td className="p-2">{b.RoomNumber}</td>
                    <td className="p-2">{b.StartDate}</td>
                    <td className="p-2">{b.EndDate}</td>

                    {/* ready or not */}
                    <td className="p-2">
                      {b.Ready ? (
                        <span className="text-green-400">Ready</span>
                      ) : (
                        <button
                          className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-3 py-1 text-sm transition"
                          onClick={() => markComplete(b.BookingID)}
                        >
                          Mark Complete
                        </button>
                      )}
                    </td>

                    {/* pay button if reserved, status text otherwise */}
                    <td className="p-2">
                      {b.Status === "Reserved" ? (
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white rounded-full px-3 py-1 text-sm transition"
                          onClick={() => markPaid(b.BookingID)}
                        >
                          Pay
                        </button>
                      ) : (
                        <span>{b.Status}</span>
                      )}
                    </td>

                    {/* housekeeper column */}
                    <td className="p-2">
                      {b.HousekeeperName ? (
                        <span className="inline-flex items-center gap-8 bg-gray-700 rounded-full px-3 py-1 text-sm">
                          {b.HousekeeperName}
                          <button
                            onClick={() => removeHousekeeper(b.BookingID)}
                            className="text-gray-300 hover:text-white"
                            aria-label="Remove housekeeper"
                            title="Remove housekeeper"
                          >
                              ×
                          </button>
                        </span>
                      ) : (
                        <span className="text-gray-400">Unassigned</span>
                      )}
                    </td>

                    <td className="p-2">
                      <button
                        className={
                          b.HousekeeperName
                            ? "bg-teal-500 hover:bg-teal-600 text-white rounded-full px-3 py-1 text-sm transition"
                            : "bg-red-600 hover:bg-red-700 text-white rounded-full px-3 py-1 text-sm transition"
                        }
                        onClick={() =>
                          router.push(
                            `/Pages/ManageBookings/AssignHousekeeper?bookingID=${b.BookingID}&name=${name}`
                          )
                        }
                      >
                        {b.HousekeeperName ? "Reassign" : "Add"}
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          {errorLabel && <h1 className="text-red-400 mt-2">{errorLabel}</h1>}
      </Panel>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ManageBookings/>
    </Suspense>
  );
}