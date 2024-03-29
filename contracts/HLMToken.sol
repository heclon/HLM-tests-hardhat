// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;
import "hardhat/console.sol";

contract Token{
  string public name = "HLM Token Contract";
  string public symbol = "HLM";
  uint public totalSupply = 100000000;

  address public owner;
  mapping(address=> uint) balances;

  constructor(){
    balances[msg.sender]=totalSupply;
    owner=msg.sender;
  }

  function transfer(address to, uint amount) external {
    console.log("Sender balance is %s token", balances[msg.sender]);
    console.log("Sender is sending %s tokensto address", amount, to);
    require(balances[msg.sender]>=amount, "Not enough tokens");
    balances[msg.sender]-=amount;
    balances[to]+=amount;
  }

  function balanceOf(address account) external view returns(uint){
    return balances[account];
  }
}