// Copyright (c) 2018 Tim Perkins

import {getOrInitialize, MY_USERNAME} from "../utils/common";

import {AttackController} from "./tasks/attackcontroller";

import {MoveToFlag, MoveToFlagRoom} from "./tasks/movetoflag";
import {Reserve} from "./tasks/reserve";
import * as Utils from "./utils";

export class Reserver {

  public static readonly ROLE_NAME = "reserver";
  public static readonly PART_TEMPLATE = [CLAIM, MOVE];
  private static readonly _PG_A = [CLAIM, MOVE];
  public static readonly PART_GROUPS =
      [Reserver._PG_A, Reserver._PG_A, Reserver._PG_A, Reserver._PG_A, Reserver._PG_A];
  public static readonly REPEAT_PARTS = false;
  public static readonly MAX_RESERVATION_TICKS = 4500;

  private static readonly _SelectFlag: Utils.Task = Utils.makeTask((creep) => {
    // If there's a flag, keep the current one
    if (creep.memory.alphaFlagName) {
      return false;
    }
    // TODO THE **COLONY** NEEDS TO COORDINATE MULTIPLE RESERVERS
    const flags = _.compact(
        _.map(creep.memory.alphaCandidateFlagNames, (flagName) => Game.flags[flagName]),
    );
    const rooms = _.map(flags, (flag) => flag ? Game.rooms[flag.pos.roomName] : null);
    const flagsAndRooms = _.zip<any>(flags, rooms) as [Flag, Room | null][];
    const [flagsWithoutRooms, flagsWithRooms] =
        _.partition(flagsAndRooms, ([_, room]) => room == null) as [[Flag, null][], [Flag, Room][]];
    if (flagsWithoutRooms.length) {
      // If some rooms aren't visible, go to the first one
      const flag = flagsWithoutRooms[0][0];
      creep.memory.alphaFlagName = flag.name;
    } else if (flagsWithRooms.length) {
      const flagsWithControllers =
          _.filter(flagsWithRooms, ([_, room]) => room.controller && room.controller.level === 0);
      // If some rooms are visible, go to the lowest reservation
      const flagAndRoom = _.min(flagsWithControllers, Reserver._getReservationScore);
      creep.memory.alphaFlagName = flagAndRoom[0].name;
    }
    return false;
  });

  private static _getReservationScore(flagAndRoom: [Flag, Room]): number {
    const controller = flagAndRoom[1].controller;
    if (!controller || controller.level !== 0) {
      return Infinity;
    } else if (controller.reservation && controller.reservation.username === MY_USERNAME) {
      return controller.reservation.ticksToEnd;
    } else {
      return 0;
    }
  }

  private static _WithFlag: Utils.WithFlagTask = Utils.makeWithFlagTask((creep) => {
    const flagName = creep.memory.alphaFlagName;
    return flagName ? Game.flags[flagName] : null;
  });

  private static readonly _ClearFlag: Utils.Task = Utils.makeTask((creep) => {
    creep.memory.alphaFlagName = null;
    return false;
  });

  public static run(creep: Creep): void {
    Utils.runTasks(creep, [
      Reserver._SelectFlag,
      Reserver._WithFlag((flag) => MoveToFlagRoom.forFlag(flag)),
      AttackController,
      Reserve.upTo(Reserver.MAX_RESERVATION_TICKS),
      Reserver._ClearFlag,
    ]);
  }
}
