// Copyright (c) 2018 Tim Perkins

import {AttackController} from "./tasks/attackcontroller";
import {Claim} from "./tasks/claim";
import {MoveToFlag, MoveToFlagRoom} from "./tasks/movetoflag";
import * as Utils from "./utils";

export class Claimer {

  public static readonly ROLE_NAME = "claimer";
  public static readonly PART_TEMPLATE = [CLAIM, MOVE];
  private static readonly _PG_A = [CLAIM, MOVE];
  public static readonly PART_GROUPS =
      [Claimer._PG_A, Claimer._PG_A, Claimer._PG_A, Claimer._PG_A, Claimer._PG_A];
  public static readonly REPEAT_PARTS = false;

  private static readonly _WithFlag: Utils.WithFlagTask = Utils.makeWithFlagTask((creep) => {
    const flagName = creep.memory.alphaFlagName;
    return flagName ? Game.flags[flagName] : null;
  });

  public static run(creep: Creep): void {
    Utils.runTasks(creep, [
      Claimer._WithFlag((flag) => MoveToFlagRoom.forFlag(flag)),
      AttackController,
      Claim,
      Claimer._WithFlag((flag) => MoveToFlag.forFlag(flag)),
    ]);
  }
}
