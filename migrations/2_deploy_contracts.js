const DappToken = artifacts.require('DappToken')
const DaiiToken = artifacts.require('DaiToken')
const TokenFarmV = artifacts.require('TokenFarm')

module.exports = async function(deployer, network, accounts) {
  // Deploy Mock Dai
  await deployer.deploy(DaiiToken)
  const daiToken = await DaiiToken.deployed()

  // Deploy Dapp Token
  await deployer.deploy(DappToken)
  const dappToken = await DappToken.deployed()

  // Deploy Token Farm
  await deployer.deploy(TokenFarmV, daiToken.address, daiToken.address)
  const tokenFarm = await TokenFarmV.deployed()

  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')

  //Transfer 100 Dai to 2nd account
  await daiToken.transfer(accounts[1], '100000000000000000000')
};
