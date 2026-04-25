DROP TABLE IF EXISTS Location CASCADE;
DROP TABLE IF EXISTS Room CASCADE;
DROP TABLE IF EXISTS Guest CASCADE;
DROP TABLE IF EXISTS Booking CASCADE;

CREATE TYPE STATUS AS ENUM ('Reserved', 'Paid', 'Canceled');

CREATE Table Guest (
	GuestID INT PRIMARY KEY, 
	GuestName TEXT NOT NULL,
	PhoneNumber BIGINT NOT NULL UNIQUE,
	Age SMALLINT CHECK (Age >= 18),
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
	Price SMALLINT NOT NULL check(Price > 0),
	BedCount SMALLINT NOT NULL check(BedCount > 0),
	RoomType TEXT NOT NULL,
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


CREATE TABLE Staff (
    staffid       INTEGER PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    phonenumber   VARCHAR(15) NOT NULL,
    buildingid    INTEGER NOT NULL REFERENCES Location(buildingid)
);

CREATE TABLE Housekeeper (
    staffid       INTEGER PRIMARY KEY REFERENCES Staff(staffid) ON DELETE CASCADE,
    availability  DATE[] DEFAULT '{}'
);

CREATE TABLE HousekeeperBooking (
    staffid       INTEGER NOT NULL REFERENCES Housekeeper(staffid) ON DELETE CASCADE,
    bookingid     INTEGER NOT NULL REFERENCES Booking(bookingid) ON DELETE CASCADE,
    PRIMARY KEY (staffid, bookingid)
);

CREATE TABLE FrontWorker (
    staffid       INTEGER PRIMARY KEY REFERENCES Staff(staffid) ON DELETE CASCADE,
    username      VARCHAR(50) UNIQUE NOT NULL,
    password      VARCHAR(255) NOT NULL
);



