import json
import sys

#usage to make sure correct arguments supplied
if len(sys.argv)!=3:
    print("specify python file, json file to edit and where to get coords\neg: python add_in_coords.py json_file.json coords_file")
    sys.exit(1)

filename = sys.argv[1]  #get filename to which to add coords
newfilename = filename[:-5]+"_coords"+filename[-5:]    #generate new filename
hop_ips = open(sys.argv[2],'r')   #open a file from which to read all the hop ip addresses and coords

with open(filename,'r') as json_data:
    results = json.load(json_data)
    
    for result in results:
        rtt=0
        if result.has_key("lts"):
            del result["lts"]
        if result.has_key("endtime"):
            del result["endtime"]
        if result.has_key("fw"):
            del result["fw"]
        if result.has_key("af"):
            del result["af"]                                    
        for hop in result["result"]:
            if hop["result"].has_key("from"):
                hop_details = hop_ips.readline().split(', ')
                if hop["result"]["from"]==hop_details[0].strip() and len(hop_details)>3:
                    hop["result"]["coordinates"] = [hop_details[7].strip(), hop_details[8].strip()]
            if hop["result"].has_key("rtt"):
                rtt = hop["result"]["rtt"]
        result["latency"] = rtt
                       
hop_ips.close()        
with open(newfilename,'w') as json_data:
    json_data.write(json.dumps(results))
