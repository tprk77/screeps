// Copyright (c) 2018 Tim Perkins

export class Deposit {
  public static run(creep: Creep): boolean {
    if (!_.get(creep.room.controller, "my", false)) {
      return false;
    }
    const consumers = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => ((structure.structureType === STRUCTURE_EXTENSION
                               || structure.structureType === STRUCTURE_SPAWN
                               || structure.structureType === STRUCTURE_TOWER)
                              && structure.energy < structure.energyCapacity),
    });
    if (consumers.length) {
      const consumer = consumers[0];
      if (creep.transfer(consumer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(consumer, {visualizePathStyle: {stroke: "#ffffff"}});
      }
      return true;
    } else {
      return false;
    }
  }
}
