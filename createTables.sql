DROP TABLE IF EXISTS Location CASCADE;
DROP TABLE IF EXISTS Room CASCADE;

CREATE Table Location (
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