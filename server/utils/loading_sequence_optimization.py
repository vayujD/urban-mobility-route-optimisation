import itertools

# Sample data for items with a stop order
items = [
    {"id": "A", "weight": 10, "volume": 50, "priority": 1, "stop_order": 3},   # Low priority, first stop
    {"id": "B", "weight": 20, "volume": 15, "priority": 3, "stop_order": 1},  # Medium priority, second stop
    {"id": "C", "weight": 15, "volume": 10, "priority": 2, "stop_order": 4},  # Medium-Low priority, third stop
    {"id": "D", "weight": 50, "volume": 30, "priority": 4, "stop_order": 2},  # High priority, fourth stop
]

vehicle = {"max_weight": 100, "max_volume": 200}

# Function to calculate total weight, volume, and priority score
def calculate_load(sequence):
    total_weight = sum(item['weight'] for item in sequence)
    total_volume = sum(item['volume'] for item in sequence)
    priority_score = sum(item['priority'] for item in sequence)  # Sum of priorities
    stop_order_score = sum(item['stop_order'] for item in sequence)  # Sum of stop orders
    return total_weight, total_volume, priority_score, stop_order_score

# Function to optimize the loading sequence
def optimize_loading_balanced(items, vehicle):
    best_sequence = None
    max_score = 0

    # Generate all possible combinations of items (1 to all items)
    for r in range(1, len(items) + 1):
        for combination in itertools.combinations(items, r):
            total_weight, total_volume, priority_score, stop_order_score = calculate_load(combination)

            # Check vehicle capacity constraints
            if total_weight <= vehicle['max_weight'] and total_volume <= vehicle['max_volume']:
                # Normalize the scores
                weight_utilization = total_weight / vehicle['max_weight']
                volume_utilization = total_volume / vehicle['max_volume']
                priority_utilization = priority_score / (len(items) * max(item['priority'] for item in items))
                stop_order_utilization = stop_order_score / (len(items) * max(item['stop_order'] for item in items))

                # Combined score with equal weightage (25% each)
                combined_score = (weight_utilization*0.2) + (volume_utilization*0.2) + (priority_utilization*0.2) + (stop_order_utilization*0.4)

                # Select the sequence with the highest combined score
                if combined_score > max_score:
                    max_score = combined_score
                    best_sequence = combination

    return best_sequence

# Optimize the loading sequence
optimal_sequence = optimize_loading_balanced(items, vehicle)

# Display the optimized loading plan
print("Optimized Loading Sequence (Balanced for Priority, Weight, Volume, and Stop Order):")
if optimal_sequence:
    for item in optimal_sequence:
        print(f"Item {item['id']} - Weight: {item['weight']}, Volume: {item['volume']}, Priority: {item['priority']}, Stop Order: {item['stop_order']}")
else:
    print("No feasible loading sequence found.")
