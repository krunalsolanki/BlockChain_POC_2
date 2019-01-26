var CrowdFundingWithDeadline = artifacts.require("./CrowdFundingWithDeadline.sol");

module.exports = function(deployer) {
  deployer.deploy(
    CrowdFundingWithDeadline, 
    "Test campaign",
    1,
    20,
    "0x5C08898D08bAA09e6ff1ee645ff1cD2797Dc3357"
  );
};
