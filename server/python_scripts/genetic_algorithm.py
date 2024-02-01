import random
import numpy as np
import copy

def initial_population(teachers_dict, population_size):
    population = []
    for _ in range(population_size):
        shuffled_schedules = {teacher: np.random.permutation(classes).tolist() for teacher, classes in teachers_dict.items()}
        population.append(shuffled_schedules)
    return population

#! Rewrite this function to be general
def calculate_fitness(schedule, preferred_lunch):
    fitness = 0
    for teacher, classes in schedule.items():
        # Ensure no class is repeated for a teacher in a day
        if len(classes) == len(set(classes)):
            fitness += 4
        # Increase fitness if lunch is at a specific period
        lunch_period = classes.index('lunch') + 1 if 'lunch' in classes else 0
        if lunch_period in preferred_lunch:
            fitness += 10
        # Increase fitness if 'free' period for park_classes is at the first period
        free_period = classes.index('free') + 1 if 'free' in classes else 0
        if teacher == 'park_classes' and free_period == 1:
            fitness += 3
    # Decrease fitness heavily if 'class6' for park_classes is during the same period as any 'r_chem' for damico_classes
    park_class6_position = schedule['park_classes'].index('class6') if 'class6' in schedule['park_classes'] else -1
    damico_r_chem_positions = [i for i, x in enumerate(schedule['damico_classes']) if x == 'r_chem']
    if park_class6_position != -1 and park_class6_position in damico_r_chem_positions:
        fitness -= 10 

    return fitness
#! -------------------------------------


def crossover(parent1, parent2):
    child = {}
    for teacher in parent1.keys():
        split = random.randint(1, len(parent1[teacher]) - 1)
        child[teacher] = parent1[teacher][:split] + parent2[teacher][split:]
    return child


#* Mutates a schedule by swapping two classes for a teacher
def mutate(schedule, mutation_chance):
    for teacher in schedule.keys():
        if random.random() < mutation_chance:
            idx1, idx2 = np.random.choice(len(schedule[teacher]), 2, replace=False)
            schedule[teacher][idx1], schedule[teacher][idx2] = schedule[teacher][idx2], schedule[teacher][idx1]
    return schedule


def genetic_algorithm(teachers_dict, generations, mutation_chance, population_size, preferred_lunch):
    population = initial_population(teachers_dict, population_size)
    best_fitness = float('-inf')
    best_schedule = None

    for _ in range(generations):
        # Calculate fitness for each individual in the population
        fitness_scores = [calculate_fitness(sched, preferred_lunch) for sched in population]

        # Check for new best solution
        for i, fitness in enumerate(fitness_scores):
            if fitness > best_fitness:
                best_fitness = fitness
                best_schedule = copy.deepcopy(population[i])
        min_fitness = min(fitness_scores)
        if min_fitness < 0:                 # Avoid negative fitness scores by shifting all scores to be non-negative
            fitness_scores = [score - min_fitness for score in fitness_scores]

        # Select parents based on their fitness scores
        total_fitness = sum(fitness_scores)
        if total_fitness == 0:
            # If total fitness is zero, select parents randomly
            parent_indices = np.random.choice(len(population), size=len(population))
        else:
            selection_probs = [f / total_fitness for f in fitness_scores]
            parent_indices = np.random.choice(len(population), size=len(population), p=selection_probs)

        # Create the next generation through crossover and mutation
        next_generation = []
        for i in range(0, len(population), 2):
            parent1, parent2 = population[parent_indices[i]], population[parent_indices[i+1]]
            child1, child2 = crossover(parent1, parent2), crossover(parent2, parent1)
            child1, child2 = mutate(child1, mutation_chance), mutate(child2, mutation_chance)
            next_generation.extend([child1, child2])

        population = next_generation

    return best_schedule
