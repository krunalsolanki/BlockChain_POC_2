var CrowdFundingWithDeadline = artifacts.require("./CrowdFundingWithDeadline.sol");

module.exports = function(deployer) {
  deployer.deploy(
    CrowdFundingWithDeadline, 
    "Test campaign",
    1,
    20,
    "0xCe1C8623f2dABE8d659E0Ee937D0EB46e251c67E"
  );
};
