"use client";
import { useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import Panel from "../../../../components/Panel";
import { useSearchParams } from 'next/navigation'

function BookingDatesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const guestID = searchParams.get('GuestID')

    const [checkInDate, setCheckIn] = useState("");
    const [checkOutDate, setCheckOut] = useState("");
    const [errorLabel, setError] = useState("");

    const seeRooms = () => {
        if (!checkInDate || !checkOutDate) {
            setError("Please select both dates");
            return;
        }

        if (checkInDate >= checkOutDate) {
            setError("Check-in must be before check-out");
            return;
        }
        console.log("TEST")
        console.log(guestID)
        router.push(`/Pages/CreateBooking/AvailableRooms?CheckIn=${checkInDate}&CheckOut=${checkOutDate}&GuestID=${guestID}`);
    };

    const getTomorrow = () => {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        return today.toISOString().split("T")[0];
    };

    const getToday = () => {
        return new Date().toISOString().split("T")[0];
    };

    return (
        <Panel>
            <div className="text-white flex flex-col flex-1">
                <div className="flex justify-between">
                    <h1  className="text-2xl pb-8" >New Booking- Select Dates</h1>
                </div>
                <div className="flex gap-3 pb-8">
                    <label> Check In Date: </label>
                    <input 
                        type="date"
                        value={checkInDate}
                        min={getToday()} 
                        onChange={(e) => setCheckIn(e.target.value)}>
                    </input>
                </div>

                <div className="flex gap-3">
                    <label> Check Out Date: </label>
                    <input     
                        type="date"
                        value={checkOutDate}
                        min={getTomorrow()}
                        onChange={(e) => setCheckOut(e.target.value)}>
                    </input>
                </div>

                <h1>{errorLabel}</h1>

                <div className="flex justify-end mt-auto">
                    <button 
                        className="btn w-fit px-6"
                        onClick={seeRooms}>
                        Next
                    </button>
                </div>
            </div>
        </Panel>
    );
}

export default function Home() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BookingDatesContent />
        </Suspense>
    );
}