// Copyright (c) 2018 Tim Perkins

export class Withdraw {
  public static run(creep: Creep): boolean {
    const containers = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) =>
          structure.structureType === STRUCTURE_CONTAINER && !!structure.store.energy,
    });
    if (containers.length) {
      const container = containers[0];
      if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(container, {visualizePathStyle: {stroke: "#ffaa00"}});
      }
      return true;
    } else {
      return false;
    }
  }
}
