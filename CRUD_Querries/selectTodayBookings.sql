SELECT Booking.*, GuestName FROM Booking NATURAL JOIN Guest
WHERE StartDate = '2026-10-14' AND CheckedIn = False
ORDER BY GuestName; 