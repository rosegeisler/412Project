-- Staff inserts
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (1, 'Anna Patel', '480-754-2824', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (2, 'Ethan Rivera', '480-125-5506', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (3, 'Maria Johnson', '480-350-4657', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (4, 'James Anderson', '480-242-2679', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (5, 'Emma Lopez', '480-792-9935', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (6, 'Liam Kim', '480-189-7912', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (7, 'Aisha Brown', '480-132-1488', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (8, 'Mei Chen', '480-195-4582', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (9, 'Ines Thomas', '480-338-9279', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (10, 'Luis Smith', '480-716-1434', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (11, 'Fatima Garcia', '480-674-4257', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (12, 'Ahmed Jackson', '480-833-9928', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (13, 'Sofia Martinez', '480-529-4611', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (14, 'Carlos Nguyen', '480-559-5557', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (15, 'Priya Singh', '480-928-1106', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (16, 'Noah Davis', '480-877-3615', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (17, 'Raj Wilson', '480-814-7924', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (18, 'Wei Harris', '480-448-5552', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (19, 'Elena Moore', '480-259-4527', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (20, 'Kenji Clark', '480-881-6514', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (21, 'Hana Lewis', '480-204-2519', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (22, 'Tyler White', '480-489-2584', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (23, 'Zara Hall', '480-467-6635', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (24, 'Omar Young', '480-718-5333', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (25, 'Sarah Taylor', '480-926-1711', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (26, 'David Hernandez', '480-847-8527', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (27, 'Yuki Williams', '480-649-3045', 1);
INSERT INTO Staff (staffid, name, phonenumber, buildingid) VALUES (28, 'Marcus Lee', '480-487-2291', 1);

-- Housekeeper inserts
INSERT INTO Housekeeper (staffid, availability) VALUES (1, ARRAY['2026-04-01','2026-04-02','2026-04-03','2026-04-04','2026-04-05','2026-04-06','2026-04-07']::DATE[]);
INSERT INTO Housekeeper (staffid, availability) VALUES (2, ARRAY['2026-04-02','2026-04-03','2026-04-06']::DATE[]);
INSERT INTO Housekeeper (staffid, availability) VALUES (3, ARRAY['2026-04-01','2026-04-02','2026-04-07']::DATE[]);
INSERT INTO Housekeeper (staffid, availability) VALUES (4, ARRAY['2026-04-02','2026-04-03','2026-04-04','2026-04-05','2026-04-06','2026-04-07']::DATE[]);
INSERT INTO Housekeeper (staffid, availability) VALUES (5, ARRAY['2026-04-01','2026-04-02','2026-04-03','2026-04-06']::DATE[]);
INSERT INTO Housekeeper (staffid, availability) VALUES (6, ARRAY['2026-04-01','2026-04-02','2026-04-03','2026-04-04','2026-04-05','2026-04-06','2026-04-07']::DATE[]);
INSERT INTO Housekeeper (staffid, availability) VALUES (7, ARRAY['2026-04-01','2026-04-02','2026-04-05','2026-04-06','2026-04-07']::DATE[]);
INSERT INTO Housekeeper (staffid, availability) VALUES (8, ARRAY['2026-04-01','2026-04-02','2026-04-03','2026-04-05','2026-04-06','2026-04-07']::DATE[]);
INSERT INTO Housekeeper (staffid, availability) VALUES (9, ARRAY['2026-04-01','2026-04-02','2026-04-03','2026-04-04','2026-04-06','2026-04-07']::DATE[]);
INSERT INTO Housekeeper (staffid, availability) VALUES (10, ARRAY['2026-04-01','2026-04-02','2026-04-03','2026-04-04','2026-04-05','2026-04-06','2026-04-07']::DATE[]);
INSERT INTO Housekeeper (staffid, availability) VALUES (11, ARRAY['2026-04-01','2026-04-02','2026-04-04','2026-04-05']::DATE[]);
INSERT INTO Housekeeper (staffid, availability) VALUES (12, ARRAY['2026-04-01','2026-04-02','2026-04-07']::DATE[]);
INSERT INTO Housekeeper (staffid, availability) VALUES (13, ARRAY['2026-04-01','2026-04-04','2026-04-06','2026-04-07']::DATE[]);
INSERT INTO Housekeeper (staffid, availability) VALUES (14, ARRAY['2026-04-01','2026-04-03','2026-04-04','2026-04-05','2026-04-06','2026-04-07']::DATE[]);
INSERT INTO Housekeeper (staffid, availability) VALUES (15, ARRAY['2026-04-03','2026-04-05','2026-04-06']::DATE[]);
INSERT INTO Housekeeper (staffid, availability) VALUES (16, ARRAY['2026-04-01','2026-04-02','2026-04-03','2026-04-04','2026-04-05']::DATE[]);
INSERT INTO Housekeeper (staffid, availability) VALUES (17, ARRAY['2026-04-03','2026-04-06','2026-04-07']::DATE[]);
INSERT INTO Housekeeper (staffid, availability) VALUES (18, ARRAY['2026-04-01','2026-04-02','2026-04-03','2026-04-04','2026-04-05','2026-04-06','2026-04-07']::DATE[]);
INSERT INTO Housekeeper (staffid, availability) VALUES (19, ARRAY['2026-04-01','2026-04-02','2026-04-03','2026-04-05']::DATE[]);
INSERT INTO Housekeeper (staffid, availability) VALUES (20, ARRAY['2026-04-01','2026-04-02','2026-04-03','2026-04-04','2026-04-05','2026-04-06','2026-04-07']::DATE[]);

-- FrontWorker inserts
INSERT INTO FrontWorker (staffid, username, password) VALUES (21, 'hlewis', '$2b$12$d26fEeVVhDIq2AnHTmt9OB');
INSERT INTO FrontWorker (staffid, username, password) VALUES (22, 'twhite', '$2b$12$GhnuKoneNo41eoPni6JDWY');
INSERT INTO FrontWorker (staffid, username, password) VALUES (23, 'zhall', '$2b$12$lgAACTP9gyv1plBArp5B1I');
INSERT INTO FrontWorker (staffid, username, password) VALUES (24, 'oyoung', '$2b$12$d9Z850kEnydx9qWCA79ISj');
INSERT INTO FrontWorker (staffid, username, password) VALUES (25, 'staylor', '$2b$12$s8JHUdKF0j7elKPoh3pKMz');
INSERT INTO FrontWorker (staffid, username, password) VALUES (26, 'dhernandez', '$2b$12$KG5mSoyPstUeC99enq522w');
INSERT INTO FrontWorker (staffid, username, password) VALUES (27, 'ywilliams', '$2b$12$jZRL9OaYsP6ihgIqLSmNqE');
INSERT INTO FrontWorker (staffid, username, password) VALUES (28, 'mlee', '$2b$12$40fAraVNqTIAae24HZKjht');

-- Total: 28 staff (20 housekeepers, 8 front workers)
