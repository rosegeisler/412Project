"use client";
import SearchButton from "../../../../components/SearchButton"; 
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const finishBooking = () => {
        //TODO: Add Booking Logic HERE
        router.push("/Pages/CreateBooking/BookingConfirmation");
    };


    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full  space-y-4 text-center">
                <h1>New Booking-- Available Rooms:</h1>
                <div className="flex">
                    <label>Bed Count:</label>
                    <select>
                        <option value="1">1</option>
                        <option value="2">2</option>
                    </select>

                    <label>Room Type:</label>
                    <select>
                        <option value="Standard">Standard</option>
                        <option value="Delux">Delux</option>
                        <option value="Junior Suite">Junior Suite</option>
                        <option value="Suite">Suite</option>
                    </select>

                    <input type="checkbox" value="no"/>
                    <label>Pet Friendly:</label>

                    <input type="checkbox" value="no"/>
                    <label>Smoke Free:</label>
                    
                    <input type="checkbox" value="no"/>
                    <label>Accessible:</label>
                    <SearchButton onClick={() => console.log("Search clicked")} />
                </div>
                <h1>TABLE HERE</h1>
                <button 
                    className="btn w-fit px-6"
                    onClick={finishBooking}>
                    Book
                </button>
            </div>
        </div>
    );
}