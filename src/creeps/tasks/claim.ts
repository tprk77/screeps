// Copyright (c) 2018 Tim Perkins

import {MY_USERNAME} from "../../utils/common";

export class Claim {

  public static run(creep: Creep): boolean {
    const controller = creep.room.controller;
    if (!controller) {
      return false;
    }
    if (controller.level === 0
        && (!controller.reservation || controller.reservation.username === MY_USERNAME)) {
      if (creep.claimController(controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(controller, {visualizePathStyle: {stroke: "#ffffff"}});
      }
      return true;
    } else {
      return false;
    }
  }
}
