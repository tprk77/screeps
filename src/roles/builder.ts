// Copyright (c) 2018 Tim Perkins

declare global {
  interface CreepMemory {
    building: boolean;
  }
}

export class Builder {
  public static run(creep: Creep): void {
    if (creep.memory.building && creep.carry.energy === 0) {
      creep.memory.building = false;
      creep.say("Harvest");
    } else if (!creep.memory.building && creep.carry.energy === creep.carryCapacity) {
      creep.memory.building = true;
      creep.say("Build");
    }
    if (creep.memory.building) {
      const sites = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (sites.length) {
        if (creep.build(sites[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(sites[0], {visualizePathStyle: {stroke: "#ffffff"}});
        }
      }
    } else {
      const sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[1]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[1], {visualizePathStyle: {stroke: "#ffaa00"}});
      }
    }
  }
}
