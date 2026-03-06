# collecting the data and saving it to a csv file

import csv

# format each row as a list [number, name, etc]
# save the data to a csv file called results.csv
def save_data_to_csv(data):
    with open('results.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(data)

def delete_last_row_from_csv():
    with open('results.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        rows = list(reader)

    if rows:
        rows.pop()  # Remove the last row

    with open('results.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerows(rows)

