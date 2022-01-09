const PreSale = artifacts.require("PreSale");
const Token = artifacts.require("Token");

module.exports = function(deployer, network, accounts) {
    if (network == "test") {
        deployer.deploy(PreSale, Token.address, accounts[0], 1, 10000000, 100000);
    } else {
        deployer.deploy(PreSale, Token.address, accounts[0], 1, 100000000, 100000);
    }
};