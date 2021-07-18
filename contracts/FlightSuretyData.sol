//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner;                                      // Account used to deploy contract
    bool private operational = true;                                 // Blocks all state changes throughout the contract if false
    uint8 constant M = 3;
    uint256 airlineCounter = 0;
    uint256 airlineHalfConsensus = airlineCounter.div(2);
    address[] airlineCalls = new address[](0);
    address[] multiCalls = new address[](0); 
    uint256 adminCharge = 10 ether;
    uint256 insurancePrice = 1 ether;
    uint256 private counter = 1;
    uint256 private enabled = block.timestamp;


    struct AirlineProfile{
       bool isRegistered;
       bool isAdmin;
    }

    mapping(address => AirlineProfile) airlines; 


    struct PassengerInsuranceData {
           bytes32 insuredFlight;
           bool isActive;
    }
    mapping(address => PassengerInsuranceData) passengers;
    mapping(address => uint256) passengerInsuranceBalance;

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/


    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor
                                (
                                ) 
                                public 
    {
        contractOwner = msg.sender;
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational() 
    {
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    modifier requireRateLimit(uint time){
        
        require(block.timestamp >= enabled ,"Rate limiting in effects");
        _;
        enabled = enabled.add(time);
    }

    modifier requireGuard(){
        counter = counter.add(1);
        uint256 guard = counter;
        _;

        require(guard == counter, "This withdraw is not possible");
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */      
    function isOperational() 
                            public 
                            view 
                            returns(bool) 
    {
        return operational;
    }


    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */    
    function setOperatingStatus(bool mode) external {
        
        require(mode != operational, "New mode must be different from existing mode");
        require(airlines[msg.sender].isAdmin, "Caller is not an admin");

        bool isDuplicate = false;
        for(uint i=0; i<multiCalls.length; i++) {
            if (multiCalls[i] == msg.sender) {
                isDuplicate = true;
                break;
            }
        }
        require(!isDuplicate, "Caller has already called this function.");

        multiCalls.push(msg.sender);
        if (multiCalls.length >= M) {
            operational = mode;      
            multiCalls = new address[](0);
        }

    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

   /**
    * @dev Add an airline to the registration queue
    *      Can only be called from FlightSuretyApp contract
    *
    */   
    function registerAirline
                            (  
                                address account
                            )
                            external
                            
    {
        require(airlines[msg.sender].isAdmin, "Airline is not an admin to register new airline.");
           
        if ( airlineCounter <= 4 ){

            airlines[account] = AirlineProfile({
                                                    isRegistered: true,
                                                    isAdmin: false
                                                });
                        airlineCounter++;
        
        } else {
            
            bool isDuplicate = false;
        for(uint i=0; i<airlineCalls.length; i++) {
            if (airlineCalls[i] == msg.sender) {
                isDuplicate = true;
                break;
            }
        }
        require(!isDuplicate, "Caller has already called this function.");

        airlineCalls.push(msg.sender);

        if (airlineCalls.length >=  airlineHalfConsensus) {

            airlines[account] = AirlineProfile({
                                                    isRegistered: true,
                                                    isAdmin: false
                                                });
                       airlineCounter++;  
                     airlineCalls = new address[](0);                       
                 }
             }        
    }

    function becomeAdmin(uint256 amount) external {
        require(airlines[msg.sender].isRegistered, "Airline should be register first to be an admin");
        require(msg.value >= amount, "Insufficient balance");
        require(amount >= adminCharge, "Please deposit minimum 10 ether to become an admin");
        uint256 airlineWalletBalane = msg.value;
        uint256 fundAmount = msg.value.sub(amount);
        airlineWalletBalane = airlineWalletBalane.sub(fundAmount);
        address(this).transfer(fundAmount);
        airlines[msg.sender].isAdmin = true;
    }

   /**
    * @dev Buy insurance for a flight
    *
    */   
    function buy
                            ( 
                                uint256 amount, bytes32 flight                           
                            ) 
                            external
                            payable
                            
    {
        require(amount >= insurancePrice, 'Insufficient fund to buy insurance');
        require(!passengers[msg.sender].isActive, "Passenger already bought an insurance");
        require(msg.value >= amount, 'Insufficient fund to buy insurance');
        uint256 passengerWalletBalance = msg.value;
        uint256 deductionAmount = passengerWalletBalance.sub(amount);
        passengerWalletBalance = passengerWalletBalance.sub(deductionAmount);
        address(this).transfer(deductionAmount);
        passengers[msg.sender] = PassengerInsuranceData({
                                      insuredFlight: flight,
                                           isActive: true
                                                 });

    }

    /**
     *  @dev Credits payouts to insurees
    */
    function creditInsurees
                                (
                                    bytes32 cancelledFlight, address passenger
                                )
                                external
                            
    {
        require(passengers[passenger].insuredFlight == cancelledFlight, "Flight status in not eligible for insurance payout");
        require(passengers[passenger].insuredFlight == cancelledFlight, "Flight status in not eligible for insurance payout");
        uint256 insuredPayout = insurancePrice.add(insurancePrice.div(2));
        uint256 contractBalance = address(this).balance;
        contractBalance = contractBalance.sub(insuredPayout);
        passengerInsuranceBalance[passenger].add(insuredPayout);
    }
    

    /**
     *  @dev Transfers eligible payout funds to insuree
     *
    */
    function pay
                            (
                                uint256 amount
                            )
                            external
                            requireRateLimit(60 minutes) requireGuard
                            
    {
            require(msg.sender == tx.origin, "Contracts are not allowed to withdraw funds");
            require(passengerInsuranceBalance[msg.sender] >= amount, 'Amount must be less than available balance');
            require(address(this).balance >= amount, "The contract doesn't have enough balance right now, please contract support team");
            uint256 withdrwableBalance = passengerInsuranceBalance[msg.sender];
                    passengerInsuranceBalance[msg.sender] = passengerInsuranceBalance[msg.sender].sub(withdrwableBalance);
                    msg.sender.transfer(withdrwableBalance);
    }

   /**
    * @dev Initial funding for the insurance. Unless there are too many delayed flights
    *      resulting in insurance payouts, the contract should be self-sustaining
    *
    */   
    function fund
                            ( 
                                 
                            )
                            public
                            payable
    {
        
    }

    function getFlightKey
                        (
                            address airline,
                            string memory flight,
                            uint256 timestamp
                        )
                        internal
                        pure
                        returns(bytes32) 
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    /**
    * @dev Fallback function for funding smart contract.
    *
    */
    function() 
                            external 
                            payable 
    {
        fund();
    }


}

