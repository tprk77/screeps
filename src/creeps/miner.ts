// Copyright (c) 2018 Tim Perkins

import {getOrInitialize} from "../utils/common";

import {Harvest} from "./tasks/harvest";
import {StoreInNearbyContainer} from "./tasks/store";
import * as Utils from "./utils";

export class Miner {

  public static readonly ROLE_NAME = "miner";
  public static readonly PART_TEMPLATE = [WORK, CARRY, MOVE];
  private static readonly _PG_B = [WORK];
  private static readonly _PG_A = [WORK, CARRY, MOVE];
  public static readonly PART_GROUPS = [
    Miner._PG_B,
    Miner._PG_B,
    Miner._PG_B,
    Miner._PG_B,
    Miner._PG_B,
    Miner._PG_B,
    Miner._PG_B,
    Miner._PG_A,
  ];
  public static readonly REPEAT_PARTS = false;

  /**
   * Miners are like Harvesters, but instead of distributing their energy all over the room, they
   * only place their energy in nearby containers. They might hog the spot in front of the source,
   * but other creeps can just withdraw energy from the container. Miner creeps should have plenty
   * of WORK parts, but don't need many CARRY or MOVE parts.
   */
  public static run(creep: Creep): void {
    const fullEnergyThreshold = getOrInitialize(creep.memory, "fullEnergyThreshold", () => {
      return Utils.getNoDropEnergyThreshold(creep);
    });
    if (creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false;
    } else if (!creep.memory.working && creep.carry.energy >= fullEnergyThreshold) {
      creep.memory.working = true;
    }
    if (creep.memory.working) {
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
