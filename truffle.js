module.exports = {
    networks: {
      /*  ganache: {
            host: "localhost",
            port: 7545,
            gas: 5000000,
            network_id: "*" // Match any network id
        }*/

        // Make sure it should connecto to development environment
        development: {
            host: "localhost",
            port: 7545,
            gas: 5000000,
            network_id: "*" // Match any network id
        }
    }
};