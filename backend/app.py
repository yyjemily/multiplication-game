# backend/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from data_saving import save_data_to_csv

app = Flask(__name__)
CORS(app) # allows REACT front end to talk to flask backend

@app.route('/api/save', methods=['POST'])
def save_data():
    try:
        data = request.json
        save_data_to_csv(data)
        return jsonify({"message": "Memory results saved successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)