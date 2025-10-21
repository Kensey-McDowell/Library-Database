from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector  # Library mentioned in your report

# --- Database Configuration (UPDATE THESE VALUES) ---
DB_CONFIG = {
    'user': 'root',
    'password': 'password',
    'host': '127.0.0.1',  # Or your MySQL server IP
    'database': 'project'  # Replace with your database name
}

# --- Flask App Setup ---
app = Flask(__name__)

# Configure CORS to allow requests from your React development server
# IMPORTANT: React usually runs on port 3000
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})


def get_books_from_db():
    """Fetches all book data from the MySQL database."""
    books_list = []

    try:
        # Connect to the MySQL database
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)  # Use dictionary=True for JSON-friendly output

        # Execute the query to get all books from the 'Book' table
        cursor.execute("SELECT * FROM Book")

        # Fetch all results
        books_list = cursor.fetchall()

    except mysql.connector.Error as err:
        # Handle connection or query errors
        print(f"Error: {err}")
        # In a real app, you would log this and return a 500 error response
        books_list = []

    finally:
        # Close the connection and cursor
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

    return books_list


@app.route('/api/books', methods=['GET'])
def get_books_api():
    """API Endpoint to serve the list of books to the frontend."""
    books = get_books_from_db()

    # Flask automatically converts the Python list/dict to a JSON response
    return jsonify({"books": books})


if __name__ == '__main__':
    # Flask usually runs on port 5000, separating it from the React port 3000
    app.run(debug=True, port=5000)
