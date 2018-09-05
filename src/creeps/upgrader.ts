// Copyright (c) 2018 Tim Perkins

import {GraveDig} from "./tasks/gravedig";
import {Harvest} from "./tasks/harvest";
import {MoveFromMinerSource, MoveFromSource} from "./tasks/movefromsource";
import {Pickup} from "./tasks/pickup";
import {Upgrade} from "./tasks/upgrade";
import {Withdraw} from "./tasks/withdraw";
import * as Utils from "./utils";

export class Upgrader {
  public static run(creep: Creep): void {
    const fullEnergyThreshold = Utils.getOrSetMemory(creep, "fullEnergyThreshold", () => {
      return Utils.getNoDropEnergyThreshold(creep);
    });
    if (creep.memory.upgrading && creep.carry.energy === 0) {
      creep.memory.upgrading = false;
      creep.say("Harvest");
    } else if (!creep.memory.upgrading && creep.carry.energy >= fullEnergyThreshold) {
      creep.memory.upgrading = true;
      creep.say("Upgrade");
    }
    if (creep.memory.upgrading) {
      Utils.runTasks(creep, [
        GraveDig,
        Pickup,
        MoveFromSource,
        MoveFromMinerSource,
        Upgrade,
      ]);
    } else {
      Utils.runTasks(creep, [
        GraveDig,
        Pickup,
        MoveFromMinerSource,
        Withdraw,
        Harvest,
      ]);
    }
  }
}
