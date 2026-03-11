from flask import Flask, jsonify, request
from flask_cors import CORS
import random
import threading
import pygame
from data_saving import save_data_to_csv

app = Flask(__name__)
CORS(app) #allows REACT front end to take to flask backend

@app.route('/api/questions', methods=['GET']) #GET ask the server to retrieve and send back data
def get_questions():
    """Generates a list of all unique multiplication questions."""
    questions = []
    
    # Loop from 2 to 12 for the first number
    for num1 in range(2, 13):
        # Loop from 'num1' to 12 for the second number.
        # Starting at num1 prevents reverse duplicates (e.g., doing 4x3 when 3x4 exists)
        for num2 in range(num1, 13):
            questions.append({
                "question": f"What is {num1} x {num2}?",
                "answer": str(num1 * num2)
            })
            
    # Shuffle the list so the questions appear in a random order during the game
    random.shuffle(questions)
    
    # This will generate exactly 66 unique questions (from 2x2 up to 12x12)
    return jsonify(questions)#jsonify send it over to the REACT front end 

@app.route('/api/save_result', methods=['POST']) #POST sends to front end to be processed 
def save_result():
    """Saves user accuracy and timing data to CSV."""
    data = request.json
    
    times = data.get('times', [])
    avg_time = sum(times) / len(times) if times else 0
    accuracy = data.get('accuracy', 0)
    
    row = [
        data.get('firstName', 'Unknown'), 
        data.get('lastName', 'Unknown'),
        f"{accuracy}%", 
        f"{avg_time:.2f}s"
    ]
    
    save_data_to_csv(row)
    return jsonify({"status": "Data saved successfully"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)