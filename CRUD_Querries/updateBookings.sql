-- Checking In/Out guests
DO $$
DECLARE
    bid INT;
BEGIN
    -- Pick a reserved booking
    SELECT bookingid INTO bid FROM Booking
    WHERE status = 'Reserved' AND checkedin = FALSE LIMIT 1;

    RAISE NOTICE 'Using bookingid: %', bid;

    -- Check in
    UPDATE Booking SET checkedin = TRUE, status = 'Paid'
    WHERE bookingid = bid AND checkedin = FALSE;

    -- Check out
    UPDATE Booking SET checkedout = TRUE
    WHERE bookingid = bid AND checkedin = TRUE AND checkedout = FALSE;
END $$;