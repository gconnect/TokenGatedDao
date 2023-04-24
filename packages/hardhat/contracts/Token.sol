// SPDX-License-Identifier:GPL-3.0

pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Token is IERC20 {

   string public name;
   string public symbol;
   uint8 public decimals;
   uint256 private _totalSupply;
  
   constructor() {
       _totalSupply = 200000000000000000000000;
       _balances[msg.sender] = _totalSupply;
       name = "MyToken";
       symbol = "MT";
       decimals = 18;
      
       emit Transfer(address(0), msg.sender, _totalSupply);
   }
  
}
