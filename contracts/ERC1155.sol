// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERCFifteen is Ownable {
    string public name;
    
    constructor(string memory _name) Ownable(msg.sender) {
        name = _name;
    }
}
