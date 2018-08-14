// Copyright (c) 2018 Tim Perkins

import {Build} from "./tasks/build";
import {Deposit} from "./tasks/deposit";
import {GraveDig} from "./tasks/gravedig";
import {Harvest} from "./tasks/harvest";
import {Pickup} from "./tasks/pickup";
import {Upgrade} from "./tasks/upgrade";
import * as Utils from "./utils";

export class Builder {
  public static run(creep: Creep): void {
    if (creep.memory.building && creep.carry.energy === 0) {
      creep.memory.building = false;
      creep.say("Harvest");
    } else if (!creep.memory.building && creep.carry.energy === creep.carryCapacity) {
      creep.memory.building = true;
      creep.say("Build");
    }
    if (creep.memory.building) {
      Utils.runTasks(creep, [
        GraveDig,
        Pickup,
        Build,
        Deposit,
        Upgrade,
      ]);
    } else {
      Utils.runTasks(creep, [
        GraveDig,
        Pickup,
        Harvest,
      ]);
    }
  }
}
