// Copyright (c) 2018 Tim Perkins

export class Upgrade {
  public static run(creep: Creep): boolean {
    const controller = creep.room.controller;
    if (controller) {
      if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(controller, {visualizePathStyle: {stroke: "#ffffff"}});
      }
      return true;
    } else {
      return false;
    }
  }
}
