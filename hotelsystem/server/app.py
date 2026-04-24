from flask import Flask
import psycopg2

app = Flask(__name__)

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

if __name__ == "__main__":
    app.run(debug=True)

conn.commit()
cur.close()
conn.close()