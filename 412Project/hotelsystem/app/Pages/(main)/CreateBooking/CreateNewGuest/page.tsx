"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Panel from "../../../../components/Panel";


const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function Home() {
  const router = useRouter();
  const [guestName, setGuestName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [age, setAge] = useState("");
  const [loyalty, setLoyalty] = useState("no");
  const [errorLabel, setError] = useState("");

  const createGuest = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/CreateNewGuest?guestName=${guestName}&phoneNumber=${phoneNumber}&age=${age}&loyalty=${loyalty}`
      );
      const data = await res.json();
      const guestId = data.GuestID;
      return guestId;
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const bookingDates = () => {
    //Logic Checks
    if(guestName == "" || phoneNumber == "" || age == ""){
      //Error to user displayed that they are missing required inputs
      setError("Error to user displayed that they are missing required inputs")
      return
    } 
    const numAge = Number(age)
    if(Number.isNaN(numAge)){
      //Error to user age must be a number
      setError("Error to user age must be a number")
      return
    } else if(numAge < 18 || numAge > 130){
      //Error to user invalid age range
      setError("Error to user invalid age range")
      return
    }

    const cleanedPhone = phoneNumber.replaceAll("(", "").replaceAll(")", "").replaceAll("-", "");
    const numPhone = Number(cleanedPhone)
    if(Number.isNaN(numPhone) || (cleanedPhone.length != 10 && cleanedPhone.length != 11)){
      //Error to user invalid phone number
      setError("Error to user invalid phone number")
      return
    } 

    const id = createGuest()

    router.push(`/Pages/CreateBooking/BookingDates?GuestID=${id}`)
  };

return (
  <Panel>
    <div className="flex justify-between ">
      <h1 className="text-2xl text-white">New Booking- New Guest</h1>
    </div>

    <input className="textfield" placeholder="Guest Name" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
    <input type="tel" className="textfield" value={phoneNumber} 
    onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" />
    <input className="textfield" placeholder="Age" value={age} onChange={(e)=> setAge(e.target.value)} />
    
    <div className="flex justify-between">
      <div>
        <input type="checkbox" value={loyalty} onChange={(e) => setLoyalty(e.target.value)}/>
        <label className=" text-white"> Start Loyalty Membership </label>
      </div>
    </div>
    
    <h2>{errorLabel}</h2>

    <div className="flex justify-end">
      <button 
        className="btn"
        onClick={bookingDates}>
        Next
      </button>
    </div>
  </Panel>
);
}