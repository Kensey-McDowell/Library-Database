from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector  

DB_CONFIG = {
    'user': 'root',
    'password': 'password',
    'host': '127.0.0.1',  
    'database': 'project'  
}

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})


def get_books_from_db():
    """Fetches all book data from the MySQL database."""
    books_list = []

    try:
        # Connect to the MySQL database
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)  

        # Execute the query to get all books from the 'Book' table
        cursor.execute("SELECT * FROM Book")

        # Fetch all results
        books_list = cursor.fetchall()

    except mysql.connector.Error as err:
        # Handle connection or query errors
        print(f"Error: {err}")
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

    return jsonify({"books": books})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
