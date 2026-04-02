import random
import csv

filename = "guests.csv"

first_names = [
    "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Barbara",
    "David", "Susan", "Richard", "Jessica", "Joseph", "Sarah", "Thomas", "Karen", "Charles", "Lisa",
    "Christopher", "Nancy", "Daniel", "Betty", "Matthew", "Margaret", "Anthony", "Sandra", "Mark", "Ashley",
    "Donald", "Dorothy", "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
    "Kenneth", "Carol", "Kevin", "Amanda", "Brian", "Melissa", "George", "Deborah", "Timothy", "Stephanie",
    "Ronald", "Rebecca", "Edward", "Sharon", "Jason", "Laura", "Jeffrey", "Cynthia", "Ryan", "Kathleen",
    "Jacob", "Amy", "Gary", "Angela", "Nicholas", "Shirley", "Eric", "Anna", "Jonathan", "Brenda",
    "Stephen", "Pamela", "Larry", "Emma", "Justin", "Nicole", "Scott", "Helen", "Brandon", "Samantha",
    "Benjamin", "Katherine", "Samuel", "Christine", "Raymond", "Debra", "Gregory", "Rachel", "Frank", "Carolyn",
    "Aisha", "Carlos", "Wei", "Priya", "Fatima", "Liam", "Zoe", "Omar", "Elena", "Diego",
    "Yuki", "Amara", "Tariq", "Mei", "Ivan", "Sofia", "Kwame", "Nadia", "Ravi", "Ingrid"
]

last_names = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
    "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts",
    "Turner", "Phillips", "Evans", "Edwards", "Collins", "Stewart", "Morris", "Murphy", "Cook", "Rogers",
    "Morgan", "Peterson", "Cooper", "Reed", "Bailey", "Bell", "Gomez", "Kelly", "Howard", "Ward",
    "Cox", "Diaz", "Richardson", "Wood", "Watson", "Brooks", "Bennett", "Gray", "James", "Reyes",
    "Cruz", "Hughes", "Price", "Myers", "Long", "Foster", "Sanders", "Ross", "Morales", "Powell",
    "Patel", "Kim", "Chen", "Singh", "Okafor", "Nakamura", "Osei", "Hassan", "Kowalski", "Ivanova"
]

guestIDs = random.sample(range(1000, 5000), 200)
phoneNumbers = random.sample(range(2000000000, 9999999999), 200)

with open(filename, mode='w', newline='') as file:
    writer = csv.writer(file)

    writer.writerow(
        ["GuestID", "GuestName", "PhoneNumber", "Age", "LoyaltyMember"])

    for i in range(200):
        guestID = guestIDs[i]
        guestName = random.choice(first_names) + " " + \
            random.choice(last_names)
        phoneNumber = phoneNumbers[i]
        age = random.randint(18, 80)
        loyaltyMember = random.choice((True, False))

        writer.writerow([guestID, guestName, phoneNumber, age, loyaltyMember])
