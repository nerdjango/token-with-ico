async function buyToken() {
    var amount = document.getElementById("amountId").value;
    var weiValue = web3.utils.toWei(amount, 'ether')
    presaleInstance.methods.buyTokens(user).send({ value: weiValue }, function(err, txHash) {
        if (err) {
            console.log(err);
        } else {
            console.log(txHash);
        }
    })
}