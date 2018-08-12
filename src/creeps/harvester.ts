// Copyright (c) 2018 Tim Perkins

import {Build} from "./tasks/build";
import {Deposit} from "./tasks/deposit";
import {Harvest} from "./tasks/harvest";
import {Pickup} from "./tasks/pickup";
import {Upgrade} from "./tasks/upgrade";

declare global {
  interface CreepMemory {
    harvesting: boolean;
  }
}

export class Harvester {
  public static run(creep: Creep): void {
    if (!creep.memory.harvesting && creep.carry.energy === 0) {
      creep.memory.harvesting = true;
      creep.say("Harvest");
    } else if (creep.memory.harvesting && creep.carry.energy === creep.carryCapacity) {
      creep.memory.harvesting = false;
      creep.say("Deposit");
    }
    if (!creep.memory.harvesting) {
      if (!Deposit.run(creep)) {
        if (!Build.run(creep)) {
          Upgrade.run(creep);
        }
      }
    } else {
      if (!Pickup.run(creep)) {
        Harvest.run(creep);
      }
    }
  }
}
