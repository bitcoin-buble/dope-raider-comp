import Web3 from "web3";

// import { PortisProvider } from "portis";
const isEmpty = require("lodash/isEmpty");

var { web3 } = window;

function getAccounts() {
  try {
    const { web3 } = window;
    // throws if no account selected
    const accounts = web3.eth.accounts;

    return accounts;
  } catch (e) {
    return [];
  }
}

var accounts = getAccounts();

if (isEmpty(accounts)) {
  web3 &&
    web3.eth &&
    web3.eth.getAccounts((err, accounts) => {
      web3 = new Web3(web3.currentProvider);
      addMinedReceipt(web3);
    });
  // addMinedReceipt(web3);
} else {
  web3 = new Web3(web3.currentProvider);
  addMinedReceipt(web3);
}

function addMinedReceipt(web3Object) {
  web3Object.eth.getTransactionReceiptMined = function getTransactionReceiptMined(
    txHash,
    interval
  ) {
    const self = this;
    const transactionReceiptAsync = function(resolve, reject) {
      self.getTransactionReceipt(txHash, (error, receipt) => {
        if (error) {
          reject(error);
        } else if (receipt == null) {
          setTimeout(
            () => transactionReceiptAsync(resolve, reject),
            interval ? interval : 500
          );
        } else {
          resolve(receipt);
        }
      });
    };

    if (Array.isArray(txHash)) {
      return Promise.all(
        txHash.map(oneTxHash =>
          self.getTransactionReceiptMined(oneTxHash, interval)
        )
      );
    } else if (typeof txHash === "string") {
      return new Promise(transactionReceiptAsync);
    } else {
      throw new Error("Invalid Type: " + txHash);
    }
  };
}

export const getWeb3 = function() {
  return web3;
};

