import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';
import "babel-polyfill";

let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
web3.eth.defaultAccount = web3.eth.accounts[0];
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
let noPayoutStatusCodes = [0, 10, 30, 40, 50]
let initialOracles = 20;
let oracles = [];
let accounts = [];

const registerOracles = async () => {
 let accounts = await web3.eth.getAccounts();
  for(let i = 0; i < initialOracles ; i++) {
    await flightSuretyApp.methods.registerOracle.send({
      from: accounts[i],
      value: web3.utils.toWei('1', 'ether'),
      gas: 1000000,
    });
    let indexes = await flightSuretyApp.methods.getMyIndexes.call({
      from: accounts[i],
      gas: 100000,
    });
    oracles.push({
      account: accounts[i],
      indexes,
    });
    console.log('Oracle: ', i - 19, 'account: ', accounts[i], 'indexes: ', indexes);
  }
};
const submitOracleResponses = async (event) => {
  const index = event.returnValues.index;
  const airline = event.returnValues.airline;
  const flight = event.returnValues.flight;
  const timestamp = event.returnValues.timestamp; 
  const oracles = getOraclesIndex(index);
  oracles.forEach(async oracle => {
    let statusCode = getRandomFlightStatus();
    try {
      await flightSuretyApp.methods.submitOracleResponse(index, airline, flight, timestamp, statusCode).send({
        from: oracle,
        gas: 100000,
      });
    } catch (err) {
      console.log('submit response error for oracle: ',+ oracle);
    }
  });
};
const getOraclesIndex = (index) => {
  let oraclesIndex = [];
  oracles.forEach(oracle => {
    oracle.indexes.forEach(i => {
      if(i == index) {
        oraclesIndex.push(oracle.account);
      }
    })
  });
  return oraclesIndex;
};
flightSuretyApp.events.OracleRequest({
    fromBlock: 0
  }, async function (error, event) {
    if (error) console.log(error);
    console.log(event);
    submitOracleResponses(event);
});
const getRandomFlightStatus = () => {
  let randomNumber = Math.floor(Math.random() * 10);
  if(randomNumber < 6) {
    return 20; // need to pay passenger
  } else {
    let randomDelayNumber = Math.floor(Math.random() * 5);
    return noPayoutStatusCodes[randomDelayNumber]; // no need to pay passenger
  }
};
const app = express();
app.get('/api', (req, res) => {
    res.send({
      message: {name: 'mr. cheng', age: 'mr. peng'}
    })
})
registerOracles();
export default app; 