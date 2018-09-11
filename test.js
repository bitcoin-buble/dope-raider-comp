const axios = require("axios");

const accounts = [
  {
    panelMemberName: "Beak",
    raider: "Monday Lunch",
    address: "0x8fe436bD1cD783cdA05107bc11E65872cb57201d"
  },
  {
    panelMemberName: "Ken",
    raider: "Up for it",
    address: "0x14b5B0a5C924a3663EEc0b334f53A39b9Ad15929"
  },
  {
    panelMemberName: "The Prince",
    raider: "Wired some",
    address: "0x0cB461Ba4BE811617d4f08d9a7152d737A8784Ee"
  },
  {
    panelMemberName: "Boobs",
    raider: "Marvin",
    address: "0x7e4662946d776f5157b6c00cfd182ca468642e13"
  },
  {
    panelMemberName: "The burger loving sound guy. Dr P Money",
    raider: "Frieda Lot",
    address: "0x7A2591E097d20Aca41DF19eB6A1e7ae3c78C562a"
  }
];

const start = async () => {
  accounts.forEach(async ({ address, panelMemberName, raider }) => {
    const { data } = await axios.get(
      `https://poaexplorer.com/api/balance/${address}`
    );
    const { balance } = data;
    console.log(`${raider} (${panelMemberName}): ${balance}`);
  });
};

start();
