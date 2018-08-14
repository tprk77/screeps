// Copyright (c) 2018 Tim Perkins

export class Pickup {
  public static run(creep: Creep): boolean {
    if (_.sum(creep.carry) === creep.carryCapacity) {
      return false;
    }
    const drops = creep.room.find(FIND_DROPPED_RESOURCES, {
      filter: (drop) => creep.pos.inRangeTo(drop, 5),
    });
    if (drops.length) {
      const drop = drops[0];
      if (creep.pickup(drop) === ERR_NOT_IN_RANGE) {
        creep.moveTo(drop, {visualizePathStyle: {stroke: "#ffaa00"}});
      }
      return true;
    } else {
      return false;
    }
  }
}
