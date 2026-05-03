import psycopg2
import random
from datetime import datetime, timedelta

conn = psycopg2.connect(
    dbname="myhotel",
    user="",
    password="",
    host="localhost",
    port="5432"
)
cur = conn.cursor()

#get room ids from db
cur.execute("SELECT RoomID FROM Room;")
roomIDs = [row[0] for row in cur.fetchall()]

#get guest ids from db
cur.execute("SELECT GuestID FROM Guest;")
guestIDs = [row[0] for row in cur.fetchall()]

bookingIDs = random.sample(range(1000, 99999), 80)

#track bookings per room to prevent overlap
room_bookings = {roomID: [] for roomID in roomIDs}

#dates range
start_range = datetime(2026, 1, 1)
end_range = datetime(2027, 2, 1)

today = datetime.now()

#generate random date
def random_date(start, end):
    delta = end - start
    return start + timedelta(days=random.randint(0, delta.days))

#help check for date overlaps 
def overlaps(startdate1, enddate1, startdate2, enddate2):
    return startdate1 < enddate2 and startdate2 < enddate1


#insert stuff
for i in range(80):
        bookingID = bookingIDs[i]
        roomID = random.choice(roomIDs)
        guestID = random.choice(guestIDs)

        startDate = random_date(start_range, end_range)
        endDate = startDate + timedelta(days=random.randint(1, 14))

        cur.execute("""
            SELECT Price FROM Room WHERE RoomID = %s;
         """, (roomID,))

        result = cur.fetchone()
        if result is None:
            print("Room not found!")
        else:
            roomCost = result[0]


        numDays = (endDate - startDate).days
        price = numDays * roomCost



        # make sure the same room doesnt overlap w another booking for same date
        conflict = False
        for (s, e) in room_bookings[roomID]:
            if overlaps(startDate, endDate, s, e):
                conflict = True
                break

        if not conflict:
            today = datetime.now()
            room_bookings[roomID].append((startDate, endDate))
            
            #make sure checkin and ready status align with dates
            if endDate < today:
                checkedIn = True
                checkedOut = True
            elif startDate <= today <= endDate:
                checkedIn = True
                checkedOut = False
            else:
                checkedIn = False
                checkedOut = False

            ready = checkedOut

            if startDate > today:
                status = "Reserved"
            else:
                status = "Paid"

            #put random cancellations and make sure checkin status matches
            if status == "Reserved" and random.random() < 0.2:
                status = "Canceled"
                checkedIn = False
                checkedOut = False
           

            #insert
            cur.execute("""
                INSERT INTO Booking (
                    BookingID, RoomID, StartDate, EndDate, BookingPrice,
                    GuestID, CheckedIn, CheckedOut, Ready, Status
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """, (
                bookingID,
                roomID,
                startDate.strftime("%Y-%m-%d"),
                endDate.strftime("%Y-%m-%d"),
                price,
                guestID,
                checkedIn,
                checkedOut,
                ready,
                status
            ))

              

conn.commit()
cur.close()
conn.close()

print("bookings inserted")