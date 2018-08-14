// Copyright (c) 2018 Tim Perkins

import {Build} from "./tasks/build";
import {Deposit} from "./tasks/deposit";
import {GraveDig} from "./tasks/gravedig";
import {Harvest} from "./tasks/harvest";
import {Pickup} from "./tasks/pickup";
import {Upgrade} from "./tasks/upgrade";
import {Wall} from "./tasks/wall";
import * as Utils from "./utils";

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
      Utils.runTasks(creep, [
        GraveDig,
        Pickup,
        Wall,
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
