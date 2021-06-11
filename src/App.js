import logo from './logo.svg';
import './App.css';
import React from 'react';
import EthereumJsWallet from 'ethereumjs-wallet';
import { toBuffer } from 'ethereumjs-util';
import { ACCOUNTS } from './config';

var hexValue = "0x7110bc372dbaea7199236a1e6720bbbecbafd22d5af9ccbe569a861fb3ae65a2";
const MAX_PAGE = 1000000
const accounts = ACCOUNTS.map(str => str.toLowerCase())

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: hexValue,
      result: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.randomKey = this.randomKey.bind(this);
    this.generatePrivateKey = this.generatePrivateKey.bind(this);
  }

  componentDidMount() {
    this.randomKey()
  }

  handleChange(event) {
    console.log("handleChange")
    hexValue = event.target.value.toLowerCase();
    this.setState({ value: hexValue })
  }

  handleSubmit(event) {
    this.generatePrivateKey();
    event.preventDefault();
  }

  randomKey() {
    const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    hexValue = "0x" + genRanHex(64);
    this.setState({ value: hexValue });
  }

  generatePrivateKey() {

    let isBreak = false;
    for (let k = 0; k < MAX_PAGE; k ++) {
      let calcValue = hexValue.slice(-8);
      let preValue = hexValue.substring(0, 58);
      if (isBreak) {
        console.log("break:::")
        break;
      }
      console.log(`Page: ${k}, hexValue: ${hexValue}`)
      for (let i = 0; i < 4096; i ++) {
        calcValue = (parseInt(calcValue, 16) + 0x01).toString(16);
        const key = preValue + calcValue;
        const keyBuffer = toBuffer(key);
        const wallet = EthereumJsWallet.fromPrivateKey(keyBuffer);
        
        if (accounts.includes(wallet.getAddressString())) {
          console.log(key + "  ::  " + wallet.getAddressString());
          this.setState({
            result: key + "  ::  " + wallet.getAddressString()
          })
          isBreak = true;
          break;
        }
  
        if (i === 4095) {
          hexValue = key;
        }
      }
    }
    
      
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <form>
            <input type="text" style={{width: 500}} value={this.state.value} onChange={this.handleChange} />
            <button onClick={this.randomKey}>Random Private Key</button>
            <br/>
            <button onClick={this.handleSubmit}>Start</button>
          </form>
          <p>
            Result: {this.state.result}
          </p>
        </header>
      </div>
    );
  }
  
}

export default App;
