import React, { Component } from 'react'
import Navbar from './Navbar'
import Web3 from 'web3'
import './App.css'
import daiTokenVar from '../abis/DaiToken.json'
import dappTokenVar from '../abis/DappToken.json'
import tokenFarmVar from '../abis/TokenFarm.json'
import Main from './Main.js'


class App extends Component {

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
    this.setState({loading: false})
  }

  async loadBlockchainData(){
      const web3 = window.web3
      const accounts = await web3.eth.getAccounts()
      
      this.setState({account: accounts[0]})
      //console.log(accounts)
      const networkId = await web3.eth.net.getId()
      console.log(networkId)

      //Load daiToken data
      const daiTokenData = daiTokenVar.networks[networkId]
      if(daiTokenData){
        const daiToken = new web3.eth.Contract(daiTokenVar.abi, daiTokenData.address)
        this.setState({daiToken: daiToken})
        let daiBalance = await daiToken.methods.balanceOf(this.state.account).call()
        this.setState({daiTokenBalance: daiBalance.toString()})
        console.log({daiTokenBalance: daiBalance.toString()})
                    console.log(daiToken.options.address)

        }
              else{
        console.log('DaiToken contract not deployed to detected network')
      }

       //Load dappToken
       const dappTokenData = dappTokenVar.networks[networkId] 
       if(dappTokenData){
        const dappTokenObj = new web3.eth.Contract(dappTokenVar.abi,dappTokenData.address)
        this.setState({dappToken: dappTokenObj})
        let balance = await dappTokenObj.methods.balanceOf(this.state.account).call()
        this.setState({dappTokenBalance: balance.toString()})
        console.log({dappTokenBalance: balance.toString()})
        }
                      else{
        console.log('DappToken contract not deployed to detected network')
      }

       //Load TokenFarm
       const tokenFarmData = tokenFarmVar.networks[networkId] 
       if(tokenFarmData){
        const tokenFarmObj = new web3.eth.Contract(tokenFarmVar.abi,tokenFarmData.address)
        this.setState({tokenFarm :tokenFarmObj})
        let stakingBalance = await tokenFarmObj.methods.stakingBalance(this.state.account).call()
        this.setState({stakingBalance: stakingBalance.toString()})
        console.log({stakingBalance: stakingBalance.toString()})




       }
        else{
        console.log('TokenFarm contract not deployed to detected network')
      }


  }



  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else
      window.alert('Non ethereum browser detected. Try Metamask!')
  }

    stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.daiToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.tokenFarm.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
     //             this.setState({ id: ++this.state.id})

      })
    })
  }


    unstakeTokens = () => {
      this.setState({loading: true})
      this.state.tokenFarm.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash', (hash)=>{
      this.setState({loading: false})
          // this.setState(loading => ({ loading: false}))
      // useEffect(()=> {this.setState({loading: false})}, [])
      })    }

//       componentDidUpdate(prevProps){
//    if (this.props.id !== prevProps.id) {
//     this.setState({id: this.props.id});
//   }
// }


  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance: '0',
      loading: true
      //id: 0
    }
  }

  render() {
    let content
    if(this.state.loading){
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main 
        daiTokenBalance = {this.state.daiTokenBalance}
        dappTokenBalance = {this.state.dappTokenBalance}
        stakingBalance = {this.state.stakingBalance}
        stakeTokens = {this.stakeTokens}
        unstakeTokens = {this.unstakeTokens}
        />
    }
    
    
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;