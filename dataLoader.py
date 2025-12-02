import mysql.connector
import csv
import itertools
from datetime import datetime, date

db_config = {
    "host": "localhost",
    "user": "root",
    "password": "####",
    "database": "project"
}

TABLE_CONFIG = [
    {
        "table_name": "LIBRARY_BRANCH",
        "file_path": "flask/LibraryBranch.csv",
        "columns": ["Name", "Address", "City", "Phone_Number", "Email_Address", "Num_Member", "LIBRARY_BRANCHId"]
    },
    {
        "table_name": "LIBRARY_MEMBER",
        "file_path": "flask/LibraryMember.csv",
        "columns": ["Name", "Account_Id", "Balance_Due", "Books_Checked", "Age", "Notes", "Member_Local_Branch"]
    },
    {
        "table_name": "LIBRARY_EMPLOYEE",
        "file_path": "flask/LibraryEmployee.csv",
        "columns": ["Name", "Department", "Job_Title", "Hire_Date", "Year_Pay",
                    "LIBRARY_EMPLOYEEId", "Employee_Library"]
    },
    {
        "table_name": "BOOK",
        "file_path": "flask/BookData.csv",
        "columns": ["ISBN", "Title", "Author_Lastname", "Author_Firstname",
                    "Date_Published", "Publisher", "IsPaperBack", "Page_Count",
                    "Copies_Owned", "BORROWER", "Book_Library"]
    },
    {
        "table_name": "WAITLIST",
        "file_path": "flask/Waitlist.csv",
        "columns": ["WAITLISTId", "Num_Waitlisted", "Estimated_Time", "Book",
                    "Current_Library", "Current_Ownership"]
    }
]

INT_LIKE = {"int", "tinyint", "smallint", "mediumint", "bigint"}
DATE_LIKE = {"date", "datetime", "timestamp"}
YEAR_LIKE = {"year"}
FLOAT_LIKE = {"float", "double", "decimal"}

def get_table_schema(conn, table_name):
    q = """
    SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE, COLUMN_KEY, EXTRA
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s
    """
    cur = conn.cursor()
    cur.execute(q, (db_config["database"], table_name.lower()))
    rows = cur.fetchall()
    cur.close()

    schema = {}
    for col_name, data_type, char_len, is_nullable, column_key, extra in rows:
        schema[col_name.lower()] = { 
            "data_type": data_type.lower(),
            "char_max_len": char_len,
            "is_nullable": (is_nullable == "YES"),
            "column_key": column_key,
            "extra": extra
        }
    return schema

def parse_int(value):
    if value is None:
        return None
    v = value.strip()
    if v == "" or v.upper() == "NULL":
        return None
    try:
        return int(float(v))
    except Exception:
        return None

def parse_float(value):
    if value is None:
        return None
    v = value.strip()
    if v == "" or v.upper() == "NULL":
        return None
    try:
        return float(v)
    except Exception:
        return None

def parse_date(value):
    if not value or value.strip() == "" or value.strip().upper() == "NULL":
        return None
    v = value.strip()
    for fmt in ("%Y-%m-%d", "%m/%d/%Y", "%m/%d/%y", "%Y"):
        try:
            dt = datetime.strptime(v, fmt)
            return dt.date()
        except ValueError:
            continue
    return None


