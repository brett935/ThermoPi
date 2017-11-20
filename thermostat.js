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

module.exports = class Thermostat {
  constructor() {
    console.log("Setting up thermostat!");
    let HVACType = "conventional"; // "heat pump"
    let mode = "single"; // "single", "dual"
    let switchMode = "off"; // "heat", "ac" or "off"
    let indoorBlowerFan = "on"; // "on" or "auto"
    let currentTemperature = 70;
    let desiredTemperature = 70;

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
    this.setDesiredTemperature = function(desiredTemp) {
      console.log("Desired Temperature set to: " + desiredTemp);
      desiredTemperature = arguments[0];
    }
    this.setLowTemperatureLimit = function(lowTemp) {
      console.log("Low Temperature set to: " + lowTemp);
      lowTempLimit = arguments[0];
    }
    this.setHighTemperatureLimit = function(highTemp) {
      console.log("High Temperature set to: " + highTemp);
      highTempLimit = arguments[0];
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