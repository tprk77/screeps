// Copyright (c) 2018 Tim Perkins

export class GraveDig {
  public static run(creep: Creep): boolean {
    if (_.sum(creep.carry) === creep.carryCapacity) {
      return false;
    }
    const tombs = creep.room.find(FIND_TOMBSTONES, {
      filter: (tomb) => creep.pos.inRangeTo(tomb, 7) && !!tomb.store.energy,
    });
    if (tombs.length) {
      const tomb = tombs[0];
      if (creep.withdraw(tomb, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(tomb, {visualizePathStyle: {stroke: "#ffaa00"}});
      }
      return true;
    } else {
      return false;
    }
  }
}
