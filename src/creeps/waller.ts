// Copyright (c) 2018 Tim Perkins

import {getOrInitialize} from "../utils/common";

import {Build} from "./tasks/build";
import {Deposit} from "./tasks/deposit";
import {GraveDig} from "./tasks/gravedig";
import {Harvest} from "./tasks/harvest";
import {MoveFromMinerSource, MoveFromSource} from "./tasks/movefromsource";
import {Pickup} from "./tasks/pickup";
import {Return} from "./tasks/return";
import {Upgrade} from "./tasks/upgrade";
import {Wall} from "./tasks/wall";
import {WithdrawFromContainer, WithdrawFromStorage} from "./tasks/withdraw";
import * as Utils from "./utils";

export class Waller {

  public static readonly ROLE_NAME = "waller";
  public static readonly PART_TEMPLATE = [CARRY, WORK, MOVE];
  private static readonly _PG_A = [CARRY, WORK, MOVE];
  public static readonly PART_GROUPS = [Waller._PG_A];
  public static readonly REPEAT_PARTS = true;

  public static run(creep: Creep): void {
    const fullEnergyThreshold = getOrInitialize(creep.memory, "fullEnergyThreshold", () => {
      return Utils.getNoDropEnergyThreshold(creep);
    });
    if (creep.memory.walling && creep.carry.energy === 0) {
      creep.memory.walling = false;
      creep.say("Harvest");
    } else if (!creep.memory.walling && creep.carry.energy >= fullEnergyThreshold) {
      creep.memory.walling = true;
      creep.say("Walling");
    }
    if (creep.memory.walling) {
      Utils.runTasks(creep, [
        MoveFromSource,
        MoveFromMinerSource,
        Wall,
        Build,
        Deposit,
        Upgrade,
        Return,
      ]);
    } else {
      Utils.runTasks(creep, [
        Pickup,
        GraveDig,
        MoveFromMinerSource,
        WithdrawFromContainer,
        WithdrawFromStorage,
        Harvest,
        Return,
      ]);
    }
  }
}
