// Copyright (c) 2018 Tim Perkins

export class Tower {
  public static readonly RESERVE_ENERGY = 500;

  public static run(tower: StructureTower): void {
    const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      tower.attack(closestHostile);
    } else if (tower.energy > Tower.RESERVE_ENERGY) {
      // Only repair if we have enough energy to attack
      const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) =>
            structure.structureType !== STRUCTURE_WALL && structure.hits < structure.hitsMax,
      });
      if (closestDamagedStructure) {
        tower.repair(closestDamagedStructure);
      }
    }
  }
}
