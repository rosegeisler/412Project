#!/bin/bash
set -e

#Configuration variables MOLDIFY for your own
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:- YOUR username}"
DB_PASSWORD="${DB_PASSWORD:- YOUR password}"
PGPASSWORD="$DB_PASSWORD"
export PGPASSWORD

echo "Database Creation..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS myhotel;"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE myhotel;"

echo "Table Creation..."
SQL_TABLES_FILE="createTables.sql"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "myhotel" -f "createTables.sql"


python3 SyntheticDataScripts/roomGeneration.py
python3 SyntheticDataScripts/guestGeneration.py

echo "Wrapping Up Table Population..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "myhotel" -f "populate.sql"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "myhotel" -f "staff_inserts.sql"



python3 SyntheticDataScripts/bookingGeneration.py
unset PGPASSWORD