SELECT Booking.*, GuestName FROM Booking NATURAL JOIN Guest
WHERE StartDate = CURRENT_DATE AND CheckedIn = False
ORDER BY GuestName; 