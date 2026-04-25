import random
import csv

filename = "Room.csv"

with open(filename, mode='w', newline='') as file:
    writer = csv.writer(file)
    
    writer.writerow([
        "RoomID", "Price", "BedCount", "RoomType", "RoomNumber",
        "PetFriendly", "Accessible", "SmokeFree", "BuildingID"
    ])

    for i in range(100):
        roomID = i 
        bedCount = random.choice((1, 2))
        roomType = random.choice(("Standard", "Delux", "Junier Suite", "Suite"))
        price = random.randint(75, 100)
        if roomType == "Standard":
            price *= 1
        elif roomType == "Delux":
            price *= 1.15
        elif roomType == "Junier Suite":
            price *= 1.25
        else: 
            price *= 1.35

        roomNumber = 100 + i
        petFriendly = random.choice((True, False))
        accessible = random.choice((True, False))
        smokeFree = random.choice((True, False))
        buildingID = 501

        writer.writerow([
            roomID, bedCount, roomType, roomNumber,
            petFriendly, accessible, smokeFree, buildingID
        ])