// Copyright (c) 2018 Tim Perkins

import {MY_USERNAME} from "../../utils/common";

export class Reserve {

  public _reserveTicks: number;

  private constructor(reserveTicks: number) {
    this._reserveTicks = reserveTicks;
  }

  public static upTo(ticks: number): Reserve {
    return new Reserve(ticks);
  }

  public run(creep: Creep): boolean {
    const controller = creep.room.controller;
    if (!controller) {
      return false;
    }
    if (controller.level === 0
        && (!controller.reservation
            || (controller.reservation.username === MY_USERNAME
                && controller.reservation.ticksToEnd < this._reserveTicks))) {
      if (creep.reserveController(controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(controller, {visualizePathStyle: {stroke: "#ffffff"}});
      }
      return true;
    } else {
      return false;
    }
  }
}
