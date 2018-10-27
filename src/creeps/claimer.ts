// Copyright (c) 2018 Tim Perkins

import {Claim} from "./tasks/claim";
import {MoveToFlag, MoveToFlagRoom} from "./tasks/movetoflag";
import * as Utils from "./utils";

export class Claimer {

  public static readonly ROLE_NAME = "cliamer";
  public static readonly PART_TEMPLATE = [CLAIM, MOVE];
  private static readonly _PG_A = [CLAIM, MOVE];
  public static readonly PART_GROUPS = [Claimer._PG_A];
  public static readonly REPEAT_PARTS = true;

  public static run(creep: Creep): void {
    const flag = Game.flags[creep.memory.claimFlagName];
    Utils.runTasks(creep, [
      MoveToFlagRoom.forFlag(flag),
      Claim,
      MoveToFlag.forFlag(flag),
    ]);
  }
}
