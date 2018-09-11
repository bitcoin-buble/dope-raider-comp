import React, { Component } from "react";
import {
  narcoCoreContractInstance,
  districtsCoreContractInstance,
  getWeb3
} from "./contracts";
// import SkyLight from "react-skylight";

import districtItems from "./items";

function formatSeconds(sec) {
  return [sec / 3600, (sec % 3600) / 60, (sec % 3600) % 60]
    .map(v => (v < 10 ? "0" + parseInt(v) : parseInt(v)))
    .filter((i, j) => i !== "00" || j > 0)
    .join(":");
}

// these function must be aligned with the contract calculations
// returns % complete of cooldown (100%  = available)
function getTravelCooldownProgress(cooldownTime, speedSkill) {
  //narcoCore.setCooldown( _narcoId ,  0 , now + (455-(5*narcoSkills[0])* 1 seconds));

  cooldownTime = cooldownTime + 5; // sometimes it's awry the timing

  var currentSecond = Date.now() / 1000;
  var maxCooldownPeriod = 455 - 5 * speedSkill;
  var cooldownRemaining = Math.max(cooldownTime - currentSecond, 0);
  var coolDownProgress =
    ((maxCooldownPeriod - cooldownRemaining) / maxCooldownPeriod) * 100;
  return parseInt(Math.max(0, coolDownProgress));
}
function getGrowCooldownProgress(cooldownTime, growSkill) {
  //uint256 cooldown = now + ((168-(2*growSkillLevel))* 1 seconds); //calculate cooldown switch to minutes later
  cooldownTime = cooldownTime + 5; // sometimes it's awry the timing

  var currentSecond = Date.now() / 1000;
  var maxCooldownPeriod = 955 - 10 * growSkill;
  var cooldownRemaining = Math.max(cooldownTime - currentSecond, 0);
  var coolDownProgress =
    ((maxCooldownPeriod - cooldownRemaining) / maxCooldownPeriod) * 100;
  //   console.log(coolDownProgress);

  return parseInt(Math.max(0, coolDownProgress));
}
function getRefineCooldownProgress(cooldownTime, refineSkill) {
  // uint256 cooldown = now + ((168-(2*refineSkillLevel))* 1 seconds); // calculate cooldown
  cooldownTime = cooldownTime + 5; // sometimes it's awry the timing

  var currentSecond = Date.now() / 1000;
  var maxCooldownPeriod = 955 - 10 * refineSkill;
  var cooldownRemaining = Math.max(cooldownTime - currentSecond, 0);
  var coolDownProgress =
    ((maxCooldownPeriod - cooldownRemaining) / maxCooldownPeriod) * 100;
  return parseInt(Math.max(0, coolDownProgress));
}
function getAttackCooldownProgress(cooldownTime, attackSkill) {
  //  narcoCore.setCooldown( _hijackerId ,  3 , now + (455-(5*hijackerSkills[3])* 1 seconds));
  cooldownTime = cooldownTime + 5; // sometimes it's awry the timing

  var currentSecond = Date.now() / 1000;
  var maxCooldownPeriod = 455 - 5 * attackSkill;
  var cooldownRemaining = Math.max(cooldownTime - currentSecond, 0);
  var coolDownProgress =
    ((maxCooldownPeriod - cooldownRemaining) / maxCooldownPeriod) * 100;
  return parseInt(Math.max(0, coolDownProgress));
}

function skillsToPurchasedItems(skills) {
  var purchasedItems = [];
  for (var s = 0; s < districtItems.length; s++) {
    if (
      s < 6 ||
      parseInt(narco.skills[districtItems[s].skillNumber]) <
        districtItems[s].upgrade ||
      (districtItems[s].skillNumber == 5 &&
        parseInt(skills[5]) < 20 + districtItems[s].upgrade)
    ) {
      // purchased  == false
      purchasedItems.push(false);
    } else {
      // purchased  == true
      purchasedItems.push(true);
    }
  }
  return purchasedItems;
}

export var narco = {
  id: 10,
  genes: "",
  currentDistrict: 0,
  destinationDistrict: 1,
  focusedDistrict: 0,
  isTravelling: false,
  isHijacking: false,
  isGrowing: false,
  isProcessing: false,
  isSelling: false,
  isBuying: false,
  isBusy: false,
  chemicals: 0,
  ammo: 0,
  seeds: 0,
  gas: 0,
  remainingCapacity: 0,
  focusedNarco: -1
  // timesChecked: 0
};

export var focusedNarco = {
  id: -1,
  genes: "",
  chemicals: 0,
  ammo: 0,
  seeds: 0,
  gas: 0
};

