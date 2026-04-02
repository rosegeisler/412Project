import random
import csv

filename = "Room.csv"
roomIDs = random.sample(range(1000, 5000), 100) 

with open(filename, mode='w', newline='') as file:
    writer = csv.writer(file)
    
    writer.writerow([
        "RoomID", "BedCount", "RoomType", "RoomNumber",
        "PetFriendly", "Accessible", "SmokeFree", "BuildingID"
    ])

    for i in range(100):
        roomID = roomIDs[i]
        bedCount = random.choice((1, 2))
        roomType = random.choice(("Standard", "Delux", "Junier Suite", "Suite"))
        roomNumber = 100 + i
        petFriendly = random.choice((True, False))
        accessible = random.choice((True, False))
        smokeFree = random.choice((True, False))
        buildingID = 501

        writer.writerow([
            roomID, bedCount, roomType, roomNumber,
            petFriendly, accessible, smokeFree, buildingID
        ])