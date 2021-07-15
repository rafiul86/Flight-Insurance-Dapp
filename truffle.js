var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "dad blouse rural trim fold dose write joy bicycle ribbon grief forest";

module.exports = {
  networks: {
    development: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "http://127.0.0.1:7545/", 0, 50);
      },
      network_id: '*',
      gas: 4500000,
      price: 10000000000
    }
  },
  compilers: {
    solc: {
      version: "^0.4.24"
    }
  }
};