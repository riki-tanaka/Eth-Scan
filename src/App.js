import logo from './logo.svg';
import './App.css';
import React from 'react';
import EthereumJsWallet from 'ethereumjs-wallet';
// import ethUtil from 'ethereumjs-util';
import { toBuffer } from 'ethereumjs-util';

var hexValue = "0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b10000000";
var privateKeys = [];
const apiUrl = "https://api.etherscan.io/api?module=account&action=balancemulti&tag=latest&apikey=4Q5U7HNF4CGTVTGEMGRV5ZU9WYNJ6N7YA5&address=";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      items: [],
      page: 1900
    }
  }

  componentDidMount() {
    this.generatePrivateKey();
  }

  componentDidUpdate() {
    if (this.state.isLoaded && this.state.page < 4294967296) {
      this.generatePrivateKey();
    }
  }

  generatePrivateKey() {
    this.setState({
      isLoaded: false
    })
    privateKeys = [];
    let calcValue = hexValue.slice(-8);
    let preValue = hexValue.substring(0, 58);

    for (let i = 0; i < 64; i ++) {
      calcValue = (parseInt(calcValue, 16) + 0x01).toString(16);
      privateKeys.push(preValue + calcValue);
    }
    hexValue = privateKeys[privateKeys.length - 1];
    let params = "";
    privateKeys.forEach((key, index) => {
      const keyBuffer = toBuffer(key);
      const wallet = EthereumJsWallet.fromPrivateKey(keyBuffer);
      
      if (index === 0) {
        params = wallet.getAddressString();
      } else {
        params += "%2C" + wallet.getAddressString();
      }
    });

    const url = apiUrl + params;
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          let newValue = [];
          result.result.forEach((item, idx) => {
            if (parseInt(item.balance, 10) > 0) {
              newValue.push({
                privateKey: privateKeys[idx],
                account: item.account,
                balance: parseInt(item.balance, 10) / Math.pow(10, 18)
              })
            }
          })
          let items = this.state.items;
          if (newValue.length > 0) {
            items.push(...newValue);
            console.log(newValue);
          }
          this.setState({
            isLoaded: true,
            items: items,
            page: this.state.page + 1
          })
        },
        (error) => {
          this.setState({
            isLoaded: true,
            page: this.state.page + 1
          })
        }
      )
      
  }

  walletList() {
    const listItems = this.state.items.map((item) =>
      <li key={item.account}>{item.privateKey}   ::   {item.account}    ::    {item.balance}</li>
    )
    return (
      <ul>{listItems}</ul>
    )
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <p>
            Page: {this.state.page}
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <div>
            {this.walletList()}
          </div>
        </header>
      </div>
    );
  }
  
}

export default App;
