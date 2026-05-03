from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from datetime import datetime

app = Flask(__name__)
CORS(app)

conn = psycopg2.connect(
    dbname="myhotel",
    user="",
    password="",
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


@app.route("/Login")
def Login():
    userName = request.args.get("username", "").strip()
    password = request.args.get("password", "").strip()

    cur = conn.cursor()
    cur.execute("""
        SELECT f.staffid, s."name"
        FROM FrontWorker f
        JOIN Staff s ON f.staffid = s.staffid
        WHERE f.username = %s AND f.password = %s
    """, (userName, password))
    row = cur.fetchone()

    if row is None:
        return jsonify({"error": "Invalid credentials"}), 401
    return jsonify({"name": row[1]}), 200

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
    return jsonify({"ok": True})
    

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

@app.route("/ManageBookings/Search", methods=["GET"])
def ManageBookingsSearch():
    guestName = request.args.get("guestName", "").strip()
    roomNumber = request.args.get("roomNumber", "").strip()
    date = request.args.get("date", "").strip()
    missingHousekeeper = request.args.get("missingHousekeeper", "").strip().lower() == "true"

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

@app.route("/ManageBookings/AvailableHousekeepers", methods=["GET"])
def ManageBookingsAvailableHousekeepers():
    bookingID = request.args.get("bookingID", "").strip()
    if not bookingID:
        return jsonify({"error": "bookingID required"}), 400

    query = """
        SELECT
            s.StaffID,
            s.Name,
            COUNT(b2.BookingID) FILTER (WHERE b2.Ready = FALSE) AS CurrentAssignments
        FROM Booking b
        JOIN Housekeeper h ON
            CASE EXTRACT(DOW FROM b.StartDate)::INT
                WHEN 0 THEN h.SunAvail
                WHEN 1 THEN h.MonAvail
                WHEN 2 THEN h.TuesAvail
                WHEN 3 THEN h.WedAvail
                WHEN 4 THEN h.ThursdAvail
                WHEN 5 THEN h.FriAvail
                WHEN 6 THEN h.SatAvail
            END = TRUE
        JOIN Staff s ON s.StaffID = h.StaffID
        LEFT JOIN Booking b2 ON b2.Housekeeper = s.StaffID
        WHERE b.BookingID = %s
        GROUP BY s.StaffID, s.Name
        ORDER BY s.Name;
    """
    cur.execute(query, (bookingID,))
    rows = cur.fetchall()
    return jsonify([
        {"StaffID": r[0], "Name": r[1], "CurrentAssignments": r[2]}
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


@app.route("/Guests", methods=["GET"])
def ViewGuests():
    conn.rollback()
    textEntry = request.args.get("textEntry", "").strip()
  

    if textEntry:
        query = """
            SELECT 
                g.GuestID,
                g.GuestName,
                g.LoyaltyMember,
                COUNT(b.BookingID) AS TotalBookings,
                COUNT(CASE WHEN b.EndDate < CURRENT_DATE THEN 1 END) AS PassedBookings,
                COUNT(CASE WHEN b.StartDate > CURRENT_DATE THEN 1 END) AS UpcomingBookings,
                MIN(CASE WHEN b.StartDate > CURRENT_DATE THEN b.StartDate END) AS NextBooking,
                g.PhoneNumber
            FROM Guest g
            LEFT JOIN Booking b ON g.GuestID = b.GuestID
            WHERE g.GuestName ILIKE %s
            GROUP BY g.GuestID, g.GuestName, g.PhoneNumber, g.LoyaltyMember
            ORDER BY NextBooking ASC;
        """
        cur.execute(query, (f"%{textEntry}%",))
    else:
        query = """
            SELECT
                g.GuestID, 
                g.GuestName,
                g.LoyaltyMember,
                COUNT(b.BookingID) AS TotalBookings,
                COUNT(CASE WHEN b.EndDate < CURRENT_DATE THEN 1 END) AS PassedBookings,
                COUNT(CASE WHEN b.StartDate > CURRENT_DATE THEN 1 END) AS UpcomingBookings,
                MIN(CASE WHEN b.StartDate > CURRENT_DATE THEN b.StartDate END) AS NextBooking,
                g.PhoneNumber
            FROM Guest g
            LEFT JOIN Booking b ON g.GuestID = b.GuestID
            GROUP BY g.GuestID, g.GuestName, g.PhoneNumber, g.LoyaltyMember
            ORDER BY NextBooking ASC;

        """
        cur.execute(query)

    rows = cur.fetchall()

    return jsonify([
        {
            "GuestID": r[0],
            "GuestName": r[1],
            "LoyaltyMember": r[2],
            "TotalBookings": r[3],
            "PassedBookings": r[4],
            "UpcomingBookings": r[5],
            "NextBooking": r[6].strftime("%Y-%m-%d") if r[6] else None,
            "PhoneNumber": r[7],
            
        }
        for r in rows
    ])

@app.route("/Guests/Delete", methods=["DELETE"])
def DeleteGuest():
    guestId = request.args.get("guestID", "").strip()

    cur.execute("DELETE FROM Booking WHERE GuestID = %s;", (guestId,))
    cur.execute("DELETE FROM Guest WHERE GuestID = %s;", (guestId,))
    conn.commit()

    return jsonify({ "success": True })


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
         {"WHERE " + " AND ".join(where) if where else ""}
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


@app.route("/CheckIn/CheckInGuest")
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

    conn.commit()

    return jsonify({
        "ok": True
    })





if __name__ == "__main__":
    app.run(debug=True)

conn.commit()
cur.close()
conn.close()