from genetic_algorithm_utils import *

def cluster_data(df, warehouse):
    '''
    This function gives clusters on the basis of 4 directions and segment our input dataframe
    df: DataFrame, warehouse: 2D array of warehouse coordinates
    Returns ----> the resulting dataframe with augmented column of cluster values

    '''
    df_new = df.copy()
    df_new['cluster'] = np.zeros(shape=df.shape[0], dtype= "int64")
    for _ in range(df.shape[0]):
        if(df_new['Lat'][_] >= warehouse[0] and df_new['Lon'][_] >= warehouse[1]):
            df_new.loc[_,'cluster'] = 1
        elif(df_new['Lat'][_] < warehouse[0] and df_new['Lon'][_] > warehouse[1]):
            df_new.loc[_,'cluster'] = 2
        elif(df['Lat'][_] <= warehouse[0] and df_new['Lon'][_] <= warehouse[1]):
            df_new.loc[_,'cluster'] = 3
        else:
            df_new.loc[_,'cluster'] = 4
    return df_new


def optimal_path(df, warehouse):
    '''
    This function gives the optimal minimum distance and path required to traverse the given points
    df: DataFrame(Only with Latitude and Longitude), warehouse: 2D array of warehouse coordinates
    Returns -----> Array of best route
    '''
    destinations = np.array(df)
    warehouse = warehouse

    # Parameters for the Genetic Algorithm
    POPULATION_SIZE = 50
    GENERATIONS = 100
    MUTATION_RATE = 0.1

    distance_matrix = calculate_distance_matrix(destinations, warehouse)

    best_route, best_distance = genetic_algorithm(destinations, GENERATIONS, POPULATION_SIZE, MUTATION_RATE, distance_matrix= distance_matrix)

    best_route_coordinates = [destinations[i] for i in best_route]
    
    print(f"Total Distance: {best_distance:.2f} km")

    return best_route_coordinates


def seperate_cluster(df, cluster_value):
    '''
    Splits the data of the dataframe into respective cluster values
    df: cluster augmented dataframe, cluster_value: cluster number
    returns ----> array of delivery points in respective cluster array
    '''
    return list(df[df['cluster'] == cluster_value].drop(columns = ['cluster']))

def seperate_n_cluster(df):
    '''
    Splits the data of the dataframe into 'N' respective cluster values
    df: cluster augmented dataframe
    returns ----> dictionary of delivery points in respective cluster array
    '''
    dict = {}
    for _ in df['cluster'].unique():
        dict[int(_)] = seperate_cluster(df, _)

    return dict

