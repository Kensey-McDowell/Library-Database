import csv

import pandas as pd
import mysql.connector
from flask import Flask, jsonify, request
import os

app = Flask(__name__)

# --- Configuration ---
# Your database connection details from your previous code
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "Flick2005",
    "database": "Project"
}

# IMPORTANT: Adjust this to your actual table and CSV file details
BOOK_TABLE = "book"
CSV_FILE_PATH = r"C:\Users\erika\PyCharmMiscProject\test_data.csv"  # <--- REPLACE with the actual path to your CSV file

# Assuming your CSV columns are: title, author, isbn, publication_year
# and match the columns in your MySQL 'books' table.
# You must ensure the order of the columns matches your SQL INSERT statement.
SQL_COLUMNS = "(Title, ISBN, Date_Published)"


# ---------------------

def get_db_connection():
    """Establishes and returns a MySQL connection."""
    return mysql.connector.connect(**DB_CONFIG)


@app.route('/insert_books', methods=['POST'])
def insert_books_from_csv():
    """Reads a local CSV file and bulk-inserts data into the MySQL database."""

    # 1. Validate the CSV file path
    if not os.path.exists(CSV_FILE_PATH):
        return jsonify({"status": "error", "message": f"CSV file not found at: {CSV_FILE_PATH}"}), 400

    conn = None
    cursor = None
    data_list = []
    try:
        # 1. Use Python's built-in 'csv' module for reliable tokenizing
        with open(CSV_FILE_PATH, 'r', encoding='latin-1') as f:
            # Read all lines into a list
            lines = f.readlines()

            if not lines:
                return jsonify({"status": "error", "message": "CSV file is empty."}), 400

            # CRITICAL FIX 1: Manually force the header to split
            # Get the first line, strip whitespace/newline, and split by comma.
            header = lines[0].strip()
            header_line = header.split(",")


            expected_cols = 3
            if len(header_line) != expected_cols:
                # If this fails, the file does NOT use commas OR has an unprintable character
                # other than a standard encoding issue.
                return jsonify({
                    "status": "error",
                    "message": f"Header split failed: Expected {expected_cols} columns, saw {len(header_line)}. The delimiter is NOT a comma, or the file contains unprintable characters on the header line. List: {header_line}"
                }), 400

            # 2. Use csv.reader for the remaining data lines (which handles quoting)
            data_body = lines[1:]
            reader = csv.reader(data_body, delimiter=',', quoting=csv.QUOTE_MINIMAL)

            # 3. Process the data body
            for i, row in enumerate(reader):
                # Ensure the row has the correct number of fields after quoting is applied
                if len(row) != expected_cols:
                    print(f"Warning: Data Row {i + 2} had {len(row)} fields, expected {expected_cols}. Skipping.")
                    continue

                # Clean the data and append
                cleaned_row = [None if x.strip() == '' else x.strip() for x in row]
                data_list.append(cleaned_row)

            # 4. Create the DataFrame using the manually-split header
        df = pd.DataFrame(data_list, columns=header_line)

        # Clean up the ISBN field just in case it was imported as scientific notation
        # (Though the CSV reader often handles this better)
        df['ISBN'] = df['ISBN'].astype(str)

        # Simple data cleaning: Replace NaN values with None, as MySQL
        # requires None for NULL and not the pandas NaN float.
        data_to_insert = df.where(pd.notnull(df), None).values.tolist()

        # 3. Establish database connection
        conn = get_db_connection()
        cursor = conn.cursor()

        # 4. Construct the bulk INSERT query
        # Ensure the number of %s placeholders matches the number of columns in SQL_COLUMNS
        placeholders = ', '.join(['%s'] * len(df.columns))
        sql_insert_query = f"""
            INSERT INTO {BOOK_TABLE} 
            {SQL_COLUMNS} 
            VALUES ({placeholders})
        """

        # 5. Execute the bulk insertion
        cursor.executemany(sql_insert_query, data_to_insert)
        conn.commit()

        row_count = cursor.rowcount

        return jsonify({
            "status": "success",
            "message": f"Successfully inserted {row_count} records into the '{BOOK_TABLE}' table."
        }), 200

    except mysql.connector.Error as db_err:
        # Rollback any changes if an error occurs
        if conn:
            conn.rollback()
        print(f"Database Error: {db_err}")
        return jsonify({"status": "error", "message": f"Database insertion failed: {db_err}"}), 500

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"status": "error", "message": f"An unexpected error occurred: {e}"}), 500

    finally:
        # 6. Close the connection
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


if __name__ == '__main__':
    # Flask runs on port 5000 by default
    app.run(debug=True, use_reloader=False)