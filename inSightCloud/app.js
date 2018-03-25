var express = require('express');
var app = express();
var iplocation = require('iplocation')
var bodyParser = require('body-parser')
var request = require('request');
var path = require('path');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.static('dash'))

function storeLocation(data){
	request.post(
    'https://webhooks.mongodb-stitch.com/api/client/v2.0/app/hackabull-mplwk/service/heartbeat/incoming_webhook/heartbeat?secret=<INSERT SECRET HERE>',
    { json: data },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
			console.log("Location of "+data.device+" stored!");
        }
    });
}

function storeFall(data){
	request.post(
    'https://webhooks.mongodb-stitch.com/api/client/v2.0/app/hackabull-mplwk/service/heartbeat/incoming_webhook/falls?secret=<INSERT SECRET HERE>',
    { json: data },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
			console.log("Fall "+data.device+" stored!");
        }
    });
}

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/dash/index.html'));
});

app.post('/fall', function (req, res) {
  var data = {};
  data.device = '';
  data.time = Date.now();
  data.name = '';
  data.num = '';
  var ip = req.connection.remoteAddress.split("::ffff:");
  if(req.body.device){
	  data.device = req.body.device;
  }
  if(req.body.name){
	  data.name = req.body.name;
  }
  if(req.body.num){
	  data.num = req.body.num;
  }	   
  ip = ip[1];
  iplocation(ip)
  .then(res => {
   data.lat = res.latitude;
   data.longi = res.longitude;
   storeFall(data);
  })
  .catch(err => {
    console.error(err)
  })
  res.json({status: "fall logged!"});
});


app.post('/heartbeat', function (req, res) {
  var data = {};
  data.device = '';
  data.time = '';
  data.name = '';
  data.num = '';
  var ip = req.connection.remoteAddress.split("::ffff:");
  if(req.body.device){
	  data.device = req.body.device;
  }
  if(req.body.time){
	  data.time = req.body.time;
  }	 
  if(req.body.name){
	  data.name = req.body.name;
  }
  if(req.body.num){
	  data.num = req.body.num;
  }	   
  ip = ip[1];
  iplocation(ip)
  .then(res => {
   data.lat = res.latitude;
   data.longi = res.longitude;
   storeLocation(data);
  })
  .catch(err => {
    console.error(err)
  })
  res.json({status: "location logged!"});
});

app.listen(80, function () {
  console.log('Example app listening on port 80!');
});