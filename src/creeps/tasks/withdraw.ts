// Copyright (c) 2018 Tim Perkins

export class Withdraw {
  public static FAR_DISTANCE_THRESHOLD = 5;
  public static FAR_ENERGY_THRESHOLD = 500;

  public static run(creep: Creep): boolean {
    const container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => (structure.structureType === STRUCTURE_CONTAINER
                              && (creep.pos.inRangeTo(structure, this.FAR_DISTANCE_THRESHOLD)
                                      ? !!structure.store.energy
                                      : structure.store.energy > this.FAR_ENERGY_THRESHOLD)),
    });
    if (container) {
      if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(container, {visualizePathStyle: {stroke: "#ffaa00"}});
      }
      return true;
    } else {
      return false;
    }
  }
}
