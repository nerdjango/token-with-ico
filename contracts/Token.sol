//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Token is ERC20 {
  constructor() ERC20('Nerdjango Token', 'NDT') {
    _mint(msg.sender, 1000000000 * 10 ** 18);
  }
}