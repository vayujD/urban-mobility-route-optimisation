import numpy as np
from geopy.distance import geodesic
import random


def calculate_distance_matrix(points, warehouse):
    '''
    This function calculates the distance matrix for the given delivery points
    points: DataFrame(Only Latitude and Longitude), warehouse: 2D array of warehouse coordinates
    Returns -----> distance_matrix
    '''
    n = len(points)
    dist_matrix = np.zeros((n + 1, n + 1))
    for i in range(n):
        dist_matrix[0][i + 1] = geodesic(warehouse, points[i]).km
        dist_matrix[i + 1][0] = dist_matrix[0][i + 1]
        for j in range(n):
            dist_matrix[i + 1][j + 1] = geodesic(points[i], points[j]).km
    return dist_matrix


def calculate_route_distance(route, distance_matrix):
    '''
    This function calculates the distance of the given route for the given delivery points
    and is used in fitness function
    route: route in the calculated route matrix, distance_matrix: distance matrix from calculate_distance_matrix
    Return ------> total_distance
    '''
    total_distance = 0
    current_location = 0  # Start at the warehouse
    for destination in route:
        total_distance += distance_matrix[current_location][destination + 1]
        current_location = destination + 1
    total_distance += distance_matrix[current_location][0]  # Return to warehouse
    return total_distance


def random_route(num_destinations):
    '''
    This function generates random routes
    num_destinations: Total number of delivery points
    Returns ----> random route matrix
    '''
    route = list(range(num_destinations))
    random.shuffle(route)
    return route


def generate_population(size, num_destinations):
    '''
    This function generates random population for genetic algorithm
    size: size of the population, num_destinations: Total number of delivery points
    Returns: randomly generated population
    '''
    return [random_route(num_destinations) for _ in range(size)]


def select_parents(population, fitnesses):
    '''
    Using tournament selection this function selects parents
    population: randomly generated population, fitnesses: integer value
    Returns ----> selected parent
    '''
    selected = random.choices(population, weights=fitnesses, k=2)
    return selected


def crossover(parent1, parent2):
    '''
    This function crossover two parents in ordered manner
    Returns ----> child
    '''
    size = len(parent1)
    if size < 2:  # Guard for small size
        return parent1  # No crossover possible, return the parent as-is

    start, end = sorted(random.sample(range(size), 2))
    child = [None] * size
    child[start:end] = parent1[start:end]
    pointer = 0
    for gene in parent2:
        if gene not in child:
            while child[pointer] is not None:
                pointer += 1
            child[pointer] = gene
    return child


def mutate(route, mutation_rate):
    '''
    This function if for mutation in the algorithm
    route: route from the route matrix, mutation_rate: integer value
    Returns: Mutated routes
    '''
    if len(route) < 2:  # Guard for small routes
        return route  # No mutation possible

    if random.random() < mutation_rate:
        i, j = random.sample(range(len(route)), 2)
        route[i], route[j] = route[j], route[i]
    return route


def genetic_algorithm(destinations, generations, population_size, mutation_rate, distance_matrix):
    '''
    This function implements the genetic algorithm
    destinations: np array of Latitude and Longitude, population_size: integer value, mutation_rate: integer value, distance_matrix: distance matrix
    Returns: best_route and best_distance
    '''
    num_destinations = len(destinations)
    population = generate_population(population_size, num_destinations)
    best_route = None
    best_distance = float('inf')

    for generation in range(generations):
        fitnesses = [1 / calculate_route_distance(route, distance_matrix) for route in population]
        new_population = []

        for _ in range(population_size):
            parent1, parent2 = select_parents(population, fitnesses)
            child = crossover(parent1, parent2)
            child = mutate(child, mutation_rate)
            new_population.append(child)

        population = new_population

        # Track the best solution
        for route in population:
            distance = calculate_route_distance(route, distance_matrix)
            if distance < best_distance:
                best_distance = distance
                best_route = route

    return best_route, best_distance