var request = require('request');
const exec = require( 'child_process' ).exec;
var CONFIG = require('./config.json');

var uNumber = CONFIG.uNumber;
var uName = CONFIG.uName;

exec('cat /proc/cpuinfo | grep Serial',(error,stdout,stderr) => {
    if(error){
        console.error( `exec error: ${error}` );
        return;
    }
    var serial = stdout.split(":")[1].replace(/\s/g, '');
	var n = Date.now();
	console.log(n);
	request.post(
    'http://165.227.94.27/heartbeat',
    { json: { device: serial, time: n, name: uName, num: uNumber } },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
			console.log("Heartbeat sent!");
        }
    }
);
});