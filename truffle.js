var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "more rifle lunar correct truth debris other address guard rich service faith";

module.exports = {
  networks: {
    // rinkeby : {
    //   provider : function(){
    //     return new HDWalletProvider("decade reduce donkey bottom uncle electric practice sun giggle predict palace mango", "https://rinkeby.infura.io/v3/50dfa31dd2474b109bd9d0b0bff5a0eb")
    //   },
    //   network_id :4,
    //   gas : 4500000,
    //   price : 10000000000
    // },
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