const Thermostat = require('./thermostat');
let thermostat = new Thermostat();

let myVar = setInterval(myTimer ,200);
function myTimer() {
    thermostat.decideFunction();
    thermostat.logCurrentTemperature();

} 
let myVar2 = setInterval(simulateTemperatureFluctuation, 2000);
function simulateTemperatureFluctuation() {
  thermostat.randomTemperatureChange();
}


// SERVER CODE
// http://www.programwitherik.com/getting-started-with-socket-io-node-js-and-express/
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/node_modules'));  
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(client) {  
    console.log('Client connected...');

    client.on('setModeAC', function() {
      thermostat.setModeAC();
    })
    client.on('setModeHeat', function() {
      thermostat.setModeHeat();
    })
    client.on('setModeOff', function() {
      thermostat.setModeOff();
    })
    client.on('setFanOn', function() {
      thermostat.setFanOn();
    })
    client.on('setFanAuto', function() {
      thermostat.setFanAuto();
    })
    client.on('setFunctionSingle', function() {
      thermostat.setFunctionSingle();
    })
    client.on('setFunctionDual', function() {
      thermostat.setFunctionDual();
    })
    client.on('setDesiredTemperature', function(desiredTemperature) {
      thermostat.setDesiredTemperature(desiredTemperature);
    })
    client.on('setLowTemperatureLimit', function(lowTemperature) {
      thermostat.setLowTemperatureLimit(lowTemperature);
    })
    client.on('setHighTemperatureLimit', function(highTemperature) {
      thermostat.setHighTemperatureLimit(highTemperature);
    })

    setInterval(function myTimer3() {
      client.emit('updateTemp', thermostat.getCurrentTemperature());
    }, 1000);

});
server.listen(5200);  
// END SERVER CODE
