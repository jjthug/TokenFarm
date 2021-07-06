const DappToken = artifacts.require('DappToken')
const DaiiToken = artifacts.require('DaiToken')
const TokenFarmV = artifacts.require('TokenFarm')

require('chai')
	.use(require('chai-as-promised'))
	.should()

function tokens(n){
	return web3.utils.toWei(n,'ether')
}

contract('TokenFarmYo', ([owner, investor]) =>{
	let daiToken, dappToken, tokenFarm

	before(async() => {
		daiToken = await DaiiToken.new()
		dappToken = await DappToken.new()
		tokenFarm = await TokenFarmV.new(dappToken.address, daiToken.address)

		await dappToken.transfer(tokenFarm.address, tokens('1000000'))

		await daiToken.transfer(investor, tokens('100'), {from: owner})
	})

	//Tests here
	describe('Mock DAI Deployment', async () =>{	
		it('has a name ', async ()=> {
			const name = await daiToken.name()
			assert.equal(name, 'Mock DAI Token')
		})
	})

	describe('Dapp Token Deployment', async () =>{	
		it('has a name ', async ()=> {
			const name = await dappToken.name()
			assert.equal(name, 'DApp Token')
		})
	})

	describe('Token farm tests', async () => {
		it('has a name', async () => {
			const name = await tokenFarm.name()
			assert(name, 'JJ Token Farm')
		})
		it('has tokens', async () => {
			const balance = await dappToken.balanceOf(tokenFarm.address)
			assert(balance.toString, tokens('1000000'))
		})
	})
})