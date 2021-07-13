pragma solidity ^0.5.0;
import "./DaiToken.sol";
import "./DappToken.sol";

contract TokenFarm{
	//Code
	string public name = "JJ Token Farm";
	address public owner;
	DappToken public dappToken;
	DaiToken public daiToken;

	address[] public stakers;

	mapping(address => uint) public stakingBalance;
	mapping(address => bool) public hasStaked;
	mapping(address => bool) public isStaking;

	constructor(DappToken _dappToken, DaiToken _daiToken) public {
		dappToken = _dappToken;
		daiToken = _daiToken;
		owner=msg.sender;
	}

	//Stake Tokens
	function stakeTokens(uint amount) public {
		require(amount > 0, "amount cannot be 0");

		daiToken.transferFrom(msg.sender, address(this), amount);

		stakingBalance[msg.sender] += amount;

		if(!hasStaked[msg.sender])	{
			stakers.push(msg.sender);
		}
		//Update staking status
		isStaking[msg.sender]= true;
		hasStaked[msg.sender]= true;
		}


	//Unstake tokens
	function unstakeTokens() public {
		uint balance = stakingBalance[msg.sender];
		require(balance > 0, "Staking balance is 0");
		daiToken.transfer(msg.sender, balance);
		stakingBalance[msg.sender] = 0;
		isStaking[msg.sender] = false;
	}



	//Issue tokens
	function issueToken() public{
		require(msg.sender == owner, 'only owner can issue tokens');
		for (uint i=0; i<stakers.length; i++){
			address recipient = stakers[i];
			uint balance = stakingBalance[recipient];
			if(balance > 0){
				dappToken.transfer(recipient, balance);
			}
		}
	}
}