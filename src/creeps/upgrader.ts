// Copyright (c) 2018 Tim Perkins

import {Harvest} from "./tasks/harvest";
import {Pickup} from "./tasks/pickup";
import {Upgrade} from "./tasks/upgrade";

declare global {
  interface CreepMemory {
    upgrading: boolean;
  }
}

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
      Upgrade.run(creep);
    } else {
      if (!Pickup.run(creep)) {
        Harvest.run(creep);
      }
    }
  }
}
