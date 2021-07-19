
var FlightSuretyApp = artifacts.require("FlightSuretyApp");
var FlightSuretyData = artifacts.require("FlightSuretyData");
var BigNumber = require('bignumber.js');

var Config = async function(accounts) {
    
    // These test addresses are useful when you need to add
    // multiple users in test scripts
    let testAddresses = [
        "0x84d02c9BBee3190b68c60941dF0Fa2d86dC993DD",
        "0x80b5D6D50b5Eb505858956AcCBc7f6eb3f90a7d8",
        "0x80b5D6D50b5Eb505858956AcCBc7f6eb3f90a7d8",
        "0x3b272e419cC6b441d5B2EB9ee581E5e0a553c604",
        "0xcA5bDa897336c76e85128812109D46dE124aEF98",
        "0xbB3EC4154AF3A85ab14788D3e839767EA189bE9F",
        "0xa24ff3CE69BF5C8A7f99F44395a77948780A048d",
        "0x556075745Ee46a4F85D97ef8F60337C30F43aC6E",
        "0xD8106BeC4De7B7D174590081d0eA74060968C023"
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