import sys
import time
import pandas as pd 
import json  # Import json for JSON handling
from excel_processor import process_excel
from genetic_algorithm import genetic_algorithm, calculate_fitness

def main(file_path, preferred_lunch):
    t0 = time.time()

    teachers_classes = process_excel(file_path)
    best_schedule = genetic_algorithm(teachers_classes, generations=15000, mutation_chance=0.1, population_size=100, preferred_lunch=preferred_lunch)
    final_fitness_score = calculate_fitness(best_schedule, preferred_lunch)

    schedule_df = pd.DataFrame(best_schedule)

    # Convert the DataFrame to JSON
    schedule_json = schedule_df.to_json(orient='records')

    t1 = time.time()
    #print('Time taken:', t1 - t0, 'seconds')
    #print("Fitness =", final_fitness_score)

    # Return the JSON data so that it can be captured by Node.js
    return schedule_json

if __name__ == "__main__":
    file_path = sys.argv[1]
    preferred_lunch = list(map(int, sys.argv[2].split(',')))
    schedule_json = main(file_path)
    print(schedule_json)  # This will be captured by the Node.js server
