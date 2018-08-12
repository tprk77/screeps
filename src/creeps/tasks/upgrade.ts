// Copyright (c) 2018 Tim Perkins

export class Upgrade {
  public static run(creep: Creep): void {
    // TODO What if there's no controller in the room?
    const controller = creep.room.controller as StructureController;
    if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
      creep.moveTo(controller, {visualizePathStyle: {stroke: "#ffffff"}});
    }
  }
}
