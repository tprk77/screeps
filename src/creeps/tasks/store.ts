// Copyright (c) 2018 Tim Perkins

export class StoreInNearbyContainer {
  public static readonly CONTAINER_DISTANCE_THESHOLD = 2;

  public static run(creep: Creep): boolean {
    if (!_.get(creep.room.controller, "my", false)) {
      return false;
    }
    const containers =
        creep.pos.findInRange(FIND_STRUCTURES, StoreInNearbyContainer.CONTAINER_DISTANCE_THESHOLD, {
          filter: (structure) => (structure.structureType === STRUCTURE_CONTAINER
                                  && _.sum(structure.store) !== structure.storeCapacity),
        });
    if (containers.length) {
      const container = containers[0];
      if (creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(container, {visualizePathStyle: {stroke: "#ffffff"}});
      }
      return true;
    } else {
      return false;
    }
  }
}

export class StoreInStorage {
  public static run(creep: Creep): boolean {
    if (!_.get(creep.room.controller, "my", false)) {
      return false;
    }
    const storages = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => (structure.structureType === STRUCTURE_STORAGE
                              && _.sum(structure.store) !== structure.storeCapacity),
    });
    if (storages.length) {
      const storage = storages[0];
      if (creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(storage, {visualizePathStyle: {stroke: "#ffffff"}});
      }
      return true;
    } else {
      return false;
    }
  }
}
