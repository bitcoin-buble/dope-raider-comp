import React, { Component } from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";
import narcoABI from "./narcoABI";

import Web3 from "web3";
import { NarcoStateWatch } from "./narcoStateWatch";

// const swarmAddress =
//   "bzzr://c40194589c043fa7eca88783a69dbb2941294b75280945bb6df3cb9eb";

// const web3 = new Web3(Web3.givenProvider);
// const narcoContractAddress = "0x11c4469d974f8af5ba9ec99f3c42c07c848c861c";

// const narcoContract = web3.eth.contract(narcoABI).at(narcoContractAddress);

const accounts = [
  {
    panelMember: "Beak",
    raider: "Monday Lunch",
    address: "0x8fe436bD1cD783cdA05107bc11E65872cb57201d"
  },
  {
    panelMember: "Ken",
    raider: "Up for it",
    address: "0x14b5B0a5C924a3663EEc0b334f53A39b9Ad15929"
  },
  {
    panelMember: "The Prince",
    raider: "Wired some",
    address: "0x0cB461Ba4BE811617d4f08d9a7152d737A8784Ee"
  },
  {
    panelMember: "Boobs",
    raider: "Marvin",
    address: "0x7e4662946d776f5157b6c00cfd182ca468642e13"
  },
  {
    panelMember: "The burger loving sound guy. Dr P Money",
    raider: "Frieda Lot",
    address: "0x7A2591E097d20Aca41DF19eB6A1e7ae3c78C562a"
  }
];

class POAValue extends React.Component {
  state = {
    balance: 0
  };

  componentDidMount = async () => {
    const { address } = this.props;
    const { data } = await axios.get(
      `https://poaexplorer.com/api/balance/${address}`
    );
    const { balance } = data;
    this.setState({
      balance
    });
  };

  render = () => <div>{this.state.balance}</div>;
}

const Contestant = ({ panelMember, raider, address }) => (
  <div>
    <div>{panelMember}</div>
    <div>{raider}</div>
    {/* <POAValue address={address} /> */}
    <div>
      <a href={`https://poaexplorer.com/api/balance/${address}`}>Account</a>
    </div>
  </div>
);

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Dope raider competition</h1>
        </header>
        <ul>
          {accounts.map(props => (
            <Contestant key={props.address} {...props} />
          ))}
        </ul>
        <NarcoStateWatch />
      </div>
    );
  }
}

export default App;
