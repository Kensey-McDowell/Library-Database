from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from werkzeug.security import generate_password_hash, check_password_hash

DB_CONFIG = {
    'user': 'root',
    'password': '######',
    'host': 'localhost',
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
    print("--- 1. /api/books ROUTE HIT ---")
    books_list = []
    conn = get_db_connection()

    if conn:
        print("--- 2. DB Connection SUCCESSFUL ---")
        cursor = None
        try:

            TABLE_NAME = "Book"

            cursor = conn.cursor(dictionary=True)
            cursor.execute(f"SELECT * FROM {TABLE_NAME}")
            books_list = cursor.fetchall()


            if not books_list:
                print(f"--- 3. Query ran, but found 0 rows in table '{TABLE_NAME}'. ---")
            else:
                print(f"--- 3. SUCCESS: Found {len(books_list)} books. Sending to frontend. ---")
                print(f"--- First record keys: {list(books_list[0].keys())}")

        except Exception as e:

            print(f"--- 4. SQL EXECUTION ERROR: {e} ---")
            books_list = []

        finally:
            if cursor:
                cursor.close()
            if conn and conn.is_connected():
                conn.close()

    else:
        print("--- 2. DB Connection FAILED (Check DB Config/Server Status) ---")

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

    conn = get_db_connection()
    if not conn:
        return jsonify({"success": False, "error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM LOGIN WHERE Email=%s", (email,))
        user = cursor.fetchone()

        if user and check_password_hash(user["MemberPass"], password):
            return jsonify({"success": True})
        else:
            return jsonify({"success": False, "error": "Invalid credentials"}), 401

    except Exception as e:
        print("Login error:", e)
        return jsonify({"success": False, "error": "Database error"}), 500

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


@app.route('/api/branch-info/<branch_name>', methods=['GET'])
def get_branch_info_api(branch_name):
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT Name, Address, City, Phone_Number, Email_Address, Num_Member FROM LIBRARY_BRANCH WHERE Name = %s",
            (branch_name,)
        )
        branch_info = cursor.fetchone()

        if branch_info:
            raw_phone = branch_info.get('Phone_Number')

            if raw_phone and isinstance(raw_phone, (str, int)) and len(str(raw_phone)) == 7:
                phone_str = str(raw_phone)

                formatted_phone = f"(615) {phone_str[:3]}-{phone_str[3:]}"

                branch_info['Phone_Number'] = formatted_phone

            return jsonify(branch_info), 200
        else:
            return jsonify({"error": "Branch not found"}), 404
    except Exception as e:
        print(f"Error fetching branch info: {e}")
        return jsonify({"error": "Database query failed"}), 500

    finally:
        if conn and conn.is_connected():
            conn.close()

if __name__ == '__main__':
    app.run(debug=True, port=5001)
