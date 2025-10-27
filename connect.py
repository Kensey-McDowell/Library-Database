from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from werkzeug.security import generate_password_hash, check_password_hash

DB_CONFIG = {
    'user': 'root',
    'password': 'password',
    'host': '127.0.0.1',
    'database': 'project'
}

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})


def get_db_connection():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

@app.route('/api/books', methods=['GET'])
def get_books_api():
    books_list = []
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Book")
        books_list = cursor.fetchall()
        cursor.close()
        conn.close()
    return jsonify({"books": books_list})


@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('MemberName')
    email = data.get('Email')
    password = data.get('MemberPass')

    if not all([name, email, password]):
        return jsonify({'error': 'All fields are required'}), 400

    hashed_pass = generate_password_hash(password)

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO LOGIN (MemberName, Email, MemberPass) VALUES (%s, %s, %s)",
            (name, email, hashed_pass)
        )
        conn.commit()
        return jsonify({'message': 'User registered successfully!'}), 201

    except mysql.connector.IntegrityError:
        return jsonify({'error': 'Email already exists'}), 409

    except Exception as e:
        print("Error:", e)
        return jsonify({'error': 'Database error'}), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('Email')
    password = data.get('MemberPass')

    if not all([email, password]):
        return jsonify({'error': 'Email and password required'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM LOGIN WHERE Email = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({'error': 'User not found'}), 404

        if not check_password_hash(user['MemberPass'], password):
            return jsonify({'error': 'Invalid password'}), 401

        return jsonify({'message': 'Login successful', 'user': {'name': user['MemberName'], 'email': user['Email']}})

    except Exception as e:
        print("Error:", e)
        return jsonify({'error': 'Database error'}), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

@app.route('/api/admin/stats', methods=['GET'])
def admin_stats():
    stats = {"books": 0, "users": 0, "branches": 0}
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor()

        # Count books
        cursor.execute("SELECT COUNT(*) FROM BOOK")
        stats["books"] = cursor.fetchone()[0]

        # Count users (LOGIN table)
        cursor.execute("SELECT COUNT(*) FROM LOGIN")
        stats["users"] = cursor.fetchone()[0]

        # Count library branches (LIBRARY_BRANCH table)
        cursor.execute("SELECT COUNT(*) FROM LIBRARY_BRANCH")
        stats["branches"] = cursor.fetchone()[0]

        return jsonify(stats)

    except Exception as e:
        print("Error fetching stats:", e)
        return jsonify({"error": "Failed to fetch stats"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

# --- Run App ---
if __name__ == '__main__':
    app.run(debug=True, port=5000)