var districtsContractABI = [
  {
    constant: true,
    inputs: [{ name: "_narcoId", type: "uint256" }],
    name: "getSkills",
    outputs: [{ name: "narcoSkills", type: "uint16[6]" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "narcoCore",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_narcoId", type: "uint256" },
      { name: "_total", type: "uint16" }
    ],
    name: "updatCokeTotal",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "saleDangerZone",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "travelPrice",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_qty", type: "uint256" }],
    name: "setMinBuyQtyCoke",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_index", type: "uint256" },
      { name: "_name", type: "string" },
      { name: "_hasMarket", type: "bool" }
    ],
    name: "createNamedDistrict",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "coreAddress",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_travellerId", type: "uint256" }],
    name: "getTravelCooldownMax",
    outputs: [{ name: "travelCooldown", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_id", type: "uint256" }],
    name: "getDistrict",
    outputs: [
      { name: "exits", type: "uint256[6]" },
      { name: "hasMarket", type: "bool" },
      { name: "prices", type: "uint256[24]" },
      { name: "isStocked", type: "bool[24]" },
      { name: "weedPot", type: "uint256" },
      { name: "cokePot", type: "uint256" },
      { name: "weedAmountHere", type: "uint256" },
      { name: "cokeAmountHere", type: "uint256" },
      { name: "name", type: "string" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_spread", type: "uint256" }],
    name: "setSpreadPercent",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "uint256" }],
    name: "tokenContractAddresses",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_fee", type: "uint256" }],
    name: "setDevFeePercent",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "unpause",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "devFeePercent",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "withdrawFees",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_index", type: "uint256" },
      { name: "_weedSupply", type: "uint256" },
      { name: "_cokeSupply", type: "uint256" }
    ],
    name: "initializeSupply",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "uint256" }],
    name: "marketItems",
    outputs: [
      { name: "id", type: "uint256" },
      { name: "itemName", type: "string" },
      { name: "skillAffected", type: "uint8" },
      { name: "upgradeAmount", type: "uint8" },
      { name: "levelRequired", type: "uint8" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "minBuyQtyWeed",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_hijackerId", type: "uint256" },
      { name: "_victimId", type: "uint256" }
    ],
    name: "hijack",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_address", type: "address" }],
    name: "setNarcosCoreAddress",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_narcoId", type: "uint256" }],
    name: "getNarcoLocation",
    outputs: [{ name: "location", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "paused",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_narcoId", type: "uint256" },
      { name: "_total", type: "uint16" }
    ],
    name: "updateWeedTotal",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "isDopeRaiderDistrictsCore",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_price", type: "uint256" }],
    name: "setTravelPrice",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "newContractAddress",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_lrp", type: "uint256" }],
    name: "setLocalRevenuPercent",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "hijackPrice",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_v2Address", type: "address" }],
    name: "setNewAddress",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_addresses", type: "address[6]" }],
    name: "setTokenAddresses",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_loc", type: "uint8" }],
    name: "numberOfNarcosByDistrict",
    outputs: [{ name: "number", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_id", type: "uint256" },
      { name: "_skillAffected", type: "uint8" },
      { name: "_upgradeAmount", type: "uint8" },
      { name: "_levelRequired", type: "uint8" },
      { name: "_itemName", type: "string" }
    ],
    name: "configureMarketItem",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "homeDistrictRaiding",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_index", type: "uint256" },
      { name: "_exits", type: "uint256[6]" },
      { name: "_prices", type: "uint256[24]" },
      { name: "_isStocked", type: "bool[24]" }
    ],
    name: "configureDistrict",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_narcoId", type: "uint256" },
      { name: "_exitId", type: "uint256" }
    ],
    name: "travelTo",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "pause",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_narcoId", type: "uint256" },
      { name: "_district", type: "uint8" }
    ],
    name: "setNarcoLocation",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "minBuyQtyCoke",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_narcoId", type: "uint256" },
      { name: "_district", type: "uint256" },
      { name: "_itemIndex", type: "uint256" },
      { name: "_quantity", type: "uint256" }
    ],
    name: "buyItem",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_range", type: "uint256" }],
    name: "setBustRange",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_price", type: "uint256" }],
    name: "setHijackPrice",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_district", type: "uint256" },
      { name: "_splitW", type: "uint8" },
      { name: "_splitC", type: "uint8" }
    ],
    name: "distributeRevenue",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_narcoId", type: "uint256" },
      { name: "_cooldown", type: "uint256" }
    ],
    name: "endCoolDownNow",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_narcoId", type: "uint256" },
      { name: "_district", type: "uint256" },
      { name: "_itemIndex", type: "uint256" },
      { name: "_quantity", type: "uint256" }
    ],
    name: "sellItem",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_price", type: "uint256" }],
    name: "setAirLiftPrice",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "localRevenuePercent",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_qty", type: "uint256" }],
    name: "setMinBuyQtyWeed",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "endCoolDownPrice",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "floatEconony",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_price", type: "uint256" }],
    name: "setEndCooldownNowtPrice",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_loc", type: "uint8" }],
    name: "narcosByDistrict",
    outputs: [{ name: "narcosHere", type: "uint256[]" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_district", type: "uint256" },
      { name: "_quantity", type: "uint256" }
    ],
    name: "increaseDistrictWeed",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "airLiftPrice",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_hijackerId", type: "uint256" }],
    name: "getHijackCooldownMax",
    outputs: [{ name: "hijackCooldown", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_enabled", type: "bool" }],
    name: "setHomeDistrictRaiding",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_narcoId", type: "uint256" },
      { name: "_index", type: "uint256" },
      { name: "_newQuantity", type: "uint8" }
    ],
    name: "updateConsumable",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_narcoId", type: "uint256" }],
    name: "getNarcoHomeLocation",
    outputs: [{ name: "location", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_district", type: "uint256" },
      { name: "_quantity", type: "uint256" }
    ],
    name: "increaseDistrictCoke",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_sdz", type: "uint256" }],
    name: "setSaleDangerZone",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "currentDevFees",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "uint256" }],
    name: "districts",
    outputs: [
      { name: "weedPot", type: "uint256" },
      { name: "weedAmountHere", type: "uint256" },
      { name: "cokePot", type: "uint256" },
      { name: "cokeAmountHere", type: "uint256" },
      { name: "hasMarket", type: "bool" },
      { name: "name", type: "string" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_address", type: "address" }],
    name: "seCalculationsContractAddress",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "spreadPercent",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "bustRange",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "location", type: "uint8" },
      { indexed: true, name: "narcoId", type: "uint256" }
    ],
    name: "NarcoArrived",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "location", type: "uint8" },
      { indexed: true, name: "narcoId", type: "uint256" }
    ],
    name: "NarcoLeft",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "narcoId", type: "uint256" },
      { indexed: false, name: "confiscatedWeed", type: "uint16" },
      { indexed: false, name: "confiscatedCoke", type: "uint16" }
    ],
    name: "TravelBust",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "hijacker", type: "uint256" },
      { indexed: true, name: "victim", type: "uint256" },
      { indexed: false, name: "stolenWeed", type: "uint16" },
      { indexed: false, name: "stolenCoke", type: "uint16" }
    ],
    name: "Hijacked",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "hijacker", type: "uint256" },
      { indexed: true, name: "victim", type: "uint256" }
    ],
    name: "HijackDefended",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "hijacker", type: "uint256" },
      { indexed: true, name: "victim", type: "uint256" },
      { indexed: false, name: "escapeLocation", type: "uint8" }
    ],
    name: "EscapedHijack",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "narcoId", type: "uint256" },
      { indexed: true, name: "amount", type: "uint256" }
    ],
    name: "SaleComplete",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "newContract", type: "address" }],
    name: "ContractUpgrade",
    type: "event"
  },
  { anonymous: false, inputs: [], name: "Pause", type: "event" },
  { anonymous: false, inputs: [], name: "Unpause", type: "event" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "previousOwner", type: "address" },
      { indexed: true, name: "newOwner", type: "address" }
    ],
    name: "OwnershipTransferred",
    type: "event"
  }
];

