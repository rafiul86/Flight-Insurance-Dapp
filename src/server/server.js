// import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
// import Config from './config.json';
// import Web3 from 'web3';
// import express from 'express';
// import "babel-polyfill";

// let config = Config['localhost'];
// let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
// web3.eth.defaultAccount = web3.eth.accounts[0];
// let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
// let noPayoutStatusCodes = [0, 10, 30, 40, 50]
// let initialOracles = 20;
// let oracles = [];
// let accounts = [];

// const registerOracles = async (callback) => {
//  let accounts = await web3.eth.getAccounts();
//   for(let i = 0; i < initialOracles ; i++) {
//     await flightSuretyApp.methods.registerOracle.send({ 
//       from: accounts[i],
//       value: web3.utils.toWei('1', 'ether'),
//       gas: 1000000,
//     },(callback)=>{
//       console.log(err)
//     })
    
//     let indexes = await flightSuretyApp.methods.getMyIndexes.call({
//       from: accounts[i],
//       gas: 100000,
//     });
//     oracles.push({
//       account: accounts[i],
//       indexes,
//     });
//     console.log('Oracle: ', i , 'account: ', accounts[i], 'indexes: ', indexes);
//   }
// };
// const submitOracleResponses = async (event) => {
//   const index = event.returnValues.index;
//   const airline = event.returnValues.airline;
//   const flight = event.returnValues.flight;
//   const timestamp = event.returnValues.timestamp; 
//   const oracles = getOraclesIndex(index);
//   oracles.forEach(async oracle => {
//     let statusCode = getRandomFlightStatus();
//     try {
//       await flightSuretyApp.methods.submitOracleResponse(index, airline, flight, timestamp, statusCode).send({
//         from: oracle,
//         gas: 100000,
//       });
//     } catch (err) {
//       console.log('submit response error for oracle: ',+ oracle);
//     }
//   });
// };
// const getOraclesIndex = (index) => {
//   let oraclesIndex = [];
//   oracles.forEach(oracle => {
//     oracle.indexes.forEach(i => {
//       if(i == index) {
//         oraclesIndex.push(oracle.account);
//       }
//     })
//   });
//   return oraclesIndex; 
// };
// flightSuretyApp.events.OracleRequest({
//     fromBlock: 0
//   }, async function (error, event) {
//     if (error) console.log(error);
//     console.log(event);
//     submitOracleResponses(event);
// });
// const getRandomFlightStatus = () => {
//   let randomNumber = Math.floor(Math.random() * 10);
//   if(randomNumber < 6) {
//     return 20; // need to pay passenger
//   } else {
//     let randomDelayNumber = Math.floor(Math.random() * 5);
//     return noPayoutStatusCodes[randomDelayNumber]; // no need to pay passenger
//   }
// };
// const app = express();
// app.get('/api', (req, res) => {
//     res.send({
//       message: {name: 'mr. cheng', age: 'mr. peng'}
//     })
// })
// registerOracles();
// export default app; 
import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';


let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
// web3.eth.defaultAccount = web3.eth.accounts[0];
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
const TEST_ORACLES_COUNT = 20;
// Watch contract events
const STATUS_CODE_UNKNOWN = 0;
const STATUS_CODE_ON_TIME = 10;
const STATUS_CODE_LATE_AIRLINE = 20;
const STATUS_CODE_LATE_WEATHER = 30;
const STATUS_CODE_LATE_TECHNICAL = 40;
const STATUS_CODE_LATE_OTHER = 50;
// ARRANGE
let getRegistrationFee = async () => {
  let result = await flightSuretyApp.methods.REGISTRATION_FEE().call();
  return result.toString("binary");
} 

let setRegisterOracle = async (account, fee) => {
  let result = await flightSuretyApp.methods.registerOracle().call({ from: account, value: fee });
  return result.toString("binary");
} 

let getGetMyIndexes = async (account) => {
  let result = await flightSuretyApp.methods.getMyIndexes().call({ from: account });
  return result.toString("binary");
} 


( async () => {
  const accounts = await web3.eth.getAccounts();
  const fee = await getRegistrationFee();
  console.log('fee: '+ fee);
  for(let a=1; a<TEST_ORACLES_COUNT; a++) {      
    // 
    console.log(accounts[a]);
    // await  setRegisterOracle(accounts[a], fee);
    // let result = await getGetMyIndexes(accounts[a]);
    flightSuretyApp.methods.registerOracle().send({ from: accounts[a], value: fee, gas: '4712388', gasPrice: '100000000000' }).then(function(resultado){
      // console.log(`Oracle Registrado : ${resultado[0]}, ${resultado[1]}, ${resultado[2]}`);
      let result =   flightSuretyApp.methods.getMyIndexes().call({from: accounts[a]});
      result.then(function(results){
                 console.log(`Oracle Registrado : ${results[0]}, ${results[1]}, ${results[2]}`);
                  });
     
       });
  
    // console.log('App:' + flightSuretyApp);
    // console.log(`Oracle Registrado : ${result[0]}, ${result[1]}, ${result[2]}`);
   }

}

)();

flightSuretyApp.events.OracleRequest({
  fromBlock: 0
},  function (error, event) {
  if (error) console.log(error)
  console.log('eeee' + event.returnValues.airline)
  // let getAccounts = async () => {
  //   let result = await web3.eth.getAccounts();
  //   return result;//.toString("binary");
  // } 
  let index = event.returnValues.index;
 //let accounts =  await getAccounts();
 //console.log('Cuenta: ' + accounts[2]);
 //let oracleIndexes = await getGetMyIndexes(accounts[a]);
 web3.eth.getAccounts(function(err, accounts) {
  for(let a=1; a<TEST_ORACLES_COUNT; a++) {
  flightSuretyApp.methods.getMyIndexes().call({ from: accounts[a] }).then(function(oracleIndexes){
  
  //for(let idx=0;idx<3;idx++) {

    try {
      console.log('Airline: ' + event.returnValues.airline);
      // Submit a response...it will only be accepted if there is an Index match
      if(index == oracleIndexes[0] || index ==oracleIndexes[1] || index ==oracleIndexes[2])
       flightSuretyApp.methods.submitOracleResponse(index, event.returnValues.airline, event.returnValues.flight, event.returnValues.timestamp, STATUS_CODE_LATE_AIRLINE).send({ from: accounts[a] });

    }
    catch(e) {
      // Enable this when debugging
       console.log('\nError en el Submit Oracle', index, index, event.returnValues.flight, event.returnValues.timestamp, e); //oracleIndexes[idx].toNumber()
    }

  //}

 });

}
 });

// Borrar
//  web3.eth.getAccounts(function(err, res) {
//  for(let a=1; a<TEST_ORACLES_COUNT; a++) {  
  // Get oracle information
  // let result =  flightSuretyApp.methods.getMyIndexes().call({ from: res[a]});
  // result.then(function(oracleIndexes){
  //   console.log('Cuenta: ' + res[a]);
  //   console.log('Indexes: ' + oracleIndexes);
  // })
    
//  }

// })
 });

//  flightSuretyApp.events.FlightStatusInfo({
//   fromBlock: 0
// },  function (error, event) {
//   if (error) console.log(error)
//   console.log('EVENTOS de' + event)
// });
// flightSuretyApp.events.FlightStatusInfo({
//   fromBlock: 0
// },  function (error, event) {
//   if (error) console.log(error)
//   console.log('eeee' + event)

// });

const app = express();
app.get('/api', (req, res) => {
    res.send({
      message: 'An API for use with your Dapp!'
    })
})

export default app;