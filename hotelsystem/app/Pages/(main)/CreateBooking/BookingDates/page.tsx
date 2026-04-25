

"use client";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const seeRooms = () => {
        router.push("/Pages/CreateBooking/AvailableRooms");
    };
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md space-y-4 text-center">
                <h1>New Booking- Select Dates</h1>
                <div className="flex">
                    <label> Check In Date: </label>
                    <input type="date"></input>
                </div>
                <div className="flex">
                    <label> Check Out Date: </label>
                    <input type="date"></input>
                </div>
                <div className="flex">
                    <button className="btn w-fit px-6">
                        Pay Now
                    </button>
                    <button 
                        className="btn w-fit px-6"
                        onClick={seeRooms}>
                        Next
                    </button>

                </div>
            </div>
        </div>
    );
}