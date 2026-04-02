DROP TABLE IF EXISTS Location CASCADE;
DROP TABLE IF EXISTS Room CASCADE;
DROP TABLE IF EXISTS Guest CASCADE;
DROP TABLE IF EXISTS Booking CASCADE;

CREATE TYPE STATUS AS ENUM ('Reserved', 'Paid', 'Canceled');

CREATE Table Guest (
	GuestID INT PRIMARY KEY, 
	GuestName TEXT NOT NULL,
	PhoneNumber BIGINT NOT NULL UNIQUE,
	Age SMALLINT CHECK (Age >= 18),	-- We can make it so only 18+ can get a room
	LoyaltyMember BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE Location (
	BuildingID INT PRIMARY KEY,
	Amenities TEXT,
	Address TEXT NOT NULL,
	PhoneNumber VARCHAR(20) NOT NULL,
	LocationName TEXT NOT NULL
);

CREATE Table Room (
	RoomID INT PRIMARY KEY,
	BedCount SMALLINT NOT NULL,
	RoomType TEXT,
	RoomNumber TEXT NOT NULL,
	PetFriendly BOOL NOT NULL,
	Accessible BOOL NOT NULL,
	SmokeFree BOOL NOT NULL,
    BuildingID INT references Location(BuildingID) NOT NULL
);

CREATE TABLE Booking (
	BookingID INT PRIMARY KEY,
	RoomID INT NOT NULL REFERENCES Room (RoomID),
	StartDate DATE NOT NULL, --karen: did not implement the database itself to check for date overlap, just in the data generation python script for now
	EndDate DATE NOT NULL,
	GuestID INT NOT NULL REFERENCES Guest (GuestID),
	CheckedIn BOOLEAN NOT NULL,
	CheckedOut BOOLEAN NOT NULL,
	Ready BOOLEAN NOT NULL,
	Status STATUS NOT NULL DEFAULT 'Reserved'

);



