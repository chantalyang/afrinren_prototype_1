import json
import sys
if len(sys.argv)!=2:
    print("specify python file and json file to edit\neg: python agregate_results.py json_file.json")
    sys.exit(1)

filename = sys.argv[1]
newfilename = filename[:-5]+"_NEW"+filename[-5:]

with open(filename,'r') as json_data:
    results = json.load(json_data)
    total_rtt = 0.0
    num_rtt = 0.0
    num_error = 0
    num_x = 0
    num_late = 0
    unknown = 0
#    count=0
    print("FromIP \t\t\t Success \t Errors \t Late \t Average RTT")
    for result in results:
        for hop in result["result"]:
            for packet in hop["result"]:
                if packet.has_key("from"):
                    fromIP=packet["from"]
                if packet.has_key("rtt"):
                    total_rtt += packet["rtt"]
                    num_rtt += 1
                elif packet.has_key("error"):
                    num_error += 1                    
                elif packet.has_key("x") :
                    num_x += 1
                elif packet.has_key("late"):
                    num_late += 1
                else:
                    unknown+=1
                    #json_data.close()
                    print(packet)
                    print(unknown)
                    #raise Exception("Result has no field rtt and not field error")
            if (num_rtt>0):
                #for packet in hop["result"]:
#                    if count==0:
                hop["result"]={"from":fromIP,"rtt":total_rtt/num_rtt}
                 
                        #packet["from"]=fromIP
                        #packet["rtt"]=total_rtt/num_rtt
#                        json_data.seek(0)
                        #json_data.truncate()
 #                       count += 1
#                    else:
 #                       del packet
                #count=0
                print("%s \t %i \t\t %i \t\t %i \t %f" % (fromIP, num_rtt, num_error, num_late, total_rtt/num_rtt))
            elif (num_x>0):
                hop["result"]={"x":"*"}
                print("%s \t %i \t\t %i \t\t %i" % (fromIP, num_rtt, num_x, num_late))
            else:
                print("%s \t %i \t\t %i \t\t %i" % (fromIP, num_rtt, num_error, num_late))
            total_rtt = 0.0
            num_rtt = 0.0
            num_error = 0
            num_late = 0
        print("\n")
        
with open(newfilename,'w') as json_data:
    json_data.write(json.dumps(results))
