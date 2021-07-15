
var FlightSuretyApp = artifacts.require("FlightSuretyApp");
var FlightSuretyData = artifacts.require("FlightSuretyData");
var BigNumber = require('bignumber.js');

var Config = async function(accounts) {
    
    // These test addresses are useful when you need to add
    // multiple users in test scripts
    let testAddresses = [
        "0xFFEC4fF55D2F43C429410b11C95bE924B083Bc57",
        "0x429DEb2E65e1C64F081b46F63140F0Cf12504e98",
        "0x63727Ab82BfC34213671512B11F7E5A00dc61e9F",
        "0x627FD099112e986c05924b2390917f181Cf8eAe8",
        "0xcB63688580aD0C3452600D1B4Bf485Db6364106A",
        "0x3b802aBA145C8B4508437CE475672402C984E0F1",
        "0x5d51D44F81B749778Ae1132c1580B36f38e3d3f5",
        "0x1a86040447D7a93f65099EB2f4eaF4F14767379A",
        "0x92F953d36a35B6EE41858a67c426c5E8a40DF369"
    ];


    let owner = testAddresses[0];
    let firstAirline = testAddresses[1];

    let flightSuretyData = await FlightSuretyData.new();
    let flightSuretyApp = await FlightSuretyApp.new();

    
    return {
        owner: owner,
        firstAirline: firstAirline,
        weiMultiple: (new BigNumber(10)).pow(18),
        testAddresses: testAddresses,
        flightSuretyData: flightSuretyData,
        flightSuretyApp: flightSuretyApp
    }
}

module.exports = {
    Config: Config
};