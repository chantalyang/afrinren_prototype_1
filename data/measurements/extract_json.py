import json
jsonFile = open('41_223_156_170.json', 'r')
parsed_json = json.load(jsonFile)
jsonFile.close()


def convert_json(items):
    import json
    return json.dumps({ "type": "FeatureCollection",
                        "features": [ 
                                        {"type": "Feature",
                                         "geometry": { "type": "Point",
                                                       "coordinates": [ feature['lon'],
                                                                        feature['lat']]},
                                         "properties": { key: value 
                                                         for key, value in feature.items()
                                                         if key not in ('lat', 'lon') }
                                         } 
                                     for feature in json.loads(items)
                                    ]
                       })


convert_json("msm_id: 2403255"); 