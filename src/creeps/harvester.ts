// Copyright (c) 2018 Tim Perkins

import {Build} from "./tasks/build";
import {Deposit} from "./tasks/deposit";
import {GraveDig} from "./tasks/gravedig";
import {Harvest} from "./tasks/harvest";
import {Pickup} from "./tasks/pickup";
import {Upgrade} from "./tasks/upgrade";
import {Withdraw} from "./tasks/withdraw";
import * as Utils from "./utils";

export class Harvester {
  public static run(creep: Creep): void {
    const fullEnergyThreshold = Utils.getOrSetMemory(creep, "fullEnergyThreshold", () => {
      return Utils.getNoDropEnergyThreshold(creep);
    });
    if (!creep.memory.harvesting && creep.carry.energy === 0) {
      creep.memory.harvesting = true;
      creep.say("Harvest");
    } else if (creep.memory.harvesting && creep.carry.energy >= fullEnergyThreshold) {
      creep.memory.harvesting = false;
      creep.say("Deposit");
    }
    if (!creep.memory.harvesting) {
      Utils.runTasks(creep, [
        GraveDig,
        Pickup,
        Deposit,
        Build,
        Upgrade,
      ]);
    } else {
      Utils.runTasks(creep, [
        GraveDig,
        Pickup,
        Withdraw,
        Harvest,
      ]);
    }
  }
}
