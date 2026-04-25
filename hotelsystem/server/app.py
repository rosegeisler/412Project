from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)



@app.route("/")
def home():
    return "Flask server is running"

@app.route("/APICALLNAME")
def APICALLNAME():
    #Do something with the database
    #return the data
    return "Flask server is running"


if __name__ == "__main__":
    app.run(debug=True)