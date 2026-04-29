INSERT INTO Location (BuildingID, Amenities, Address, PhoneNumber, LocationName)
VALUES (
  501,
  'This location includes a rooftop pool, complimentarry breakfast, and a small gym.',
  '8387 W Blueberry Blvd, Chandler AZ',
  '999-999-9999',
  'Happy Hotel'
);

\copy Room FROM 'Room.csv' WITH (FORMAT CSV, HEADER);
\copy Guest FROM 'Guests.csv' WITH (FORMAT CSV, HEADER);