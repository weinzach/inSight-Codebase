var map;
var infowindow;

function initMap() {
        var myLatLng = {lat: 28.0631, lng: -82.4128};

        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center: myLatLng
        });
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (position) {
				initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				map.setCenter(initialLocation);
			});
		}
		simpleAuth();
		//emailAuth();
}
 
function addMarker(data){
	var dataLatLng = {lat: data.lat, lng: data.longi};
	var marker = new google.maps.Marker({
          position: dataLatLng,
          title: data.name.toString()
        });
	var infowindow = new google.maps.InfoWindow({});

    google.maps.event.addListener(marker, 'click', function(){
        infowindow.close(); // Close previously opened infowindow
        infowindow.setContent( "<div id='infowindow'><p><b>Name:</b> "+ data.name.toString() +"</p><p><b>Number:</b> "+data.num.toString()+"</p></div>");
        infowindow.open(map, marker);
    });
	marker.setMap(map);
}