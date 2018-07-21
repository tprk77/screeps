// Copyright (c) 2018 Tim Perkins

declare global {
  interface CreepMemory {
    upgrading: boolean;
  }
}

export class Upgrader {
  public static run(creep: Creep): void {
    if (creep.memory.upgrading && creep.carry.energy === 0) {
      creep.memory.upgrading = false;
      creep.say("Harvest");
    } else if (!creep.memory.upgrading && creep.carry.energy === creep.carryCapacity) {
      creep.memory.upgrading = true;
      creep.say("Upgrade");
    }
    if (creep.memory.upgrading) {
      // TODO What if there's no controller in the room?
      const controller = creep.room.controller as StructureController;
      if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(controller, {visualizePathStyle: {stroke: "#ffffff"}});
      }
    } else {
      const sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle: {stroke: "#ffaa00"}});
      }
    }
  }
}
