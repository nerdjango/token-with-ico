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

        let ownerInitialBalance = await web3.eth.getBalance(accounts[0])
        await truffleAssert.reverts(presale.buyTokens(accounts[1], { from: accounts[1], value: 1000 }))
        await truffleAssert.passes(presale.buyTokens(accounts[1], { from: accounts[1], value: amount }))

        account1Balance = await token.balanceOf(accounts[1]);

        assert.equal(Web3.utils.fromWei(account1Balance.toString(), "ether"), 100000)
        let ownerFinalBalance = await web3.eth.getBalance(accounts[0])

        assert.equal(ownerFinalBalance, parseInt(ownerInitialBalance) + parseInt(amount))
    })
    it("should prevent users from presale if the cap is spent", async() => {
        let token = await Token.deployed();
        let presale = await PreSale.deployed();

        let amountFor2 = Web3.utils.toWei("99", "ether")
        let amountFor3 = Web3.utils.toWei("1", "ether")

        await truffleAssert.passes(presale.buyTokens(accounts[2], { from: accounts[2], value: amountFor2 }))
        await truffleAssert.reverts(presale.buyTokens(accounts[3], { from: accounts[3], value: amountFor3 }))

        account2Balance = await token.balanceOf(accounts[2]);

        assert.equal(Web3.utils.fromWei(account2Balance.toString(), "ether"), 9900000)

        let hasEnded = await presale.hasEnded()
        assert.equal(hasEnded, true)

        await truffleAssert.reverts(presale.finalize({ from: accounts[1] }))
        await truffleAssert.passes(presale.finalize({ from: accounts[0] }))
        await truffleAssert.reverts(presale.finalize({ from: accounts[0] }))
    })
})