// Copyright (c) 2018 Tim Perkins

export class Build {
  public static run(creep: Creep): void {
    const sites = creep.room.find(FIND_CONSTRUCTION_SITES);
    if (sites.length) {
      if (creep.build(sites[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sites[0], {visualizePathStyle: {stroke: "#ffffff"}});
      }
    }
  }
}
