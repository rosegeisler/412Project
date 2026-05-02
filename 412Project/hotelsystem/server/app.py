from datetime import datetime
import psycopg2
from flask_cors import CORS
from flask import Flask, request, jsonify


app = Flask(__name__)
CORS(app)

conn = psycopg2.connect(
    dbname="myhotel",
    user="postgres",
    password="Skylar22!",
    host="localhost",
    port="5432"
)

cur = conn.cursor()


@app.route("/")
def home():
    return "Flask server is running"


@app.route("/APICALLNAME")
def APICALLNAME():
    # Do something with the database
    # return the data
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

    cur.execute(query, (bedCount, petFriendly,
                accessible, smokeFree, checkIn, checkOut))
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

    cur.execute(query, (roomID, startDate, endDate, totalPrice,
                guestId, checkedIn, checkedOut, ready))
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
    return jsonify({"GuestID": guestId})


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


@app.route("/ManageBookings/Search", methods=["GET"])
def ManageBookingsSearch():
    guestName = request.args.get("guestName", "").strip()
    roomNumber = request.args.get("roomNumber", "").strip()
    date = request.args.get("date", "").strip()
    missingHousekeeper = request.args.get(
        "missingHousekeeper", "").strip().lower() == "true"

    where = []
    params = []

    if guestName:
        where.append("g.GuestName ILIKE %s")
        params.append(f"%{guestName}%")
    if roomNumber:
        where.append("r.RoomNumber ILIKE %s")
        params.append(f"%{roomNumber}%")
    if date:
        # Booking is "active" on a date if StartDate <= date <= EndDate
        where.append("%s BETWEEN b.StartDate AND b.EndDate")
        params.append(date)
    if missingHousekeeper:
        where.append("b.Housekeeper IS NULL")

    whereClause = ("WHERE " + " AND ".join(where)) if where else ""

    query = f"""
        SELECT
            b.BookingID,
            g.GuestName,
            r.RoomNumber,
            b.StartDate,
            b.EndDate,
            b.Ready,
            b.Status,
            s.Name AS HousekeeperName
        FROM Booking b
        JOIN Guest g  ON g.GuestID = b.GuestID
        JOIN Room  r  ON r.RoomID  = b.RoomID
        LEFT JOIN Staff s ON s.StaffID = b.Housekeeper
        {whereClause}
        ORDER BY b.BookingID ASC;
    """

    cur.execute(query, tuple(params))
    rows = cur.fetchall()

    return jsonify([
        {
            "BookingID": r[0],
            "GuestName": r[1],
            "RoomNumber": r[2],
            "StartDate": r[3].isoformat() if r[3] else None,
            "EndDate": r[4].isoformat() if r[4] else None,
            "Ready": r[5],
            "Status": r[6],
            "HousekeeperName": r[7],
        }
        for r in rows
    ])


@app.route("/ManageBookings/MarkReady", methods=["POST"])
def ManageBookingsMarkReady():
    bookingID = request.args.get("bookingID", "").strip()
    if not bookingID:
        return jsonify({"error": "bookingID required"}), 400

    cur.execute(
        "UPDATE Booking SET Ready = TRUE WHERE BookingID = %s;",
        (bookingID,),
    )
    conn.commit()
    return jsonify({"ok": True})


@app.route("/ManageBookings/MarkPaid", methods=["POST"])
def ManageBookingsMarkPaid():
    bookingID = request.args.get("bookingID", "").strip()
    if not bookingID:
        return jsonify({"error": "bookingID required"}), 400

    cur.execute(
        "UPDATE Booking SET Status = 'Paid' WHERE BookingID = %s;",
        (bookingID,),
    )
    conn.commit()
    return jsonify({"ok": True})


