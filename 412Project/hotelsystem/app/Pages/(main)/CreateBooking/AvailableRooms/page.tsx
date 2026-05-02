import { Suspense } from "react";
import AvailableRoomsContent from "./AvailableRoomsContent";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AvailableRoomsContent/>
    </Suspense>
  );
}