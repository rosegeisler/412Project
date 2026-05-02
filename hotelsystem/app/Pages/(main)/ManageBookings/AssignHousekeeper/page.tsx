"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Panel from "../../../../components/Panel";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

type Housekeeper = {
  StaffID: number;
  Name: string;
  CurrentAssignments?: number;
};

type SortKey = "StaffID" | "Name" | "CurrentAssignments";
type SortDir = "asc" | "desc";

export default function AssignHousekeeperPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingID = searchParams.get("bookingID");

  const [housekeepers, setHousekeepers] = useState<Housekeeper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState<number | null>(null);

  const [sortKey, setSortKey] = useState<SortKey>("CurrentAssignments");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    const loadHousekeepers = async () => {
      try {
        const res = await fetch(`${API_BASE}/ManageBookings/Housekeepers`);
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setHousekeepers(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load housekeepers");
      } finally {
        setLoading(false);
      }
    };
    loadHousekeepers();
  }, []);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedHousekeepers = [...housekeepers].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "Name") {
      cmp = a.Name.localeCompare(b.Name);
    } else {
      cmp = (a[sortKey] as number) - (b[sortKey] as number);
      // tie-breaker alphabetical by name
      if (cmp === 0) cmp = a.Name.localeCompare(b.Name);
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  const arrow = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? "▲" : "▼") : "↕";

  const handleAssign = async (staffID: number) => {
    if (!bookingID) return;
    setSubmitting(staffID);
    try {
      const res = await fetch(
        `${API_BASE}/ManageBookings/AssignHousekeeper?bookingID=${bookingID}&staffID=${staffID}`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error("Failed");
      router.push("/Pages/ManageBookings");
    } catch (err) {
      console.error(err);
      setError("Failed to assign housekeeper");
      setSubmitting(null);
    }
  };

  if (!bookingID) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Missing booking ID.
      </div>
    );
  }

  return (
    <Panel>
        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl font-semibold">
            Assign Housekeeper to Booking #{bookingID}
          </h1>
          <button
            className="btn"
            onClick={() => router.push("/Pages/ManageBookings")}
          >
            Cancel
          </button>
        </div>
          {loading && (
            <p className="text-gray-300 p-4 text-center">Loading housekeepers...</p>
          )}
          {error && <p className="text-red-400 p-2">{error}</p>}

          {!loading && housekeepers.length === 0 && !error && (
            <p className="text-gray-400 p-4 text-center">
              No housekeepers available.
            </p>
          )}

          {!loading && housekeepers.length > 0 && (
          <div className="table-div-style" >
            <table className="table-style">
              <thead>
              <tr className="text-white whitespace-nowrap">
                  <th className="p-2">
                    <button
                      onClick={() => toggleSort("StaffID")}
                      className="btn w-fit px-3 py-1"
                    >
                      Staff ID {arrow("StaffID")}
                    </button>
                  </th>
                  <th className="p-2">
                    <button
                      onClick={() => toggleSort("Name")}
                      className="btn w-fit px-3 py-1"
                    >
                      Name {arrow("Name")}
                    </button>
                  </th>
                  <th className="p-2">
                    <button
                      onClick={() => toggleSort("CurrentAssignments")}
                      className="btn w-fit px-3 py-1"
                    >
                      Current Load {arrow("CurrentAssignments")}
                    </button>
                  </th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                  {sortedHousekeepers.map((h, i) => (
                      <tr
                        key={h.StaffID}
                        className={i % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}
                      >
                        <td className="p-2">{h.StaffID}</td>
                        <td className="p-2">{h.Name}</td>
                        <td className="p-2">{h.CurrentAssignments ?? 0}</td>
                        <td className="p-2">
                          <button
                            className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-3 py-1 text-sm transition disabled:opacity-50"
                            disabled={submitting !== null}
                            onClick={() => handleAssign(h.StaffID)}
                          >
                            {submitting === h.StaffID ? "Assigning..." : "Select"}
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
            </div>
          )}
      </Panel>
  );
}