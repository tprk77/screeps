// Copyright (c) 2018 Tim Perkins

export class Build {
  public static run(creep: Creep): boolean {
    if (!_.get(creep.room.controller, "my", false)) {
      return false;
    }
    const sites = creep.room.find(FIND_CONSTRUCTION_SITES);
    if (sites.length) {
      const site = sites[0];
      if (creep.build(site) === ERR_NOT_IN_RANGE) {
        creep.moveTo(site, {visualizePathStyle: {stroke: "#ffffff"}});
      }
      return true;
    } else {
      return false;
    }
  }
}
