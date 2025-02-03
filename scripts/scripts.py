import pandas as pd
import json
from my_utils import *

data = read_json(r'F:\tensorflow\test.routes.json')[['sourceCoords', 'destCoords', 'stopPoints']]

warehouse = list(data['sourceCoords'])
warehouse = warehouse[0]
warehouse = [warehouse['latitude'], warehouse['longitude']]

destination = list(data['destCoords'])
destination = destination[0]
destination = [destination['latitude'], destination['longitude']]

points = list(data['stopPoints'])
points = points[0]
dataframe = pd.DataFrame(points).drop(columns= ['_id'])
dataframe.columns = ['Lat', 'Lon']

clustered_df = cluster_data(dataframe, warehouse)

data_clustered = seperate_n_cluster(clustered_df)

route_for_each_clusters = route_for_clusters(data_clustered, warehouse)

print(json.dumps(route_for_each_clusters))





