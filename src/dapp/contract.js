import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json'
import Web3 from 'web3';

export default class Contract {
    constructor(network, callback) {  

        let config = Config[network];
        this.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.flightSuretyData = new this.web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);
        this.initialize(callback);
        this.owner = null; 
        this.airlines = [];
        this.passengers = [];
    }

    initialize(callback) {
        this.web3.eth.getAccounts((error, accts) => {
           
            this.owner =  accts[0];

            let counter = 1;
            
            while(this.airlines.length < 5) {
                this.airlines.push(accts[counter++]);
            }

            while(this.passengers.length < 5) {
                this.passengers.push(accts[counter++]);
            }

            callback();
        });
    }

    isOperational(callback) {
       let self = this;
       self.flightSuretyApp.methods
            .isOperational()
            .call({ from: self.owner}, callback);
    }

    fetchFlightStatus(flight, callback) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        } 
        self.flightSuretyApp.methods
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({ from: self.owner}, (error, result) => {
                callback(error, payload);
            });
    }

    setOperatingStatus(mode, callback) {
        
        let self = this;
        let payload = {
            mode: mode
        }
       self.flightSuretyApp.methods
       .setOperatingStatus(payload.mode)
       .send({ from: self.owner}, (error, result) => {
        callback(error, payload);
        });
    }

    registerAirline(airline, callback) {
        
        let self = this;
        let payload = {
            airline: airline
        }
       self.flightSuretyApp.methods
       .registerAirline(payload.airline)
       .send({ from: self.owner}, (error, result) => {
        callback(error, payload);
        });
    }

    becomeAdmin(amount, callback) {
        let self = this;
        let payload = {
            amount: amount
        }
       self.flightSuretyApp.methods
       .becomeAdmin(payload.amount)
       .send({ from: self.owner}, (error, result) => {
        callback(error, payload);
        });
    }

    buy(flight,amount, callback) {
        let self = this;
        let payload = {
            amount: amount,
            flight: flight
        }
       self.flightSuretyApp.methods
       .buy(payload.amount, payload.flight)
       .send({ from: self.owner}, (error, result) => {
        callback(error, payload);
        });
    }

    processFlightStatus(statusquery, callback) {
        let self = this;
        let payload = {
            statusquery: statusquery
        }
       self.flightSuretyApp.methods
       .processFlightStatus(payload.statusquery)
       .send({ from: self.owner}, (error, result) => {
        callback(error, payload);
        });
    }

    creditInsurees(flight, address, callback) {
        let self = this;
        let payload = {
            flight: flight,
            address: address
        }
       self.flightSuretyApp.methods
       .creditInsurees(payload.flight, payload.address)
       .send({ from: self.owner}, (error, result) => {
        callback(error, payload);
        });
    }

    pay(amount, callback) {
        let self = this;
        let payload = {
           amount: amount
        }
       self.flightSuretyApp.methods
       .creditInsurees(payload.amount)
       .send({ from: self.owner}, (error, result) => {
        callback(error, payload);
        });
    }
}