var narcoContractABI = [
  {
    constant: true,
    inputs: [],
    name: "promoCreatedCount",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_tokenId", type: "uint256" }
    ],
    name: "approve",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "ceoAddress",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_cost", type: "uint256" }],
    name: "setPersonalisationCost",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "implementsERC721",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_narcoId", type: "uint256" }],
    name: "getRemainingCapacity",
    outputs: [{ name: "capacity", type: "uint16" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "districtContractAddress",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_tokenId", type: "uint256" }
    ],
    name: "transferFrom",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_newCEO", type: "address" }],
    name: "setCEO",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "personalisationCost",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_newCOO", type: "address" }],
    name: "setCOO",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_id", type: "uint256" }],
    name: "getNarco",
    outputs: [
      { name: "narcoName", type: "string" },
      { name: "weedTotal", type: "uint256" },
      { name: "cokeTotal", type: "uint256" },
      { name: "skills", type: "uint16[6]" },
      { name: "consumables", type: "uint8[4]" },
      { name: "genes", type: "string" },
      { name: "homeLocation", type: "uint8" },
      { name: "level", type: "uint16" },
      { name: "cooldowns", type: "uint256[6]" },
      { name: "id", type: "uint256" },
      { name: "stats", type: "uint16[9]" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_narcoId", type: "uint256" }],
    name: "growWeed",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_narcoId", type: "uint256" },
      { name: "_startingPrice", type: "uint256" },
      { name: "_endingPrice", type: "uint256" },
      { name: "_duration", type: "uint256" }
    ],
    name: "createSaleAuction",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "unpause",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "gen0CreationLimit",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_address", type: "address" }],
    name: "setDistrictAddress",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_narcoId", type: "uint256" },
      { name: "_genes", type: "string" },
      { name: "_name", type: "string" }
    ],
    name: "updateNarco",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "paused",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "withdrawBalance",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ name: "owner", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_narcoId", type: "uint256" },
      { name: "_genes", type: "string" },
      { name: "_name", type: "string" }
    ],
    name: "recruitNarco",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "newContractAddress",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_address", type: "address" }],
    name: "setSaleAuctionAddress",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "count", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_v2Address", type: "address" }],
    name: "setNewAddress",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_genes", type: "string" },
      { name: "_name", type: "string" }
    ],
    name: "createGen0Auction",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "districtsCore",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "respectRequiredToRecruit",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "changeIdentityNarcoRespect",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_respect", type: "uint256" }],
    name: "setChangeIdentityNarcoRespect",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_genes", type: "string" },
      { name: "_name", type: "string" },
      { name: "_owner", type: "address" }
    ],
    name: "createPromoNarco",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "pause",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_narcoId", type: "uint256" }],
    name: "getLevel",
    outputs: [{ name: "rank", type: "uint16" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_narcoId", type: "uint256" },
      { name: "_index", type: "uint256" },
      { name: "_new", type: "uint256" }
    ],
    name: "setCooldown",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_narcoId", type: "uint256" }],
    name: "refineCoke",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_narcoId", type: "uint256" },
      { name: "_add", type: "bool" },
      { name: "_total", type: "uint16" }
    ],
    name: "updateCokeTotal",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "withdrawAuctionBalances",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_cost", type: "uint256" }],
    name: "setGrowCost",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "refineCost",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_tokenId", type: "uint256" }
    ],
    name: "transfer",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "gen0EndingPrice",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "gen0StartingPrice",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "cooAddress",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "promoCreationLimit",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "gamePaused",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "uint256" }],
    name: "narcoIndexToApproved",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_respect", type: "uint256" }],
    name: "setRespectRequiredToRecruit",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_narcoId", type: "uint256" },
      { name: "_index", type: "uint256" },
      { name: "_new", type: "uint8" }
    ],
    name: "updateConsumable",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_narcoId", type: "uint256" },
      { name: "_index", type: "uint256" },
      { name: "_new", type: "uint16" }
    ],
    name: "updateSkill",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_id", type: "uint256" },
      { name: "_narcoName", type: "string" },
      { name: "_weedTotal", type: "uint16" },
      { name: "_cokeTotal", type: "uint16" },
      { name: "_skills", type: "uint16[6]" },
      { name: "_consumables", type: "uint8[4]" },
      { name: "_genes", type: "string" },
      { name: "_homeLocation", type: "uint8" },
      { name: "_stats", type: "uint16[9]" },
      { name: "_recoveryAddress", type: "address" }
    ],
    name: "recoverNarco",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "growCost",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "saleAuction",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_narcoId", type: "uint256" },
      { name: "_add", type: "bool" },
      { name: "_total", type: "uint16" }
    ],
    name: "updateWeedTotal",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "gen0AuctionDuration",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "gen0CreatedCount",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_cost", type: "uint256" }],
    name: "setRefineCost",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "narcosByOwner",
    outputs: [{ name: "ownedNarcos", type: "uint256[]" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_narcoId", type: "uint256" },
      { name: "_index", type: "uint256" }
    ],
    name: "incrementStat",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "uint256" }],
    name: "narcoIndexToOwner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  { payable: true, stateMutability: "payable", type: "fallback" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "narcoId", type: "uint256" },
      { indexed: false, name: "yield", type: "uint256" }
    ],
    name: "GrowWeedCompleted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "narcoId", type: "uint256" },
      { indexed: false, name: "yield", type: "uint256" }
    ],
    name: "RefineCokeCompleted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "owner", type: "address" },
      { indexed: true, name: "approved", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "owner", type: "address" },
      { indexed: false, name: "narcoId", type: "uint256" },
      { indexed: false, name: "genes", type: "string" }
    ],
    name: "NarcoCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "newContract", type: "address" }],
    name: "ContractUpgrade",
    type: "event"
  }
];

