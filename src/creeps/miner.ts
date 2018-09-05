// Copyright (c) 2018 Tim Perkins

import {GraveDig} from "./tasks/gravedig";
import {Harvest} from "./tasks/harvest";
import {Pickup} from "./tasks/pickup";
import {StoreInNearbyContainer} from "./tasks/store";
import {Upgrade} from "./tasks/upgrade";
import {Withdraw} from "./tasks/withdraw";
import * as Utils from "./utils";

export class Miner {
  /**
   * Miners are like Harvesters, but instead of distributing their energy all over the room, they
   * only place their energy in nearby containers. They might hog the spot in front of the source,
   * but other creeps can just withdraw energy from the container. Miner creeps should have plenty
   * of WORK parts, but don't need many CARRY or MOVE parts.
   */
  public static run(creep: Creep): void {
    if (!creep.memory.harvesting && creep.carry.energy === 0) {
      creep.memory.harvesting = true;
      creep.say("Harvest");
    } else if (creep.memory.harvesting && creep.carry.energy === creep.carryCapacity) {
      creep.memory.harvesting = false;
      creep.say("Deposit");
    }
    if (!creep.memory.harvesting) {
      Utils.runTasks(creep, [
        StoreInNearbyContainer,
      ]);
    } else {
      Utils.runTasks(creep, [
        Harvest,
      ]);
    }
  }
}