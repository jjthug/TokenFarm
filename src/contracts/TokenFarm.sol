pragma solidity ^0.5.0;
import "./DaiToken.sol";
import "./DappToken.sol";

contract TokenFarm{
	//Code
	string public name = "JJ Token Farm";
	DappToken public dappToken;
	DaiToken public daiToken;

	constructor(DappToken _dappToken, DaiToken _daiToken) public {
		dappToken = _dappToken;
		daiToken = _daiToken;
	}
}
