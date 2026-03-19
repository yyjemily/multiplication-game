# backend/data_saving.py
import csv
import os

CSV_FILE = 'results.csv'

def save_data_to_csv(data):
    file_exists = os.path.isfile(CSV_FILE)
    
    with open(CSV_FILE, mode='a', newline='') as file:
        writer = csv.writer(file)
        
        # Write header if file doesn't exist yet
        if not file_exists:
            writer.writerow(['First Name', 'Last Name', 'Shown Numbers', 'User Inputs', 'Is Correct'])
            
        writer.writerow([
            data.get('fname', 'Unknown'),
            data.get('lname', 'Unknown'),
            data.get('numbers', ''),
            data.get('inputs', ''),
            data.get('is_correct', False)
        ])