var saleAuctionContractABI = [
  {
    constant: false,
    inputs: [
      { name: "_nftAddr", type: "address" },
      { name: "_cut", type: "uint256" }
    ],
    name: "configureSaleClockAuction",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_tokenId", type: "uint256" },
      { name: "_startingPrice", type: "uint256" },
      { name: "_endingPrice", type: "uint256" },
      { name: "_duration", type: "uint256" },
      { name: "_seller", type: "address" }
    ],
    name: "createAuction",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "unpause",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_tokenId", type: "uint256" }],
    name: "bid",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "uint256" }],
    name: "lastGen0SalePrices",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "paused",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "withdrawBalance",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_tokenId", type: "uint256" }],
    name: "getAuction",
    outputs: [
      { name: "seller", type: "address" },
      { name: "startingPrice", type: "uint256" },
      { name: "endingPrice", type: "uint256" },
      { name: "duration", type: "uint256" },
      { name: "startedAt", type: "uint256" },
      { name: "tokenId", type: "uint256" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "ownerCut",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "pause",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "isSaleClockAuction",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_tokenId", type: "uint256" }],
    name: "cancelAuctionWhenPaused",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "gen0SaleCount",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_tokenId", type: "uint256" }],
    name: "cancelAuction",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_tokenId", type: "uint256" }],
    name: "getCurrentPrice",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "nonFungibleContract",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "averageGen0SalePrice",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  { payable: false, stateMutability: "nonpayable", type: "fallback" },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "tokenId", type: "uint256" },
      { indexed: false, name: "startingPrice", type: "uint256" },
      { indexed: false, name: "endingPrice", type: "uint256" },
      { indexed: false, name: "duration", type: "uint256" }
    ],
    name: "AuctionCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "tokenId", type: "uint256" },
      { indexed: false, name: "totalPrice", type: "uint256" },
      { indexed: false, name: "winner", type: "address" }
    ],
    name: "AuctionSuccessful",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "tokenId", type: "uint256" }],
    name: "AuctionCancelled",
    type: "event"
  },
  { anonymous: false, inputs: [], name: "Pause", type: "event" },
  { anonymous: false, inputs: [], name: "Unpause", type: "event" }
];

