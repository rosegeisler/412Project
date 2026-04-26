from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)



conn = psycopg2.connect(
    dbname="dbname",
    user="ur_user",
    password="ur_pw",
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


@app.route("/CreateBooking")
def CreateBooking():
    roomID = ""
    startDate = ""
    endDate = ""
    guestId = ""
    checkedIn = False
    checkedOut = False
    ready = False


    query = """
        INSERT INTO Booking (RoomID, StartDate, EndDate, GuestID, CheckedIn, CheckedOut, Ready)
        VALUES (%s, %s, %s, %s); 
    """

    cur.execute(query, (roomID, startDate, endDate, guestId, checkedIn, checkedOut, ready))
    

@app.route("/CreateNewGuest")
def NewGuest():
    guestName = ""
    phoneNumber = ""
    age = ""
    loyalty = ""


    query = """
        INSERT INTO Guest (GuestName, PhoneNumber, Age, LoyaltyMember)
        VALUES (%s, %s, %s, %s); 
    """

    cur.execute(query, (guestName, phoneNumber, age, loyalty))

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