// Copyright (c) 2018 Tim Perkins

export class GraveDig {
  public static readonly TOMBSTONE_FIND_RANGE = 7;
  public static readonly TOMBSTONE_CAPACITY_RATIO = 0.75;

  public static run(creep: Creep): boolean {
    const currentCarrySum = _.sum(creep.carry);
    if (currentCarrySum === creep.carryCapacity) {
      return false;
    }
    const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
    const tombs = hostiles.length ? [] : creep.room.find(FIND_TOMBSTONES, {
      filter: (tomb) => {
        const energyThreshold = GraveDig.TOMBSTONE_CAPACITY_RATIO * creep.carryCapacity;
        return (!!tomb.store.energy
                && ((currentCarrySum === 0 && tomb.store.energy > energyThreshold)
                    || creep.pos.inRangeTo(tomb, GraveDig.TOMBSTONE_FIND_RANGE)));
      },
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