// main ethereum network
/*
var mainDistrictsContractAddress = "0x0fe67385579c144d45b9c2d309b711e988cde705";
var mainNarcoContractAddress = "0x3bcbd2093e991363b98cf0f51d40fecd94a55a0d";
var mainSaleAuctionContractAddress = "0xd43e3a7c85fc6bfd8bc56db92dbe9b9675cd245a";

/* beta 2 ropsten*/
/*
var testDistrictsContractAddress = "0xb10e03d04b94c4162c086d1e135121e90c447a2a";
var testNarcoContractAddress = "0xa8ed995dab657c4316b3b742ba13f06bcfa859ae";
var testSaleAuctionContractAddress = "0x35e8be3f377f38800bb801f2169bbd69f691133f";

// testSokol  network
//var testSokolDistrictsContractAddress = "0xa952d023037cdbf48d5ffe58fbbf9f87bb59d54c";
//var testSokolDistrictsContractAddress = "0x70d0778428ada4f651302cdbf5886f49ed4e3d35";
//var testSokolDistrictsContractAddress = "0x7b592ceba1233df33a7ca54f4756f5609a21dca1";

var testSokolDistrictsContractAddress = "0x8c784002d1e69c9f5aff54ada961957402b9a28b";


var testSokolNarcoContractAddress = "0xf352f6842c204c63db93d1b6363e2e6876750dd1";
var testSokolSaleAuctionContractAddress = "0x050f6e908d1d720593468720555472e31a3be0c7";
*/
// poa main network

// 3rd districts contract address
//var poaDistrictsContractAddress = "0xd783b6d118d7831ae048e8588019c3a590f0e4bf";

// 4th districts contract
var poaDistrictsContractAddress = "0x79f8ac29df70825e31d953acefbbf78a8272e0cd";
// live narcos address
var poalNarcoContractAddress = "0x11c4469d974f8af5ba9ec99f3c42c07c848c861c";
var poaSaleAuctionContractAddress =
  "0xf69d56a21fc0f8670b108ad535cc96e49ba8d3d2";

//console.log("NETWORK IS: " + web3.version.network);

export const saleAuctionContractAddress = function() {
  /*
 if (web3.version.network==1) return mainSaleAuctionContractAddress;
 if (web3.version.network==3) return testSaleAuctionContractAddress;
 if (web3.version.network==77)  return testSokolSaleAuctionContractAddress;
 if (web3.version.network==99)  */
  return poaSaleAuctionContractAddress;
};

export const districtsCoreContractInstance = function() {
  /*
 if (web3.version.network==1) return web3.eth.contract(districtsContractABI).at(mainDistrictsContractAddress);
 if (web3.version.network==3) return web3.eth.contract(districtsContractABI).at(testDistrictsContractAddress);
 if (web3.version.network==77)  return web3.eth.contract(districtsContractABI).at(testSokolDistrictsContractAddress);
 if (web3.version.network==99)  ;
*/
  return web3.eth
    .contract(districtsContractABI)
    .at(poaDistrictsContractAddress);
};
export const narcoCoreContractInstance = function() {
  /*
 if (web3.version.network==1) return web3.eth.contract(narcoContractABI).at(mainNarcoContractAddress);
 if (web3.version.network==3) return web3.eth.contract(narcoContractABI).at(testNarcoContractAddress);
 if (web3.version.network==77)  return web3.eth.contract(narcoContractABI).at(testSokolNarcoContractAddress);
 if (web3.version.network==99);*/
  return web3.eth.contract(narcoContractABI).at(poalNarcoContractAddress);
};
export const saleAuctionContractInstance = function() {
  /*
 if (web3.version.network==1) return web3.eth.contract(saleAuctionContractABI).at(mainSaleAuctionContractAddress);
 if (web3.version.network==3) return web3.eth.contract(saleAuctionContractABI).at(testSaleAuctionContractAddress);
 if (web3.version.network==77)  return web3.eth.contract(saleAuctionContractABI).at(testSokolSaleAuctionContractAddress);
 if (web3.version.network==99);
 */
  return web3.eth
    .contract(saleAuctionContractABI)
    .at(poaSaleAuctionContractAddress);
};

