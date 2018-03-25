    let stitchClient, cluster, data;

	var isLoggedin = 0;
	
    // Replace this with your app's id
    const appId = "<INSERT APP ID HERE>";
	
    // Simple login with anonymous authentication
    function simpleAuth() {
      stitch.StitchClientFactory
        .create(appId)
        .then(client => {
          stitchClient = client;
          cluster = client.service("mongodb", "mongodb-atlas");
          data = cluster.db("hackabull").collection("devices");
          stitchClient.login().then(function () { isLoggedin=1;getDevices() });
        });
    }

    // Simple function taking authentication from the UI
    function emailAuth() {
      var userid = prompt("Enter your User ID:", "");
      var password = prompt("Enter your Password:", "");

      stitch.StitchClientFactory
        .create(appId)
        .then(client => {
          stitchClient = client;
          cluster = client.service("mongodb", "mongodb-atlas");
          data = cluster.db("hackabull").collection("devices");
          stitchClient.login(userid, password).then(function () { isLoggedin=1;getDevices() });
        });
    }

    function getDevices() {
      // Use Stitch to pull the latest data and then graph it
	  var text = "";
      stitchClient.executeFunction("onlineDevices", Date.now()).then(devices => {
		if(devices.length>0){
			for (i = 0; i < devices.length; i++) { 
				text += '<tr>';
				text += '<th>'+devices[i].serial+'</th>';
				text += '<td>'+devices[i].name+'</td>';
				text += '<td>'+devices[i].lat+'</td>';
				text += '<td>'+devices[i].longi+'</td>';
				addMarker(devices[i]);
			}
			document.getElementById("deviceList").innerHTML = text;
		}
      });
    }
	
	function checkFalls() {
	  if(isLoggedin==1){
      // Use Stitch to pull the latest data and then graph it
	  var text = "";
      stitchClient.executeFunction("getFalls", Date.now()).then(falls => {
		if(falls.length>0){
			text += '<h2>Falls Detected!</h2>';
			for (i = 0; i < falls.length; i++) { 
				text += '<p>- '+falls[i].name+' has fallen at location ';
				text += falls[i].lat+', ';
				text += falls[i].longi+'!</p>';
				text += '<p><b>Contact:</b> '+falls[i].num+'</p>';

			}
			document.getElementById("modal-body").innerHTML = text;
			$("#fallModal").modal()
		}
      });
		}
    }
	
	var t=setInterval(checkFalls,3000);

