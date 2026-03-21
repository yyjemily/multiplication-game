import csv
import os

CSV_FILE = 'results.csv'

def save_data_to_csv(data):
    file_exists = os.path.isfile(CSV_FILE)
    
    with open(CSV_FILE, mode='a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        
        if not file_exists:
            # --- NEW: Changed 'Program' to 'Major' in the headers ---
            writer.writerow([
                'First Name', 'Last Name', 'Age', 'School', 'Major', 'Gender', 'Location', 
                'Shown Numbers', 'User Inputs', 'Score', 'Accuracy %', 
                'Round 1 (s)', 'Round 2 (s)', 'Round 3 (s)', 'Round 4 (s)', 'Round 5 (s)', 
                'Total Time (s)', 'Notes'
            ])
            
        accuracy_count = data.get('accuracy', 0)
        total_possible = data.get('total_possible', 50)
        
        if total_possible > 0:
            accuracy_percentage = f"{int((accuracy_count / total_possible) * 100)}%"
        else:
            accuracy_percentage = "0%"
            
        total_time = data.get('total_time', 0.0)
        formatted_time = f"{float(total_time):.2f}"

        round_times = data.get('round_times', [])
        padded_times = [f"{float(t):.2f}" for t in (round_times + [0]*5)[:5]]
            
        writer.writerow([
            data.get('fname', 'Unknown'),
            data.get('lname', 'Unknown'),
            data.get('age', 'Unknown'),
            data.get('school', 'Unknown'),
            data.get('major', 'Unknown'), 
            data.get('gender', 'Unknown'),
            data.get('location', 'Unknown'),
            data.get('numbers', ''),
            data.get('inputs', ''),
            f"{accuracy_count}/{total_possible}",
            accuracy_percentage,
            padded_times[0], 
            padded_times[1], 
            padded_times[2], 
            padded_times[3], 
            padded_times[4],
            formatted_time,
            data.get('notes', '')
        ])