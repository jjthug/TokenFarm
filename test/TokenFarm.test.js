const DappToken = artifacts.require('DappToken')
const DaiiToken = artifacts.require('DaiToken')
const TokenFarmV = artifacts.require('TokenFarm')

require('chai')
	.use(require('chai-as-promised'))
	.should()

function tokens(n){
	return web3.utils.toWei(n,'ether')
}

contract('TokenFarmYo', ([boi, investor]) =>{
	let daiToken, dappToken, tokenFarm

	before(async() => {
		daiToken = await DaiiToken.new()
		dappToken = await DappToken.new()
		tokenFarm = await TokenFarmV.new(dappToken.address, daiToken.address)

		await dappToken.transfer(tokenFarm.address, tokens('1000000'))

		await daiToken.transfer(investor, tokens('201'), {from: boi})
		//is boi the owner of DaiToken
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

	describe('Farming tokens', async() => {
		it('rewards stakers for staking dai tokens', async() =>{
		let result
		result = await daiToken.balanceOf(investor)
		assert.equal(tokens('201'),result.toString(), 'investor has Mock Dai balance correct before staking')

		//Staking tokens
		await daiToken.approve(tokenFarm.address, tokens('201'), {from: investor})
		await tokenFarm.stakeTokens(tokens('201'), {from: investor})

		//Checking balance after staking
		result = await daiToken.balanceOf(investor)
		assert.equal(result.toString(), tokens('0'), 'Correct balance after staking')

		result = await daiToken.balanceOf(tokenFarm.address)
		assert.equal(result.toString(), tokens('201'), 'Correct balance after staking')

		result = await tokenFarm.stakingBalance(investor)
		assert.equal(result.toString(), tokens('201'), 'correct staking balance of investor')

		result = await tokenFarm.isStaking(investor)
		assert.equal(result.toString(), 'true', 'investor staking status correct after staking')

		//Issue tokens
		await tokenFarm.issueToken({from: boi})

		//Checking balances after issuance
		result = await dappToken.balanceOf(investor)
		assert.equal(result.toString(), tokens('201'), 'correct dapp Token balance of investor')

		await tokenFarm.issueToken({from: investor}).should.be.rejected

		await tokenFarm.unstakeTokens({from: investor})

		result = await daiToken.balanceOf(tokenFarm.address)
		assert.equal(result.toString(), tokens('0'), 'correct daiToken balance of TokenFarm after unstaking')

		result = await daiToken.balanceOf(investor)
		assert.equal(result.toString(), tokens('201'), 'correct daiToken balance of investor after unstaking from Token Farm' )

		result = await tokenFarm.stakingBalance(investor)
		assert.equal(result.toString(), tokens('0'), 'correct staking balance of investor after unstaking' )

		result = await tokenFarm.isStaking(investor)
		assert.equal(result, false, 'correct staking status of investor')
		})

	})
})