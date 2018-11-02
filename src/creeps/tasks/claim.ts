// Copyright (c) 2018 Tim Perkins

export class Claim {

  public static run(creep: Creep): boolean {
    const controller = creep.room.controller;
    if (!controller) {
      return false;
    }
    if (!controller.my) {
      if (creep.attackController(controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(controller, {visualizePathStyle: {stroke: "#ffffff"}});
      }
      return true;
    } else if (controller.level === 0) {
      if (creep.claimController(controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(controller, {visualizePathStyle: {stroke: "#ffffff"}});
      }
      return true;
    } else {
      return false;
    }
  }
}
