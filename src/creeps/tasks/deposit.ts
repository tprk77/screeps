// Copyright (c) 2018 Tim Perkins

export class Deposit {
  public static run(creep: Creep): boolean {
    if (!_.get(creep.room.controller, "my", false)) {
      return false;
    }
    const spawnOrExtension = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => ((structure.structureType === STRUCTURE_SPAWN
                               || structure.structureType === STRUCTURE_EXTENSION)
                              && structure.energy < structure.energyCapacity),
    });
    const tower = spawnOrExtension ? null : creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => ((structure.structureType === STRUCTURE_TOWER)
                              && structure.energy < 0.75 * structure.energyCapacity),
    });
    const consumer = spawnOrExtension || tower;
    if (consumer) {
      if (creep.transfer(consumer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(consumer, {visualizePathStyle: {stroke: "#ffffff"}});
      }
      return true;
    } else {
      return false;
    }
  }
}
