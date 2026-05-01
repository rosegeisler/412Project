"use client";
import SearchButton from "../../../../components/SearchButton"; 
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Panel from "../../../../components/Panel";


export default function Home() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const checkIn = searchParams.get('CheckIn')
    const checkOut = searchParams.get('CheckOut')
    const guestID = searchParams.get('GuestID')

    const [bedCount, setBedCount] = useState("1");
    const [roomType, setRoomType] = useState("Standard");
    const [petFriendly, setPetFriendly] = useState(false);
    const [smokeFree, setSmokeFree] = useState(false);
    const [accessible, setAccessible] = useState(false);
    const [results, setResults] = useState<Room[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

    type Room = {
        RoomID: number;
        RoomNumber: string;
        Price: string;
        RoomType: string;
        BedCount: string;
        PetFriendly: boolean;
        Accessible: boolean;
        SmokeFree: boolean;
      };
    
    const createBooking = async () => {
      try {
        const res = await fetch(
          `/api/CreateBooking?roomID=${selectedRoomId}&startDate=${checkIn}&endDate=${checkOut}&guestID=${guestID}`
        );
      } catch (err) {
        console.error("Search failed:", err);
      }
    };



    const finishBooking = () => {
        createBooking()
        router.push("/Pages/CreateBooking/BookingConfirmation");
    };

    const displayAvailableRooms = async () => {
        const petFriendlyParam = petFriendly ? "TRUE" : "FALSE";
        const accessibleParam = accessible ? "TRUE" : "FALSE";
        const smokeFreeParam = smokeFree ? "TRUE" : "FALSE";

        try {
            setResults([]);
            const res = await fetch(
            `/api/CreateBooking/FindAvailableRooms?checkIn=${checkIn}&checkOut=${checkOut}&bedCount=${bedCount}&petFriendly=${petFriendly}&accessible=${accessible}&smokeFree=${smokeFree}`
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
          <h1 className="text-2xl">New Booking- Available Rooms:</h1>
        </div>
          <div className="flex justify-between">
              <label>Bed Count:</label>
              <select value={bedCount}
              onChange={(e) => setBedCount(e.target.value)} >
                  <option value="1">1</option>
                  <option value="2">2</option>
              </select>

              <label>Pet Friendly:</label>
              <input type="checkbox" checked={petFriendly} onChange={(e) => setPetFriendly(e.target.checked)} />

              <label>Smoke Free:</label>
              <input type="checkbox" checked={smokeFree} onChange={(e) => setSmokeFree(e.target.checked)} />

              <label>Accessible:</label>
              <input type="checkbox" checked={accessible} onChange={(e) => setAccessible(e.target.checked)} />
              <SearchButton onClick={displayAvailableRooms} />
          </div>
          
          
          <div className="table-div-style">
            <table className="table-style">
              <thead>
                <tr>
                  <th>Room Number</th>
                  <th>Price</th>
                  <th>Room Type</th>
                  <th>Bed Count</th>
                  <th>Pet Friendly</th>
                  <th>Accessible</th>
                  <th>Smoke Free</th>
                </tr>
              </thead>

              <tbody>
                {results.map((room, index) => {
                  const isSelected = selectedRoomId === room.RoomID;

                  return (
                    <tr
                      key={room.RoomID}
                      onClick={() => setSelectedRoomId(room.RoomID)}
                      className={`
                        ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}
                        ${isSelected ? "bg-gray-700 border white" : ""}
                        hover:bg-gray-700
                      `}
                    >
                      <td className="p-3">{room.RoomNumber}</td>
                      <td className="p-3">$ {room.Price}</td>
                      <td className="p-3">{room.RoomType}</td>
                      <td className="p-3">{room.BedCount}</td>
                      <td className="p-3">{room.PetFriendly ? "Yes" : "No"}</td>
                      <td className="p-3">{room.Accessible ? "Yes" : "No"}</td>
                      <td className="p-3">{room.SmokeFree ? "Yes" : "No"}</td>
                    </tr>
                  );
                })}
              </tbody>
            
            </table>
          </div>
          <div className="flex justify-end">
            <button 
                className="btn w-fit px-6"
                onClick={finishBooking}>
                Book
            </button>
          </div>
      </Panel>
);
}