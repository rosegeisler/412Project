from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from datetime import datetime

app = Flask(__name__)
CORS(app)

conn = psycopg2.connect(
    dbname="myhotel",
    user="ur un",
    password="ur pw",
    host="localhost",
    port="5432"
)

cur = conn.cursor()

@app.route("/")
def home():
    return "Flask server is running"

@app.route("/APICALLNAME")
def APICALLNAME():
    #Do something with the database
    #return the data
    return "Flask server is running"

@app.route("/CreateBooking/FindAvailableRooms")
def FindAvailableRooms():
    checkIn = request.args.get("checkIn", "").strip()
    checkOut = request.args.get("checkOut", "").strip()
    bedCount = request.args.get("bedCount", "").strip()
    petFriendly = request.args.get("petFriendly", "").strip()
    accessible = request.args.get("accessible", "").strip()
    smokeFree = request.args.get("smokeFree", "").strip()

    query = """
        SELECT RoomID, RoomNumber, Price, RoomType, BedCount, PetFriendly, Accessible, SmokeFree
        FROM Room
        WHERE BedCount = %s AND PetFriendly = %s AND Accessible = %s AND SmokeFree = %s 
        AND RoomID NOT IN (
            SELECT RoomID FROM Booking 
            WHERE StartDate < %s AND EndDate > %s
        )
    """

    cur.execute(query, (bedCount, petFriendly, accessible, smokeFree, checkIn, checkOut))
    rows = cur.fetchall()

    return jsonify([
        {
            "RoomID": r[0],
            "RoomNumber": r[1],
            "Price": r[2],
            "RoomType": r[3],
            "BedCount": r[4],
            "PetFriendly": r[5],
            "Accessible": r[6],
            "SmokeFree": r[7],
        }
        for r in rows
    ])


@app.route("/CreateBooking")
def CreateBooking():
    roomID = request.args.get("roomID", "").strip()
    startDate = request.args.get("startDate", "").strip()
    endDate = request.args.get("endDate", "").strip()
    guestId = request.args.get("guestID", "").strip()
    checkedIn = False
    checkedOut = False
    ready = False

    priceQuery = "SELECT Price FROM Room WHERE RoomID = %s;"
    cur.execute(priceQuery, (roomID,))
    room = cur.fetchone()
    pricePerDay = float(room[0])

    start = datetime.strptime(startDate, "%Y-%m-%d")
    end = datetime.strptime(endDate, "%Y-%m-%d")
    numberOfDays = (end - start).days
    totalPrice = pricePerDay * numberOfDays

    query = """
        INSERT INTO Booking (RoomID, StartDate, EndDate, BookingPrice, GuestID, CheckedIn, CheckedOut, Ready)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s); 
    """

    cur.execute(query, (roomID, startDate, endDate, totalPrice, guestId, checkedIn, checkedOut, ready))
    conn.commit()
    

@app.route("/CreateNewGuest")
def NewGuest():
    guestName = request.args.get("guestName", "").strip()
    phoneNumber = request.args.get("phoneNumber", "").strip()
    age = request.args.get("age", "").strip()
    loyalty = request.args.get("loyalty", "").strip()


    query = """
        INSERT INTO Guest (GuestName, PhoneNumber, Age, LoyaltyMember)
        VALUES (%s, %s, %s, %s)
        RETURNING GuestID;
    """

    cur.execute(query, (guestName, phoneNumber, age, loyalty))
    conn.commit()
    guestId = cur.fetchone()[0]
    return jsonify({ "GuestID": guestId })

@app.route("/NewBooking/SelectGuest", methods=["GET"])
def NewBookingSelectGuest():
    textEntry = request.args.get("textEntry", "").strip()

    if not textEntry:
        return jsonify([])

    query = """
        SELECT GuestID, GuestName, PhoneNumber, LoyaltyMember
        FROM Guest
        WHERE GuestName ILIKE %s;
    """

    cur.execute(query, (f"%{textEntry}%",))
    rows = cur.fetchall()

    return jsonify([
        {
            "GuestID": r[0],
            "GuestName": r[1],
            "PhoneNumber": r[2],
            "LoyaltyMember": r[3],
        }
        for r in rows
    ])

if __name__ == "__main__":
    app.run(debug=True)

conn.commit()
cur.close()
conn.close()