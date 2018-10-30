// Copyright (c) 2018 Tim Perkins

export class WithdrawFromContainer {

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

/**
 * This behavior should be used as a fallback. Like when the containers are empty.
 *
 * TODO This could be problematic. For example, a creep might get stuck in a loop withdrawing from
 * storage, when the only task it has left to do is fill the storage.
 */
export class WithdrawFromStorage {

  public static run(creep: Creep): boolean {
    const storages = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => (structure.structureType === STRUCTURE_STORAGE
                              && structure.store.energy > 0.5 * structure.storeCapacity),
    });
    if (storages.length) {
      const storage = storages[0];
      if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(storage, {visualizePathStyle: {stroke: "#ffaa00"}});
      }
      return true;
    } else {
      return false;
    }
  }
}
