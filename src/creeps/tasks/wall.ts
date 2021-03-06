// Copyright (c) 2018 Tim Perkins

export class Wall {

  public static readonly WALL_GROUP_HITS =
      [1000, 5000, 10000, 50000, 100000, 150000, 200000, 250000, 300000];
  public static readonly WALL_MAX_HITS = _.last(Wall.WALL_GROUP_HITS);
  public static readonly WALLING_RANGE = 3;

  public static run(creep: Creep): boolean {
    if (!_.get(creep.room.controller, "my", false)) {
      return false;
    }
    const wallSites = creep.room.find(FIND_CONSTRUCTION_SITES, {
      filter: (structure) => (structure.structureType === STRUCTURE_WALL
                              || structure.structureType === STRUCTURE_RAMPART),
    });
    if (wallSites.length) {
      const wallSite = wallSites[0];
      if (creep.build(wallSite) === ERR_NOT_IN_RANGE) {
        creep.moveTo(wallSite, {
          maxRooms: 1,
          range: Wall.WALLING_RANGE,
          visualizePathStyle: {stroke: "#ffffff"},
        });
      }
      return true;
    } else {
      const walls = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => ((structure.structureType === STRUCTURE_WALL
                                 || structure.structureType === STRUCTURE_RAMPART)
                                && structure.hits < Wall.WALL_MAX_HITS),
      });
      const wallGroups = _.groupBy(walls, (wall) => {
        return _.find(Wall.WALL_GROUP_HITS, (groupHits) => wall.hits < groupHits);
      });
      const lowestGroupHits = _.find(Wall.WALL_GROUP_HITS, (groupHits) => groupHits in wallGroups);
      const wall = !lowestGroupHits ? null : _.min(wallGroups[lowestGroupHits], (wall) => {
        return creep.pos.getRangeTo(wall);
      });
      if (wall) {
        if (creep.repair(wall) === ERR_NOT_IN_RANGE) {
          creep.moveTo(wall, {
            maxRooms: 1,
            range: Wall.WALLING_RANGE,
            visualizePathStyle: {stroke: "#ffffff"},
          });
        }
        return true;
      } else {
        return false;
      }
    }
  }
}
