SELECT * FROM Booking
WHERE GuestID = 1111
ORDER BY StartDate ASC; 

SELECT Booking.*, GuestName FROM Booking NATURAL JOIN Guest
WHERE StartDate = CURRENT_DATE AND CheckedIn = False
ORDER BY GuestName; 
