// Copyright (c) 2018 Tim Perkins

export class Pickup {
  public static readonly DROP_FIND_RANGE = 7;
  public static readonly DROP_CAPACITY_RATIO = 0.25;

  public static run(creep: Creep): boolean {
    const currentCarrySum = _.sum(creep.carry);
    if (currentCarrySum === creep.carryCapacity) {
      return false;
    }
    const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
    const drops = hostiles.length ? [] : creep.room.find(FIND_DROPPED_RESOURCES, {
      filter: (drop) => {
        const energyThreshold = Pickup.DROP_CAPACITY_RATIO * creep.carryCapacity;
        return (drop.resourceType === RESOURCE_ENERGY &&
                ((currentCarrySum === 0 && drop.amount > energyThreshold)
                 || creep.pos.inRangeTo(drop, Pickup.DROP_FIND_RANGE)));
      },
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