var tokenContractABI = [
  {
    constant: true,
    inputs: [],
    name: "narcoCore",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "spender", type: "address" },
      { name: "tokens", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "coreAddress",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "districtContractAddress",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "tokens", type: "uint256" }
    ],
    name: "transferFrom",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_address", type: "address" }],
    name: "setDistrictAddress",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_address", type: "address" }],
    name: "setNarcosCoreAddress",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_district", type: "uint256" }],
    name: "setRedeemDistrict",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "tokenOwner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_narcoId", type: "uint256" },
      { name: "_quantity", type: "uint8" }
    ],
    name: "redeemToken",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "districtsCore",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_id", type: "uint256" }],
    name: "passthrough",
    outputs: [
      { name: "narcoName", type: "string" },
      { name: "location", type: "uint256" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_recipient", type: "address[]" },
      { name: "_quantity", type: "uint256" }
    ],
    name: "airdropTokens",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "to", type: "address" },
      { name: "tokens", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "spender", type: "address" },
      { name: "tokens", type: "uint256" },
      { name: "data", type: "bytes" }
    ],
    name: "approveAndCall",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "newOwner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "tokenAddress", type: "address" },
      { name: "tokens", type: "uint256" }
    ],
    name: "transferAnyERC20Token",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "tokenOwner", type: "address" },
      { name: "spender", type: "address" }
    ],
    name: "allowance",
    outputs: [{ name: "remaining", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  { payable: true, stateMutability: "payable", type: "fallback" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_from", type: "address" },
      { indexed: true, name: "_to", type: "address" }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "tokens", type: "uint256" }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "tokenOwner", type: "address" },
      { indexed: true, name: "spender", type: "address" },
      { indexed: false, name: "tokens", type: "uint256" }
    ],
    name: "Approval",
    type: "event"
  }
];

var contractAddress = [];
contractAddress["SEEDS"] = "0xc03cc67f7f3fb44a81798b02aac2c5a31aac8189";
contractAddress["CHEMICALS"] = "0xfcb4659aaf75a4610ae495ddb1b08bb13f38ea9f";
contractAddress["AMMO"] = "0xde39aa195b8fb3ef9d4d48196ca598a29d192848";
contractAddress["GAS"] = "0xcf6b915ddc56a3e3c2fb11346f01b7980f85e20c";
contractAddress["WEED"] = "0x35f9437b3d5d5c9d81b5c0c456d189098ed026a1";
contractAddress["COKE"] = "0x9ad42450ce3510b05a0ab294c4aa1ee9a0ce66c7";

var testSokolContractAddress = [];
testSokolContractAddress["SEEDS"] =
  "0x811cd6a3a7cd9a7c93d013b3a45cb3423ae9b846";
testSokolContractAddress["CHEMICALS"] =
  "0x811cd6a3a7cd9a7c93d013b3a45cb3423ae9b846";
testSokolContractAddress["AMMO"] = "0x811cd6a3a7cd9a7c93d013b3a45cb3423ae9b846";
testSokolContractAddress["GAS"] = "0x811cd6a3a7cd9a7c93d013b3a45cb3423ae9b846";
testSokolContractAddress["WEED"] = "0x811cd6a3a7cd9a7c93d013b3a45cb3423ae9b846";
testSokolContractAddress["COKE"] = "0x811cd6a3a7cd9a7c93d013b3a45cb3423ae9b846";

export var tokenContract = contractAddress;
export var tokenContractABI = tokenContractABI;

export const tokenContractInstance = function(tokenType) {
  return web3.eth.contract(tokenContractABI).at(contractAddress[tokenType]);
  /*
 if (web3.version.network==99)
 if (web3.version.network==77)  return web3.eth.contract(tokenContractABI).at(testSokolContractAddress[tokenType]);
*/
};

// WEBPACK FOOTER //
// ./src/contracts/Contracts.js
