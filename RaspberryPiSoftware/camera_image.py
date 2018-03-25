import time
import picamera

while True:
	with picamera.PiCamera() as camera:
	    #camera.resolution = (1024, 728)
	    #camera.start_preview()
	    # Camera warm-up time
	    time.sleep(1)
	    camera.capture('insight.png')
	    time.sleep(9)