// Copyright (c) 2018 Tim Perkins

import {Vector} from "../../utils/vector";

export class MoveFromSource {

  public static readonly SOURCE_FIND_RANGE = 1;
  public static readonly SOURCE_BACKOFF_RADIUS = 3.0;

  public static run(creep: Creep): boolean {
    const sources = creep.pos.findInRange(FIND_SOURCES, this.SOURCE_FIND_RANGE);
    const source = sources.length ? sources[0] : null;
    if (source) {
      const sourceVec = Vector.fromObject(source.pos);
      const creepVec = Vector.fromObject(creep.pos);
      const destVec = creepVec.expelRadius(sourceVec, this.SOURCE_BACKOFF_RADIUS).round();
      creep.moveTo(destVec.x, destVec.y, {visualizePathStyle: {stroke: "#ff0000"}});
      return true;
    } else {
      return false;
    }
  }
}

export class MoveFromMinerSource {

  public static readonly SOURCE_FIND_RANGE = 3;
  public static readonly MINER_FIND_RANGE = 5; // Relative to source
  public static readonly SOURCE_BACKOFF_RADIUS = 5.0;

  public static run(creep: Creep): boolean {
    const sources = creep.pos.findInRange(FIND_SOURCES, this.SOURCE_FIND_RANGE);
    const source = sources.length ? sources[0] : null;
    const miners = !source ? [] : source.pos.findInRange(FIND_MY_CREEPS, this.MINER_FIND_RANGE, {
      filter: (creep) =>
          !creep.spawning && creep.memory.role === "miner" && !creep.pos.inRangeTo(source, 1),
    });
    if (source && miners.length) {
      const sourceVec = Vector.fromObject(source.pos);
      const creepVec = Vector.fromObject(creep.pos);
      const destVec = creepVec.expelRadius(sourceVec, this.SOURCE_BACKOFF_RADIUS).round();
      creep.moveTo(destVec.x, destVec.y, {visualizePathStyle: {stroke: "#ff0000"}});
      return true;
    } else {
      return false;
    }
  }
}
