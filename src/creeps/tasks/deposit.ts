// Copyright (c) 2018 Tim Perkins

export class Deposit {

  public static readonly EMPTY_CAPACITY_RATIO = 0.75;
  public static readonly FULL_CAPACITY_RATIO = 0.95;

  public static run(creep: Creep): boolean {
    if (!_.get(creep.room.controller, "my", false)) {
      return false;
    }
    // TODO This needs some hysteresis, it's going to trash around 25% energy
    const emptyTower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => {
        if (structure.structureType !== STRUCTURE_TOWER) {
          return false;
        }
        const emptyEnergyThreshold = Deposit.EMPTY_CAPACITY_RATIO * structure.energyCapacity;
        return structure.energy < emptyEnergyThreshold;
      },
    });
    const spawn = emptyTower ? null : creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => ((structure.structureType === STRUCTURE_SPAWN
                               || structure.structureType === STRUCTURE_EXTENSION)
                              && structure.energy < structure.energyCapacity),
    });
    const tower = emptyTower || spawn ? null : creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => {
        if (structure.structureType !== STRUCTURE_TOWER) {
          return false;
        }
        const fullEnergyThreshold = Deposit.FULL_CAPACITY_RATIO * structure.energyCapacity;
        return structure.energy < fullEnergyThreshold;
      },
    });
    const consumer = emptyTower || spawn || tower;
    if (consumer) {
      if (creep.transfer(consumer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(consumer, {maxRooms: 1, visualizePathStyle: {stroke: "#ffffff"}});
      }
      return true;
    } else {
      return false;
    }
  }
}
