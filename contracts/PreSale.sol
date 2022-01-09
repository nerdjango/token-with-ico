//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TokenPresale
 * TokenPresale allows investors to make
 * token purchases and assigns them tokens based
 * on a token per ETH rate. Funds collected are forwarded to a wallet
 * as they arrive.
 */

contract Presale is Pausable, Ownable {
    /**
     * crowdsale constructor
     * @param _wallet who receives invested ether
     * @param _minInvestment is the minimum amount of ether that can be sent to the contract
     * @param _cap above which the crowdsale is closed
     * @param _rate is the amounts of tokens given for 1 ether
     */

    constructor(
        address _tokenAddress,
        address payable _wallet,
        uint256 _minInvestment,
        uint256 _cap,
        uint256 _rate
    ) {
        require(_wallet != address(0));
        require(_minInvestment >= 0);
        require(_cap > 0);
        TokenAddress = _tokenAddress;

        wallet = _wallet;
        rate = _rate;
        minInvestment = _minInvestment * (10**18); //minimum investment in wei  (=1 ether)
        cap = _cap * (10**18); //cap in tokens base units (=1000000 tokens)
    }

    // The token being sold
    address TokenAddress;

    // address where funds are collected
    address public wallet;

    // amount of raised money in wei
    uint256 public weiRaised;

    // cap above which the crowdsale is ended
    uint256 public cap;

    uint256 public minInvestment;

    uint256 public rate;

    bool public isFinalized;

    string public contactInformation;

    /**
     * event for token purchase logging
     * @param purchaser who paid for the tokens
     * @param beneficiary who got the tokens
     * @param value weis paid for purchase
     * @param amount amount of tokens purchased
     */
    event TokenPurchase(
        address indexed purchaser,
        address indexed beneficiary,
        uint256 value,
        uint256 amount
    );

    /**
     * event for signaling finished crowdsale
     */
    event Finalized();

    // fallback function to buy tokens
    receive() external payable {
        buyTokens(msg.sender);
    }

    /**
     * Low level token purchse function
     * @param beneficiary will recieve the tokens.
     */
    function buyTokens(address beneficiary) public payable whenNotPaused {
        require(beneficiary != address(0));
        require(msg.value >= minInvestment, "The enter amount is below minimum");
        require((weiRaised + msg.value) * rate <= cap, "Greater that cap");

        uint256 weiAmount = msg.value;
        // update weiRaised
        weiRaised = weiRaised + weiAmount;
        // compute amount of tokens created
        uint256 tokens = weiAmount * rate;

        IERC20(TokenAddress).transfer(msg.sender, tokens);
        emit TokenPurchase(msg.sender, beneficiary, weiAmount, tokens);
        forwardFunds();
    }

    // send ether to the fund collection wallet
    function forwardFunds() internal {
        payable(wallet).transfer(msg.value);
    }

    //allow owner to finalize the presale once the presale is ended
    function finalize() public onlyOwner {
        require(!isFinalized);
        require(hasEnded());

        emit Finalized();

        isFinalized = true;
    }

    function setContactInformation(string memory info) public onlyOwner {
        contactInformation = info;
    }

    //return true if crowdsale event has ended
    function hasEnded() public view returns (bool) {
        bool capReached = (weiRaised * rate >= cap);
        return capReached;
    }
}
