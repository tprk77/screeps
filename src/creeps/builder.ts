// Copyright (c) 2018 Tim Perkins

import {Build} from "./tasks/build";
import {Deposit} from "./tasks/deposit";
import {GraveDig} from "./tasks/gravedig";
import {Harvest} from "./tasks/harvest";
import {MoveFromMinerSource, MoveFromSource} from "./tasks/movefromsource";
import {MoveToFlagRoom} from "./tasks/movetoflag";
import {Pickup} from "./tasks/pickup";
import {Upgrade} from "./tasks/upgrade";
import {Withdraw} from "./tasks/withdraw";
import * as Utils from "./utils";

export class Builder {
  public static run(creep: Creep): void {
    const fullEnergyThreshold = Utils.getOrSetMemory(creep, "fullEnergyThreshold", () => {
      return Utils.getNoDropEnergyThreshold(creep);
    });
    if (creep.memory.building && creep.carry.energy === 0) {
      creep.memory.building = false;
      creep.say("Harvest");
    } else if (!creep.memory.building && creep.carry.energy >= fullEnergyThreshold) {
      creep.memory.building = true;
      creep.say("Build");
    }
    const flag = Game.flags[creep.memory.buildFlagName];
    if (creep.memory.building) {
      Utils.runTasks(creep, [
        GraveDig,
        Pickup,
        MoveFromSource,
        MoveFromMinerSource,
        MoveToFlagRoom.forFlag(flag),
        Build,
        Deposit,
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
