from sense_hat import SenseHat
from time import sleep
import json
import requests

with open('config.json') as json_data:
    d = json.load(json_data)

def getserial():
  # Extract serial from cpuinfo file
  cpuserial = "0000000000000000"
  try:
    f = open('/proc/cpuinfo','r')
    for line in f:
      if line[0:6]=='Serial':
        cpuserial = line[10:26]
    f.close()
  except:
    cpuserial = "ERROR000000000"

  return cpuserial

def reportFall():
    data = {}
    data['name'] = d['uName']
    data['num'] = d['uNumber']
    data['device'] = getserial()
    json_data = json.dumps(data)
    r = requests.post(url = 'http://165.227.94.27/fall', data = data)
    
sense = SenseHat()

red = (255, 0, 0)

while True:
    acceleration = sense.get_accelerometer_raw()
    x = acceleration['x']
    y = acceleration['y']
    z = acceleration['z']

    x = abs(x)
    y = abs(y)
    z = abs(z)

    if x > 2.5 or y > 2.5 or z > 2.5:
        sense.show_letter("!", red)
        reportFall()
        sleep(1)
    else:
        sense.clear()

