const Token = artifacts.require("Token");
const PreSale = artifacts.require("PreSale");
const truffleAssert = require("truffle-assertions")

const Web3 = require("web3")

contract("PreSale", accounts => {
    it("should succeffully transfer tokens to PreSale", async() => {
        let token = await Token.deployed();
        let presale = await PreSale.deployed();

        let accountTokenBalance = await token.balanceOf(accounts[0]);

        let presaleAmount = Web3.utils.toWei("100000000", "ether")
        await token.transfer(presale.address, presaleAmount);
        let presaleTokenBalance = await token.balanceOf(presale.address);

        let newAccountTokenBalance = await token.balanceOf(accounts[0]);
        let total = parseInt(newAccountTokenBalance.toString()) + parseInt(presaleAmount)

        assert.equal(presaleTokenBalance, presaleAmount)

        assert.equal(parseInt(accountTokenBalance.toString()), total)
    })
    it("should allow users to buy tokens if all the right conditions are met", async() => {
        let token = await Token.deployed();
        let presale = await PreSale.deployed();

        let amount = Web3.utils.toWei("1", "ether")
        await truffleAssert.reverts(presale.buyTokens(accounts[1], { from: accounts[1], value: 1000 }))
        await truffleAssert.passes(presale.buyTokens(accounts[1], { from: accounts[1], value: amount }))

        account1Balance = await token.balanceOf(accounts[1]);

        assert.equal(Web3.utils.fromWei(account1Balance.toString(), "ether"), 100000)
    })
})