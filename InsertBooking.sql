INSERT INTO Booking (BookingID, RoomID, GuestID, StartDate, EndDate, CheckedIn, CheckedOut, 
    Ready, Status)
VALUES (
    1001,         -- BookingID  
    3280,         -- RoomID     (reference an existing Room - 3280)
    3084,         -- GuestID    (reference an existing Guest - Brenda James)
    '2026-05-10', -- StartDate  (arrival date)
    '2026-05-22', -- EndDate    (departure date)
    FALSE,        -- CheckedIn  (guest has not yet arrived)
    FALSE,        -- CheckedOut (guest has not yet departed)
    FALSE,        -- Ready      (room not yet prepared by housekeeping)
    'Reserved'    -- Status     (Reserved -> Paid or Canceled before StartDate)
);