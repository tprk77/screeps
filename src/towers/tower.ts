// Copyright (c) 2018 Tim Perkins

import {getOrInitialize} from "../utils/common";

import * as Utils from "./utils";

export class Tower {

  public static readonly RESERVE_CAPACITY_RATIO = 0.5;
  public static readonly DELAY_COUNTDOWN_TICKS = 20;

  public static run(tower: StructureTower): void {
    const towerMemory = Utils.getTowerMemory(tower);
    const delayCountdown = getOrInitialize(towerMemory, "delayCountdown", () => {
      return Tower.DELAY_COUNTDOWN_TICKS;
    });
    const hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    // Update the delay countdown
    const nextDelayCountdown =
        hostile ? Math.max(delayCountdown - 1, 0) : Tower.DELAY_COUNTDOWN_TICKS;
    towerMemory.delayCountdown = nextDelayCountdown;
    const reserveEnergyThreshold = Tower.RESERVE_CAPACITY_RATIO * tower.energyCapacity;
    if (hostile) {
      if (delayCountdown === 0) {
        tower.attack(hostile);
      }
    } else if (tower.energy > reserveEnergyThreshold) {
      // Always save energy to attack
      const hurtCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: (creep) => creep.hits < creep.hitsMax,
      });
      if (hurtCreep) {
        tower.heal(hurtCreep);
      } else {
        const damagedContainer = tower.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (structure) => (structure.structureType === STRUCTURE_CONTAINER
                                  && structure.hits < structure.hitsMax),
        });
        const damagedStructure =
            damagedContainer ? null : tower.pos.findClosestByRange(FIND_STRUCTURES, {
              filter: (structure) => (structure.structureType !== STRUCTURE_WALL
                                      && structure.structureType !== STRUCTURE_RAMPART
                                      && structure.hits < structure.hitsMax),
            });
        const damagedThing = damagedContainer || damagedStructure;
        if (damagedThing) {
          tower.repair(damagedThing);
        }
      }
    }
  }
}