export var growCost = 10;
export var refineCost = 15;

export class NarcoStateWatch extends Component {
  static currentNarcoId = 0;
  static narco = narco;

  static gamePaused = false;

  constructor(props) {
    super(props);
    this.state = {
      narco: narco
    };
  }

  componentWillMount() {
    NarcoStateWatch.instance = this;
    this.updateState();
    // frequently update the state
    setInterval(this.updateState.bind(this), 3000);
  }

  updateState() {
    //  console.log("NarcoStateWatch: Polling narco state in contract...");
    var web3 = getWeb3();

    narcoCoreContractInstance().gamePaused((err, result) => {
      if (result == true) {
        NarcoStateWatch.gamePaused = true;
        NarcoStateWatch.instance.pausedDialog.show();
      }

      if (result == false) {
        NarcoStateWatch.gamePaused = false;
        // NarcoStateWatch.instance.pausedDialog.hide();
      }
    });

    narcoCoreContractInstance().growCost((err, result) => {
      if (result != null) {
        growCost = parseFloat(web3.fromWei(result));
      }
    });

    narcoCoreContractInstance().refineCost((err, result) => {
      if (result != null) {
        refineCost = parseFloat(web3.fromWei(result));
      }
    });

    districtsCoreContractInstance().getNarcoLocation(
      NarcoStateWatch.currentNarcoId,
      (err, result) => {
        if (result != null && result != narco.currentDistrict) {
          if (narco.isTravelling == true || narco.currentDistrict == 0) {
            narco.currentDistrict = parseInt(result);
            narco.isTravelling == false;
          }
          //console.log("setting current district: " + narco.currentDistrict);
        }
      }
    );

    narcoCoreContractInstance().getRemainingCapacity(
      NarcoStateWatch.currentNarcoId,
      (err, result) => {
        if (result != null && result != narco.remainingCapacity) {
          narco.remainingCapacity = parseInt(result);
          // console.log("setting remaining capacity: " + narco.remainingCapacity);
        }
      }
    );

    narcoCoreContractInstance().getNarco(
      NarcoStateWatch.currentNarcoId,
      (err, result) => {
        //   console.log(result);

        if (result != null) {
          var skills = result[3];
          var consumableItems = result[4];
          var cools = result[8];
          var currentSecond = Date.now() / 1000;
          var travelCool = 0;
          if (parseInt(cools[0]) > currentSecond) {
            travelCool = formatSeconds(parseInt(cools[0]) - currentSecond);
          }
          var growCool = 0;
          if (parseInt(cools[1]) > currentSecond) {
            growCool = formatSeconds(parseInt(cools[1]) - currentSecond);
          }
          var refineCool = 0;
          if (parseInt(cools[2]) > currentSecond) {
            refineCool = formatSeconds(parseInt(cools[2]) - currentSecond);
          }
          var attackCool = 0;
          if (parseInt(cools[3]) > currentSecond) {
            attackCool = formatSeconds(parseInt(cools[3]) - currentSecond);
          }

          /*
                    // stat indexes
                    uint constant dealsCompleted = 0; // dealsCompleted
                    uint constant weedGrowCompleted = 1; // weedGrowCompleted
                    uint constant cokeRefineCompleted = 2; // refineCompleted
                    uint constant attacksSucceeded = 3; // attacksSucceeded
                    uint constant defendedSuccessfully = 4; defendedSuccessfully
                    uint constant raidsCompleted = 5; // raidsCompleted
                    uint constant escapeHijack = 6; // escapeHijack
                    uint constant travellCompleted = 7; // travel completed
                    */
          var stats = result[10];
          //        console.log("Narco genes:" + result[5]);
          narco.skills = skills;

          narco.purchasedItems = skillsToPurchasedItems(skills);
          //  console.log(narco.purchasedItems);

          narco.id = NarcoStateWatch.currentNarcoId;
          narco.name = result[0];
          narco.weedTotal = parseInt(result[1]);
          narco.cokeTotal = parseInt(result[2]);
          narco.speed = parseInt(skills[0]);
          narco.grow = parseInt(skills[1]);
          narco.refine = parseInt(skills[2]);
          narco.attack = parseInt(skills[3]);
          narco.defense = parseInt(skills[4]);
          narco.carry = parseInt(skills[5]);
          narco.gas = parseInt(consumableItems[0]);
          narco.seeds = parseInt(consumableItems[1]);
          narco.chemicals = parseInt(consumableItems[2]);
          narco.ammo = parseInt(consumableItems[3]);
          narco.genes = result[5];
          narco.homeLocation = parseInt(result[6]);

          var newNarcoLevel = parseInt(result[7]);

          if (newNarcoLevel > narco.level) {
            narco.level = newNarcoLevel;
            {
              NarcoStateWatch.instance.narcoStateDialogText = (
                <div class="mx-auto my-auto">
                  <div class="title mx-auto">
                    Congratulations! You are now level {narco.level}
                  </div>

                  <div
                    class="btn btn-success mx-auto mt-5 title"
                    onClick={() => {
                      NarcoStateWatch.instance.stateDialog.hide();
                    }}
                  >
                    OK!
                  </div>
                </div>
              );
            }
            NarcoStateWatch.instance.stateDialog.show();
          } else {
            narco.level = parseInt(result[7]);
          }

          narco.travelCooldown = parseInt(cools[0]);
          narco.travelCooldownProgress = getTravelCooldownProgress(
            parseInt(cools[0]),
            narco.speed
          );
          narco.growCooldown = growCool;
          narco.growCooldownProgress = getGrowCooldownProgress(
            parseInt(cools[1]),
            narco.grow
          );
          narco.refineCooldown = refineCool;
          narco.refineCooldownProgress = getRefineCooldownProgress(
            parseInt(cools[2]),
            narco.refine
          );
          narco.attackCooldown = attackCool;
          narco.attackCooldownProgress = getAttackCooldownProgress(
            parseInt(cools[3]),
            narco.attack
          );
          narco.dealsCompleted = parseInt(stats[0]);
          narco.grows = parseInt(stats[1]);
          narco.refines = parseInt(stats[2]);
          narco.hijacks = parseInt(stats[3]);
          narco.defendedSuccessfully = parseInt(stats[4]);
          narco.raidsCompleted = parseInt(stats[5]);
          narco.escapes = parseInt(stats[6]);
          narco.traveller = parseInt(stats[7]);
          //      console.log(narco);
        } // end result
      }
    );

    /* FOCUSED NARCO FOR HIJACKING */

    if (narco.focusedNarco != -1) {
      narcoCoreContractInstance().getNarco(
        narco.focusedNarco,
        (err, result) => {
          //   console.log(result);

          if (result != null) {
            var skills = result[3];
            var consumableItems = result[4];
            var cools = result[8];
            var currentSecond = Date.now() / 1000;

            var stats = result[10];
            //        console.log("Narco genes:" + result[5]);
            focusedNarco.id = narco.focusedNarco;
            focusedNarco.name = result[0];
            focusedNarco.weedTotal = parseInt(result[1]);
            focusedNarco.cokeTotal = parseInt(result[2]);
            focusedNarco.speed = parseInt(skills[0]);
            focusedNarco.grow = parseInt(skills[1]);
            focusedNarco.refine = parseInt(skills[2]);
            focusedNarco.attack = parseInt(skills[3]);
            focusedNarco.defense = parseInt(skills[4]);
            focusedNarco.carry = parseInt(skills[5]);
            focusedNarco.gas = parseInt(consumableItems[0]);
            focusedNarco.seeds = parseInt(consumableItems[1]);
            focusedNarco.chemicals = parseInt(consumableItems[2]);
            focusedNarco.ammo = parseInt(consumableItems[3]);
            focusedNarco.genes = result[5];
            focusedNarco.homeLocation = parseInt(result[6]);
            focusedNarco.level = parseInt(result[7]);
          } // end result
        }
      );
    } // end if fetching focused narco

    // narco.timesChecked++;
    //  NarcoStateWatch.narco = narco;
    //  console.log(narco);
    //console.log(narco.travelCooldownProgress);
  }

  static instance = null;

  render() {
    var narcoStateDialogStyle = {
      backgroundColor: "#606060",
      color: "#ffffff",
      textAlign: "center",
      width: "50%",
      height: "10%",
      minHeight: "250px",
      padding: "35px",
      borderRadius: "5px",
      boxShadow:
        "0 0 0 2px #000, 0 0 0 10px rgba(96, 96, 96, 0.9), 0 0 0 12px #000"
    };

    var gamePausedDialogStyle = {
      backgroundColor: "#000000",
      color: "#cccccc",
      textAlign: "center",
      width: "50%",
      height: "10%",
      minHeight: "400px",
      padding: "35px",
      borderRadius: "5px",
      boxShadow:
        "0 0 0 2px #000, 0 0 0 10px rgba(96, 96, 96, 0.9), 0 0 0 12px #000"
    };

    var noCloseButtonStyle = {
      visibility: "hidden"
    };

    return <span>hello</span>;
  }
}

export default NarcoStateWatch;

// WEBPACK FOOTER //
// ./src/contracts/NarcoStateWatch.js
