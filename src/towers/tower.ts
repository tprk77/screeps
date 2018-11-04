// Copyright (c) 2018 Tim Perkins

import {getOrInitialize} from "../utils/common";

import * as Utils from "./utils";

export class Tower {

  public static readonly DELAY_COUNTDOWN_TICKS = 20;
  public static readonly RESERVE_ENERGY = 500;

  public static run(tower: StructureTower): void {
    const towerMemory = Utils.getTowerMemory(tower);
    const delayCountdown = getOrInitialize(towerMemory, "delayCountdown", () => {
      return Tower.DELAY_COUNTDOWN_TICKS;
    });
    const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    // Update the delay countdown
    const nextDelayCountdown =
        closestHostile ? Math.max(delayCountdown - 1, 0) : Tower.DELAY_COUNTDOWN_TICKS;
    towerMemory.delayCountdown = nextDelayCountdown;
    if (closestHostile) {
      if (delayCountdown === 0) {
        tower.attack(closestHostile);
      }
    } else if (tower.energy > Tower.RESERVE_ENERGY) {
      // Only repair if we have enough energy to attack
      const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => (structure.structureType !== STRUCTURE_WALL
                                && structure.structureType !== STRUCTURE_RAMPART
                                && structure.hits < structure.hitsMax),
      });
      if (closestDamagedStructure) {
        tower.repair(closestDamagedStructure);
      }
    }
  }
}
