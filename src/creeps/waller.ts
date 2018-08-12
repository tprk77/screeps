// Copyright (c) 2018 Tim Perkins

import {Build} from "./tasks/build";
import {Deposit} from "./tasks/deposit";
import {Harvest} from "./tasks/harvest";
import {Pickup} from "./tasks/pickup";
import {Upgrade} from "./tasks/upgrade";
import {Wall} from "./tasks/wall";

declare global {
  interface CreepMemory {
    walling: boolean;
  }
}

export class Waller {
  public static WALL_GROUP_HITS = [1000, 5000, 10000, 50000, 100000];
  public static WALL_MAX_HITS = _.last(Waller.WALL_GROUP_HITS);

  public static run(creep: Creep): void {
    if (creep.memory.walling && creep.carry.energy === 0) {
      creep.memory.walling = false;
      creep.say("Harvest");
    } else if (!creep.memory.walling && creep.carry.energy === creep.carryCapacity) {
      creep.memory.walling = true;
      creep.say("Walling");
    }
    if (creep.memory.walling) {
      if (!Wall.run(creep)) {
        if (!Build.run(creep)) {
          if (!Deposit.run(creep)) {
            Upgrade.run(creep);
          }
        }
      }
    } else {
      if (!Pickup.run(creep)) {
        Harvest.run(creep);
      }
    }
  }
}
