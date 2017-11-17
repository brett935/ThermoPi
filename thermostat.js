// import RPI.GPIO as GPIO;
// import time;
// Wiring: https://www.youtube.com/watch?v=FmaDeTcgkUg
// Unit Type: conventional or heat pump
// white: heat strip
// yellow: compressor
// green: blower
// orange: reversing valve/energize on cool (default mode is heat unless orange is connected to red)
// red: hot/transformer (RC or RH)
// blue: common/goes to transformer

// #MODES
// heat pump
// connect red, green, yellow

// emergency heat
// connect red, green, white

// air conditioner
// connect red, green, yellow, orange

// Single mode (heat or AC)
// currentTemp
// desiredTemp
// toleranceInterval (for energy effeciency)

// var Gpio = require('onoff').Gpio
// var white = new Gpio(4, 'out');

class Thermostat {
  constructor() {
    console.log("Setting up thermostat!");
    let HVACType = "conventional"; // "heat pump"
    let mode = "single"; // "single", "dual"
    let switchMode = "heat"; // "heat", "ac" or "off"
    let indoorBlowerFan = "on"; // "on" or "auto"
    let currentTemperature = 69;
    let desiredTemperature = 72;

    //for dual mode
    let lowTempLimit = 69;
    let highTempLimit = 72;
    //toleranceInterval (for energy effeciency)


    this.decideFunction = function() { 
      if(mode == "dual"){
        //SHOULD CHECK TO MAKE SURE HEAT AND AC ARENT BOTH ACTIVE!!!!!!

        if(currentTemperature > highTempLimit) {
          //heatOff
          acOn();
        }
        else if(currentTemperature < lowTempLimit) {
          //acOff
          heatOn();          
        }
      }
      else if(mode == "single") {
        if(switchMode == "ac") {
          if(currentTemperature > desiredTemperature) {
            //heatOff
            acOn();
          }
        }
        else if(switchMode == "heat") {
          if(currentTemperature < desiredTemperature) {
            //acOff
            heatOn();
          }
        }
        else if(switchMode == "off") {
          //heatOff
          //acOff
        }
      }
    }

    //button controls
    this.setModeAC = function () {
      switchMode = "ac";
      logButtonChange(switchMode);
    }
    this.setModeHeat = function () {
      switchMode = "heat";
      logButtonChange(switchMode);
    }
    this.setModeOff = function () {
      switchMode = "off";
      logButtonChange(switchMode);
    }
    this.setFunctionSingle = function () {
      mode = "single";
      logButtonChange(mode);
    }
    this.setFunctionDual = function () {
      mode = "dual";
      logButtonChange(mode);
    }
    this.setFanOn = function () {
      indoorBlowerFan = "on";
      logButtonChange(indoorBlowerFan);
    }
    this.setFanAuto = function () {
      indoorBlowerFan = "auto";
      logButtonChange(indoorBlowerFan);
    }
    let logButtonChange = function(value) {
      console.log("Changed to: " + value);
    }

    let acOn = function() {
      console.log("AC on");
      decreaseTemperature();
    }
    let heatOn = function() {
      console.log("Heat on");
      increaseTemperature();
    }

    //testing functions
    this.randomTemperatureChange = function(){
      let max = 2;
      let min = 1;
      let random = Math.floor(Math.random()*(max-min+1)+min);
      if(random == 1) {
        increaseTemperature();
      }
      else if(random == 2) {
        decreaseTemperature();
      }
    }
    let increaseTemperature = function() {
      currentTemperature++;
    }
    let decreaseTemperature = function() { 
      currentTemperature--;
    }
    this.getCurrentTemperature = function() {
      return currentTemperature;
    }
    this.logCurrentTemperature = function() {
      // console.log("%c Current temperature: " + currentTemperature, 'background: #222; color: #bada55');
      console.log("Current temperature: " + currentTemperature);
    }
  }
}

thermostat = new Thermostat();

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

    setInterval(function myTimer3() {
      client.emit('updateTemp', thermostat.getCurrentTemperature());
    }, 1000);
    

});
server.listen(5200);  
// END SERVER CODE
