while true; do
	echo "Starting MS API"
	sudo python ms_visionapi.py
	sudo python ms_facedetection.py
	sudo python aws_dynamodb.py
	sudo node insight_service.js
	sleep 0.25 
done 
