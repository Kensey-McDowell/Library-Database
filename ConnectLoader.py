import mysql.connector
import csv
from datetime import datetime

db_config = {
    "host": "localhost",
    "user": "root",
    "password": "#######",
    "database": "project"
}

TABLE_CONFIG = [
    {
        "table_name": "LIBRARY_BRANCH",
        "file_path": "INSERT FILE PATH HERE",
        "columns": ["Name", "Address", "City", "Phone_Number", "Email_Address", "Num_Member", "LIBRARY_BRANCHId"]
    },
    {
        "table_name": "LIBRARY_MEMBER",
        "file_path": "INSERT FILE PATH HERE",
        "columns": ["Name", "Account_Id", "Balance_Due", "Books_Checked", "Age", "Notes", "Member_Local_Branch"]
    },
    {
        "table_name": "LIBRARY_EMPLOYEE",
        "file_path": "INSERT FILE PATH HERE",
        "columns": ["Name", "Department", "Job_Title", "Hire_Date", "Year_Pay", "LIBRARY_EMPLOYEEId",
                    "Employee_Library"]
    },
    # {
    #     "table_name": "BOOK",
    #     "file_path": "INSERT FILE PATH HERE",  # Adjust path as needed
    #     "columns": ["ISBN", "Title", "Author_Lastname", "Author_Firstname", "Date_Published", "Publisher",
    #                 "IsPaperBack", "Page_Count", "Copies_Owned", "BORROWER", "Libraryt"]
    # },
    # {
    #     "table_name": "WAITLIST",
    #     "file_path": "INSERT FILE PATH HERE",
    #     "columns": ["WAITLISTId", "Num_Waitlisted", "Estimated_Time", "Book", "Current_Library", "Current_Ownership"]
    # },
    # {
    #     "table_name": "REVIEW",
    #     "file_path": "INSERT FILE PATH HERE",
    #     "columns": ["REVIEWId", "Review_Rating", "Review_Text", "Reviewer", "Reviewed_Book"]
    # },
]



def load_all_csv_data(connection):
    cursor = connection.cursor()

    INT_FK_COLUMNS = [
        "Account_Id", "Balance_Due", "Books_Checked", "Age", "Member_Local_Branch",
        "LIBRARY_EMPLOYEEId", "Employee_Library", "ISBN", "Page_Count", "Copies_Owned",
        "BORROWER", "Libraryt", "WAITLISTId", "Num_Waitlisted", "Current_Library",
        "Current_Ownership", "REVIEWId", "Review_Rating", "Reviewer", "Reviewed_Book"
    ]
    DATE_COLUMNS = ["Hire_Date", "Estimated_Time"]
    YEAR_COLUMNS = ["Date_Published"]

    for config in TABLE_CONFIG:
        table = config["table_name"]
        path = config["file_path"]
        cols = config["columns"]

        placeholders = ', '.join(['%s'] * len(cols))
        insert_query = f"INSERT INTO {table} ({', '.join(cols)}) VALUES ({placeholders})"

        print(f"\n--- Attempting to load {table} from {path} ---")

        try:
            with open(path, 'r', newline='', encoding='utf-8') as file:
                reader = csv.reader(file)
                next(reader)

                data_to_insert = []
                for row in reader:
                    processed_row = []

                    if len(row) != len(cols):
                        print(
                            f"Skipping row due to column count mismatch in {table}: expected {len(cols)}, got {len(row)}")
                        continue

                    for i, value in enumerate(row):
                        col_name = cols[i]
                        clean_value = value.strip() if value is not None else ''

                        if col_name in INT_FK_COLUMNS:
                            if not clean_value or clean_value.upper() == 'NULL':
                                processed_row.append(None)  
                            else:
                                processed_row.append(clean_value)  

                        elif col_name in YEAR_COLUMNS:
                            year_to_insert = None
                            clean_val_no_space = clean_value.replace(' ', '')

                            if clean_value and "####" not in clean_value:
                                try:
                                    date_obj = datetime.strptime(clean_val_no_space, '%m/%d/%Y').date()
                                    year_to_insert = date_obj.year
                                except ValueError:
                                    try:
                                        date_obj = datetime.strptime(clean_val_no_space, '%Y-%m-%d').date()
                                        year_to_insert = date_obj.year
                                    except ValueError:
                                        try:
                                            date_obj = datetime.strptime(clean_val_no_space, '%m/%d/%y').date()
                                            year_to_insert = date_obj.year
                                        except ValueError:
                                            try:
                                                year_to_insert = int(clean_val_no_space)
                                            except ValueError:
                                                pass  

                            processed_row.append(year_to_insert)

                        elif col_name in DATE_COLUMNS and clean_value:
                            try:
                                processed_row.append(datetime.strptime(clean_value.replace(' ', ''), '%Y-%m-%d').date())
                            except ValueError:
                                processed_row.append(None)  

                        elif col_name == "IsPaperBack" and clean_value:
                            processed_row.append(1 if clean_value.upper() in ('TRUE', '1', 'T') else 0)

                        else:
                            processed_row.append(clean_value if clean_value else None)

                    data_to_insert.append(tuple(processed_row))

                if data_to_insert:
                    cursor.executemany(insert_query, data_to_insert)
                    connection.commit()  
                    print(f"Successfully inserted {len(data_to_insert)} rows into {table}.")
                else:
                    print(f"{path} is empty. Skipping insertion.")

        except FileNotFoundError:
            print(f"Error: CSV file not found at {path}. Please check the file path.")
        except mysql.connector.Error as err:
            connection.rollback() 
            print(f"MySQL Error during insertion into {table}: {err}")
        except Exception as e:
            print(f"An unexpected error occurred while processing {path}: {e}")

    cursor.close()

connection = None
try:
    # Establish the connection
    connection = mysql.connector.connect(**db_config)

    if connection.is_connected():
        print("Successfully connected to the database. Starting data load...")
        # Call the loading function
        load_all_csv_data(connection)
    else:
        print("Failed to connect to the database.")

except mysql.connector.Error as e:
    print(f"Error while connecting to MySQL: {e}")

finally:
    # Close the connection
    if connection is not None and connection.is_connected():
        connection.close()
        print("\nMySQL connection is closed.")