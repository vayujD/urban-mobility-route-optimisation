import sys
import pandas as pd
import json
from my_utils import *

#data = read_json(r'F:\tensorflow\test.routes.json')[['sourceCoords', 'destCoords', 'stopPoints']]

def route_for_each_cluster(data):
    ## fetch the source coordinates
    warehouse = list(data['sourceCoords'])
    warehouse = warehouse[0]
    warehouse = [warehouse['latitude'], warehouse['longitude']]

    ##fetch the destination coordinates
    destination = list(data['destCoords'])
    destination = destination[0]
    destination = [destination['latitude'], destination['longitude']]

    ##fetch the destination points
    points = list(data['stopPoints'])
    points = points[0]
    dataframe = pd.DataFrame(points).drop(columns= ['_id'])
    dataframe.columns = ['Lat', 'Lon']

    ##clustering the dataframe and augmenting the cluster into the dataframe
    clustered_df = cluster_data(dataframe, warehouse)

    ##splitting the delivery points into respective clusters
    data_clustered = seperate_n_cluster(clustered_df)

    ##generating the route coordinates for each clusters
    route_for_each_clusters = route_for_clusters(data_clustered, warehouse)

    return route_for_each_clusters

if __name__ == '__main__':
    input_data = json.loads(sys.argv[1])
    print('Input data:', input_data)
    output_data = route_for_each_cluster(input_data)
    print('Output data:', output_data)
    print(json.dumps(output_data))





