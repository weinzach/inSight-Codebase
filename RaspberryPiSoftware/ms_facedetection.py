########### Python 2.7 #############
import httplib, urllib, base64
import signal
import numpy as np
import sys
import json

#To handle the SIGINT when CTRL+C is pressed
def exit_gracefully(signum,frame):
    signal.signal(signal.SIGINT, original_sigint)
    sys.exit(1)

headers = {
    # Request headers
    'Content-Type': 'application/octet-stream',
    'Ocp-Apim-Subscription-Key': '<INSERT KEY HERE>',
}

params = urllib.urlencode({
    # Request parameters
    'visualFeatures': 'Faces',
})

#Saves the text to the file
def saveTextFile(text):
    try:
        print(text)
        text_file = open("output1.txt","w+")
        text_file.write(text)
        text_file.close()
    except Exception, e:
        print ("Exception occured \n")
        print (e)
        pass

def read_image():
    pathToFileInDisk = r'insight.png'
    with open(pathToFileInDisk, 'rb') as f:
        data = f.read()
    return data

def analyze_image(data):
    try:
        conn = httplib.HTTPSConnection('westcentralus.api.cognitive.microsoft.com')
        conn.request("POST", "/vision/v1.0/analyze?%s" % params, data, headers)
        response = conn.getresponse()
        data = response.read()
        print(data)
        conn.close()
    except Exception as e:
        print("[Errno {0}] {1}".format(e.errno, e.strerror))

    return data

def tag_from_data(input):
    if input is not None:
        result = json.loads(input)
        #print result
        description = result['faces'][0]["gender"]
        print description
        description1 = result['faces'][0]["age"]
        print description1
        #print(data)
       
        awsstring = "I think the person is "
        awsstring += str(description1)
        awsstring += "years old and is a "
        awsstring += description
        

        return awsstring


if __name__ == '__main__':
    original_sigint = signal.getsignal(signal.SIGINT)
    signal.signal(signal.SIGINT,exit_gracefully)
    img = read_image()
    data = analyze_image(img)
    text = tag_from_data(data)
    saveTextFile(text)
####################################
