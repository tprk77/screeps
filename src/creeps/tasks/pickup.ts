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
    const drop = hostiles.length ? null : creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
      filter: (drop) => {
        const energyThreshold = Pickup.DROP_CAPACITY_RATIO * creep.carryCapacity;
        return (drop.resourceType === RESOURCE_ENERGY
                && ((currentCarrySum === 0 && drop.amount > energyThreshold)
                    || creep.pos.inRangeTo(drop, Pickup.DROP_FIND_RANGE)));
      },
    });
    if (drop) {
      if (creep.pickup(drop) === ERR_NOT_IN_RANGE) {
        creep.moveTo(drop, {maxRooms: 1, visualizePathStyle: {stroke: "#ffaa00"}});
      }
      return true;
    } else {
      return false;
    }
  }
}
