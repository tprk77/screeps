// Copyright (c) 2018 Tim Perkins

export class Deposit {
  public static run(creep: Creep): boolean {
    const consumers = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => ((structure.structureType === STRUCTURE_EXTENSION
                               || structure.structureType === STRUCTURE_SPAWN
                               || structure.structureType === STRUCTURE_TOWER)
                              && structure.energy < structure.energyCapacity),
    });
    if (consumers.length) {
      if (creep.transfer(consumers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(consumers[0], {visualizePathStyle: {stroke: "#ffffff"}});
      }
      return true;
    } else {
      return false;
    }
  }
}
