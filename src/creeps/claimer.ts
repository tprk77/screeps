// Copyright (c) 2018 Tim Perkins

import {Claim} from "./tasks/claim";
import {MoveToFlag, MoveToFlagRoom} from "./tasks/movetoflag";
import * as Utils from "./utils";

export class Claimer {
  public static run(creep: Creep): void {
    const flag = Game.flags[creep.memory.claimFlagName];
    Utils.runTasks(creep, [
      MoveToFlagRoom.forFlag(flag),
      Claim,
      MoveToFlag.forFlag(flag),
    ]);
  }
}
