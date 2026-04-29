--To Set up the Database--

-Go to file setup.sh and fill in postegre credentials

 cd DataGenandPop 

-Set up a virtual envirmoent 

python3  -m venv venv    (if error python3 -m venv venv --without-pip)

-enter virtual env

source venv/bin/activate

chmod +x setup.sh

./setup.sh

pip install requirements.txt or equivalent




cd hotelsystem

npm build run

npm run dev

