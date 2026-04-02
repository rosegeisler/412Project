\copy Location FROM 'Location.csv' WITH (FORMAT CSV, HEADER);
\copy Room FROM 'Room.csv' WITH (FORMAT CSV, HEADER);
\copy Guest FROM 'Guests.csv' WITH (FORMAT CSV, HEADER);