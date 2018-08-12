// Copyright (c) 2018 Tim Perkins

export class Harvest {
  public static run(creep: Creep): boolean {
    const sources = creep.room.find(FIND_SOURCES);
    if (sources.length) {
      if (creep.harvest(sources[1]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[1], {visualizePathStyle: {stroke: "#ffaa00"}});
      }
      return true;
    } else {
      return false;
    }
  }
}
