// Copyright (c) 2018 Tim Perkins

declare global {
  interface CreepMemory {
    walling: boolean;
  }
}

export class Waller {
  public static WALL_GROUP_HITS = [1000, 5000, 10000, 50000, 100000];
  public static WALL_MAX_HITS = _.last(Waller.WALL_GROUP_HITS);

  public static run(creep: Creep): void {
    if (creep.memory.walling && creep.carry.energy === 0) {
      creep.memory.walling = false;
      creep.say("Harvest");
    } else if (!creep.memory.walling && creep.carry.energy === creep.carryCapacity) {
      creep.memory.walling = true;
      creep.say("Walling");
    }
    if (creep.memory.walling) {
      const wallSites = creep.room.find(FIND_CONSTRUCTION_SITES, {
        filter: (structure) => structure.structureType === STRUCTURE_WALL,
      });
      if (wallSites.length) {
        if (creep.build(wallSites[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(wallSites[0], {visualizePathStyle: {stroke: "#ffffff"}});
        }
      } else {
        const walls = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) =>
              structure.structureType === STRUCTURE_WALL && structure.hits < Waller.WALL_MAX_HITS,
        });
        const wallGroups = _.groupBy(walls, (wall) => {
          return _.find(Waller.WALL_GROUP_HITS, (groupHits) => wall.hits < groupHits);
        });
        const lowestGroupHits =
            _.find(Waller.WALL_GROUP_HITS, (groupHits) => groupHits in wallGroups);
        const wall = lowestGroupHits ? wallGroups[lowestGroupHits][0] : null;
        if (wall) {
          if (creep.repair(wall) === ERR_NOT_IN_RANGE) {
            creep.moveTo(wall, {visualizePathStyle: {stroke: "#ffffff"}});
          }
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