@app.route("/ManageBookings/AssignHousekeeper", methods=["POST"])
def ManageBookingsAssignHousekeeper():
    bookingID = request.args.get("bookingID", "").strip()
    staffID = request.args.get("staffID", "").strip()
    if not bookingID or not staffID:
        return jsonify({"error": "bookingID and staffID required"}), 400

    cur.execute(
        "UPDATE Booking SET Housekeeper = %s WHERE BookingID = %s;",
        (staffID, bookingID),
    )
    conn.commit()

    cur.execute("SELECT Name FROM Staff WHERE StaffID = %s;", (staffID,))
    row = cur.fetchone()
    return jsonify({"ok": True, "HousekeeperName": row[0] if row else None})


@app.route("/ManageBookings/Housekeepers", methods=["GET"])
def ManageBookingsHousekeepers():
    query = """
        SELECT
            s.StaffID,
            s.Name,
            COUNT(b.BookingID) FILTER (WHERE b.Ready = FALSE) AS CurrentAssignments
        FROM Staff s
        JOIN Housekeeper h ON h.StaffID = s.StaffID
        LEFT JOIN Booking b ON b.Housekeeper = s.StaffID
        GROUP BY s.StaffID, s.Name
        ORDER BY s.Name ASC;
    """
    cur.execute(query)
    rows = cur.fetchall()
    return jsonify([
        {
            "StaffID": r[0],
            "Name": r[1],
            "CurrentAssignments": r[2],
        }
        for r in rows
    ])


@app.route("/ManageBookings/RemoveHousekeeper", methods=["POST"])
def ManageBookingsRemoveHousekeeper():
    bookingID = request.args.get("bookingID", "").strip()
    if not bookingID:
        return jsonify({"error": "bookingID required"}), 400

    cur.execute(
        "UPDATE Booking SET Housekeeper = NULL WHERE BookingID = %s;",
        (bookingID,),
    )
    conn.commit()
    return jsonify({"ok": True})


if __name__ == "__main__":
    app.run(debug=True)


@app.route("/CheckIn/Search", methods=["GET"])
def CheckInSearch():
    guestName = request.args.get("guestName", "").strip()

    where = ["b.CheckedIn = FALSE"]
    params = []

    if guestName:
        where.append("g.GuestName ILIKE %s")
        params.append(f"%{guestName}%")

    query = f"""
        SELECT
            b.BookingID,
            g.GuestName,
            g.PhoneNumber,
            g.LoyaltyMember,
            r.RoomNumber,
            r.RoomType,
            r.BedCount,
            b.Ready,
            b.Status
        FROM Booking b
        JOIN Guest g ON g.GuestID = b.GuestID
        JOIN Room r ON r.RoomID = b.RoomID
        WHERE {" AND ".join(where)}
        ORDER BY b.BookingID ASC;
    """

    cur.execute(query, tuple(params))
    rows = cur.fetchall()

    return jsonify([
        {
            "BookingID": r[0],
            "GuestName": r[1],
            "PhoneNumber": r[2],
            "LoyaltyMember": r[3],
            "RoomNumber": r[4],
            "RoomType": r[5],
            "BedCount": r[6],
            "Ready": r[7],
            "Status": r[8],
        }
        for r in rows
    ])


@app.route("/CheckIn/CheckInGuest", methods=["POST"])
def CheckInGuest():
    bookingID = request.args.get("bookingID", "").strip()

    if not bookingID:
        return jsonify({"error": "bookingID required"}), 400

    cur.execute("""
        UPDATE Booking
        SET CheckedIn = TRUE,
            Status = 'Paid'
        WHERE BookingID = %s
        RETURNING RoomID;
    """, (bookingID,))

    row = cur.fetchone()

    if not row:
        conn.rollback()
        return jsonify({"error": "Booking not found"}), 404

    roomID = row[0]

    cur.execute("""
        UPDATE Room
        SET Ready = FALSE
        WHERE RoomID = %s;
    """, (roomID,))

    conn.commit()

    return jsonify({
        "ok": True,
        "BookingID": bookingID,
        "RoomID": roomID,
        "Status": "Paid",
        "CheckedIn": True,
        "RoomReady": False
    })


@app.route("/test")
def test():
    return "test works"


print(app.url_map)

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
