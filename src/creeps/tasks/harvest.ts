// Copyright (c) 2018 Tim Perkins

export class Harvest {
  public static run(creep: Creep): boolean {
    const source = Harvest.pickSource(creep, creep.room.find(FIND_SOURCES));
    if (source) {
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {visualizePathStyle: {stroke: "#ffaa00"}});
      }
      return true;
    } else {
      return false;
    }
  }

  /**
   * This just switches in between the #0 and #1 source based on the creep's ID. It's obviously not
   * that great at doing a good distribution, and doesn't consider source proximity.
   */
  private static pickSource(creep: Creep, sources: Source[]): Source|null {
    if (sources.length) {
      const sourceIndex = _.last(creep.id).charCodeAt(0) % sources.length;
      return sources[sourceIndex];
    } else {
      return null;
    }
  }
}