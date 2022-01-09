const PreSale = artifacts.require("PreSale");
const Token = artifacts.require("Token");

module.exports = function(deployer) {
    deployer.deploy(PreSale, Token.address, "0x937Fb5cffF42De5Ad7EfFC689Ae69e576a9F31E1", 1, 100000000, 100000);
};