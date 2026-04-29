--To Set up the Database--

-Go to file setup.sh and fill in postegre credentials
-Go to BookingGeneration.py and fill in postgre credentials

 cd DataGenandPop 

-Set up a virtual envirmoent 

python3  -m venv venv    (if error python3 -m venv venv --without-pip)

-enter virtual env

source venv/bin/activate

chmod +x setup.sh

./setup.sh

pip install requirements.txt or equivalent






cd hotelsystem

-Go to ->server-> app.py and fill in postrge credentials

npm build run

npm run dev

