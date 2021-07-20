
var FlightSuretyApp = artifacts.require("FlightSuretyApp");
var FlightSuretyData = artifacts.require("FlightSuretyData");
var BigNumber = require('bignumber.js');

var Config = async function(accounts) {
    
    // These test addresses are useful when you need to add
    // multiple users in test scripts
    let testAddresses = [
        "0x27B776d372e9614e5D653fDF17cC0876428C87d1",
        "0x34e7AD4579a17394008F28EF219811ed065ac870",
        "0xcb2554db942F9cd069E2596193b9930131D1497E",
        "0xd20e60d4bF6b0A03599BD8Ae06a5653dDC23D6ea",
        "0x1CCf134c09E4453CF6f903BE99E6FE98C94235FD",
        "0xAbe185E6c81e180AF0a5B477Ee83FD241f42B3a1",
        "0x7A6793c2C0faaf8C074db1864c2f498fD55c0789",
        "0x8e7b3d00be4Fe32965bE5053A7edE8eb04DBE2f6",
        "0x2C6BFA0aC0F62EFDB0cfa1fa5c66600d90943993",
        "0x26cd1Aee67f9A4C1f4cEF96CD0ab3963c12fc756"
    ];


    let owner = accounts[0];
    let firstAirline = accounts[1];

    let flightSuretyData = await FlightSuretyData.new();
    let flightSuretyApp = await FlightSuretyApp.new(flightSuretyData.address);

    
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