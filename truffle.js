module.exports = {
    networks: {
        genache: {
            host: "localhost",
            port: 7545,
            gas: 5000000,
            network_id: "*" // Match any network id
        }
    },
    compilers: {
        solc: {
          version: "0.4.25"  // ex:  "0.4.20". (Default: Truffle's installed solc)
        }
     }
};

