
import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';


(async() => {

    let result = null;  

    let contract = new Contract('localhost', () => {

        // Read transaction
        function setOperational(mode){
            contract.isOperational((error, result) => {
                console.log(error,result);
                display('Operational Status', 'Check if contract is operational', [ { label: 'Operational Status', error: error, value: mode} ]);
            });
        }
        
    

        // User-submitted transaction
        DOM.elid('submit-oracle').addEventListener('click', () => {
            let flight = DOM.elid('flight-number').value;
            // Write transaction
            contract.fetchFlightStatus(flight, (error, result) => {
                display('Oracles', 'Trigger oracles', [ { label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp} ]);
            });
        })

        DOM.elid('submit-operation').addEventListener('click', () => {
            let mode = DOM.elid('flight-operation').value;
            // Write transaction
            contract.setOperatingStatus(mode, (error, result) => {
                 
                setOperational(mode)
            });
        })

        DOM.elid('submit-airline').addEventListener('click', () => {
            let airline = DOM.elid('flight-airline').value;
            // Write transaction
            contract.registerAirline(airline, (error, result) => {
                 alert(airline +"  "+ "registered successfully")
               
            });
        })

        DOM.elid('submit-fund').addEventListener('click', () => {
            let amount = DOM.elid('flight-fund').value;
            // Write transaction
            contract.becomeAdmin(amount, (error, result) => {
                 alert(amount +"  ether" +"  "+ "deposited successfully, you are now an Admin")
               
            });
        })
    
        DOM.elid('submit-select').addEventListener('click', () => {
            let amount = DOM.elid('flight-insurance').value;
            let flight = DOM.elid('flight-select').value;
            // Write transaction
            contract.buy(amount, flight, (error, result) => {
                 alert(flight +"  "+"Insurance bought successfully")
               
            });
        })

        DOM.elid('submit-status').addEventListener('click', () => {
            let statusquery = DOM.elid('flight-status').value;
            // Write transaction
            contract.becomeAdmin(statusquery, (error, result) => {
                 alert(statusquery +"  "+ "flight status fetched successfully")
               
            });
        })

        DOM.elid('submit-refund').addEventListener('click', () => {
            let flight = DOM.elid('flight-refund').value;
            let address = DOM.elid('flight-address').value;
            // Write transaction
            contract.creditInsurees(flight, address, (error, result) => {
                 alert(address +"  "+ "is refunded successfully")
               
            });
        })

        DOM.elid('submit-withdraw').addEventListener('click', () => {
            // Write transaction
            let amount = DOM.elid('flight-withdraw').value;
            contract.pay(amount, (error, result) => {
                 alert("Your account is credited successfully by" + amount)
               
            });
        })

    });
    

})();


function display(title, description, results) {
    let displayDiv = DOM.elid("display-wrapper");
    let section = DOM.section();
    section.appendChild(DOM.h2(title));
    section.appendChild(DOM.h5(description));
    results.map((result) => {
        let row = section.appendChild(DOM.div({className:'row'}));
        row.appendChild(DOM.div({className: 'col-sm-4 field'}, result.label));
        row.appendChild(DOM.div({className: 'col-sm-8 field-value'}, result.error ? String(result.error) : String(result.value)));
        section.appendChild(row);
    })
    displayDiv.append(section);

}







