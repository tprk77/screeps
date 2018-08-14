// Copyright (c) 2018 Tim Perkins

import {GraveDig} from "./tasks/gravedig";
import {Harvest} from "./tasks/harvest";
import {Pickup} from "./tasks/pickup";
import {Upgrade} from "./tasks/upgrade";
import * as Utils from "./utils";

export class Upgrader {
  public static run(creep: Creep): void {
    if (creep.memory.upgrading && creep.carry.energy === 0) {
      creep.memory.upgrading = false;
      creep.say("Harvest");
    } else if (!creep.memory.upgrading && creep.carry.energy === creep.carryCapacity) {
      creep.memory.upgrading = true;
      creep.say("Upgrade");
    }
    if (creep.memory.upgrading) {
      Utils.runTasks(creep, [
        GraveDig,
        Pickup,
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
