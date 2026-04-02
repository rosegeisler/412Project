# Run: python3 staff.py > staff_inserts.sql
import random
from datetime import date, timedelta

random.seed(42)

first_names = [
    "Anna", "Ethan", "Maria", "James", "Emma", "Liam", "Aisha", "Mei",
    "Ines", "Luis", "Fatima", "Ahmed", "Sofia", "Carlos", "Priya",
    "Noah", "Raj", "Wei", "Elena", "Kenji", "Hana", "Tyler", "Zara",
    "Omar", "Sarah", "David", "Yuki", "Marcus"
]

last_names = [
    "Patel", "Rivera", "Johnson", "Anderson", "Lopez", "Kim", "Brown",
    "Chen", "Thomas", "Smith", "Garcia", "Jackson", "Martinez", "Nguyen",
    "Singh", "Davis", "Wilson", "Harris", "Moore", "Clark", "Lewis",
    "White", "Hall", "Young", "Taylor", "Hernandez", "Williams", "Lee"
]

def generate_phone():
    return f"480-{random.randint(100,999)}-{random.randint(1000,9999)}"

def generate_availability():
    base = date(2026, 4, 1)
    all_days = [base + timedelta(days=i) for i in range(7)]
    count = random.randint(3, 7)
    chosen = sorted(random.sample(all_days, count))
    return chosen

def dates_to_pg_array(dates):
    inner = ",".join(f"'{d}'" for d in dates)
    return f"ARRAY[{inner}]::DATE[]"

# build 28 staff: 20 housekeepers (id 1-20) + 8 front workers (id 21-28)
staff = []
for i in range(28):
    staff.append({
        "id": i + 1,
        "name": f"{first_names[i]} {last_names[i]}",
        "phone": generate_phone(),
        "buildingid": 1,
    })

housekeepers = staff[:20]
frontworkers = staff[20:]

print("-- Staff inserts")
for s in staff:
    print(
        f"INSERT INTO Staff (staffid, name, phonenumber, buildingid) "
        f"VALUES ({s['id']}, '{s['name']}', '{s['phone']}', {s['buildingid']});"
    )

print("\n-- Housekeeper inserts")
for s in housekeepers:
    avail = generate_availability()
    print(
        f"INSERT INTO Housekeeper (staffid, availability) "
        f"VALUES ({s['id']}, {dates_to_pg_array(avail)});"
    )

print("\n-- FrontWorker inserts")
for s in frontworkers:
    uname = (s["name"].split()[0][0] + s["name"].split()[1]).lower()
    fake_hash = f"$2b$12${''.join(random.choices('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k=22))}"
    print(
        f"INSERT INTO FrontWorker (staffid, username, password) "
        f"VALUES ({s['id']}, '{uname}', '{fake_hash}');"
    )

print(f"\n-- Total: {len(staff)} staff ({len(housekeepers)} housekeepers, {len(frontworkers)} front workers)")