def prepare_value(table, col_name, raw_value, schema_info, next_id_counters):
    meta = schema_info.get(col_name.lower())
    raw = raw_value.strip() if raw_value else ""

    if meta is None:
        return raw if raw else None

    dtype = meta["data_type"]
    maxlen = meta["char_max_len"]
    is_nullable = meta["is_nullable"]
    is_pk = (meta["column_key"] == "PRI")
    is_auto = "auto_increment" in (meta["extra"] or "").lower()

    if raw == "" or raw.upper() == "NULL":
        if is_pk and not is_nullable and not is_auto:
            key = (table, col_name)
            if key not in next_id_counters:
                next_id_counters[key] = 1
            val = next_id_counters[key]
            next_id_counters[key] += 1
            return val
        return None

    if dtype in INT_LIKE:
        return parse_int(raw)
    if dtype in FLOAT_LIKE:
        return parse_float(raw)
    if dtype in YEAR_LIKE:
        parsed = parse_date(raw)
        return parsed.year if parsed else int(raw) if raw.isdigit() else None
    if dtype in DATE_LIKE:
        parsed = parse_date(raw)
        return parsed if parsed else date(int(raw),1,1) if raw.isdigit() and len(raw)==4 else None
    if dtype == "tinyint" and maxlen == 1:
        if raw.upper() in ("TRUE","T","1","YES","Y"): return 1
        if raw.upper() in ("FALSE","F","0","NO","N"): return 0
        return parse_int(raw)
    if dtype in ("varchar","char","text","mediumtext","longtext"):
        if raw == "": return None
        if maxlen and isinstance(maxlen,int) and len(raw) > maxlen:
            print(f"WARNING: Truncating {table}.{col_name} to {maxlen} chars.")
            return raw[:maxlen]
        return raw

    return raw if raw != "" else None

def load_all_csv_data(connection):
    cursor = connection.cursor()
    print("\n--- Disabling foreign key checks ---")
    cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")

    print("\n--- Truncating all tables ---")
    for config in reversed(TABLE_CONFIG):
        t = config["table_name"]
        try:
            cursor.execute(f"TRUNCATE TABLE {t};")
        except mysql.connector.Error as e:
            print(f"Warning: could not TRUNCATE {t}: {e}")
    connection.commit()
    print("All tables cleared.\n")

    schema_cache = {}
    next_id_counters = {}

    for config in TABLE_CONFIG:
        table = config["table_name"]
        path = config["file_path"]
        cols = config["columns"]

        try:
            schema = get_table_schema(connection, table)
        except Exception as e:
            print(f"Error reading schema for {table}: {e}")
            schema = {}
        schema_cache[table] = schema

        column_list = [f"`{c}`" for c in cols]
        placeholders = ", ".join(["%s"]*len(cols))
        insert_query = f"INSERT INTO {table} ({', '.join(column_list)}) VALUES ({placeholders})"

        print(f"\n--- Loading {table} from {path} ---")

        try:
            with open(path, "r", newline="", encoding="utf-8-sig") as f:
                reader = csv.reader(f)
                try:
                    first_row = next(reader)
                except StopIteration:
                    print(f"No rows in {path}.")
                    continue

                lower_row = [c.strip().lower() for c in first_row]
                lower_cols = [c.strip().lower() for c in cols]
                
                if lower_row == lower_cols:
                    iter_rows = reader
                    start_row_num = 2
                else:
                    iter_rows = itertools.chain([first_row], reader)
                    start_row_num = 1

                row_num = start_row_num
                inserted = 0

                for raw_row in iter_rows:
                    if len(raw_row) != len(cols):
                        print(f"Skipping row {row_num} in {table}: wrong number of columns ({len(raw_row)} != {len(cols)})")
                        row_num += 1
                        continue

                    processed = [prepare_value(table, c, v, schema, next_id_counters) for c,v in zip(cols, raw_row)]
                    
                    try:
                        cursor.execute(insert_query, tuple(processed))
                        inserted += 1
                    except mysql.connector.Error as err:
                        print(f"MySQL error inserting into {table} row {row_num}: {err}. Row: {processed}")
                    row_num += 1

                connection.commit()
                print(f"{inserted} rows inserted into {table}.")

        except FileNotFoundError:
            print(f"ERROR: File not found → {path}")
        except Exception as e:
            print(f"Unexpected error while processing {table}: {e}")

    print("\n--- Re-enabling foreign key checks ---")
    cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
    cursor.close()

connection = None
try:
    connection = mysql.connector.connect(**db_config)
    if connection.is_connected():
        print("Connected to MySQL. Starting import...")
        load_all_csv_data(connection)
    else:
        print("Connection failed.")
except mysql.connector.Error as e:
    print(f"MySQL connection error: {e}")
finally:
    if connection and connection.is_connected():
        connection.close()
        print("MySQL connection closed.")