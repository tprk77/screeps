// Copyright (c) 2018 Tim Perkins

export class Build {

  public static run(creep: Creep): boolean {
    if (!_.get(creep.room.controller, "my", false)) {
      return false;
    }
    const nonRoadSites = creep.room.find(FIND_CONSTRUCTION_SITES, {
      filter: (site) => site.structureType !== STRUCTURE_ROAD,
    });
    const roadSites = nonRoadSites.length ? [] : creep.room.find(FIND_CONSTRUCTION_SITES, {
      filter: (site) => site.structureType === STRUCTURE_ROAD,
    });
    const sites = nonRoadSites.length ? nonRoadSites : roadSites;
    if (sites.length) {
      const site = sites[0];
      if (creep.build(site) === ERR_NOT_IN_RANGE) {
        creep.moveTo(site, {maxRooms: 1, visualizePathStyle: {stroke: "#ffffff"}});
      }
      return true;
    } else {
      return false;
    }
  }
}
