"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Panel from "../../../../components/Panel";

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
        `http://127.0.0.1:5000/CreateNewGuest?guestName=${guestName}&phoneNumber=${phoneNumber}&age=${age}&loyalty=${loyalty}`
      );
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

    createGuest()

    router.push('/Pages/CreateBooking/BookingDates')
  };

return (
  <Panel>
    <div className="min-h-screen flex items-center justify-center">
      <div className=" w-full max-w-md space-y-4 text-center">

          <h1>New Booking- New Guest</h1>
          <input className="textfield" placeholder="Guest Name" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
          <input type="tel" className="textfield" value={phoneNumber} 
          onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" />
          <input className="textfield" placeholder="Age" value={age} onChange={(e)=> setAge(e.target.value)} />
          <input type="checkbox" value={loyalty} onChange={(e) => setLoyalty(e.target.value)}/>
          <label> Start Loyalty Membership </label>
          <h2>{errorLabel}</h2>
          <button 
              className="btn"
              onClick={bookingDates}>
              Next
          </button>
      </div>
    </div>
  </Panel>
);
}