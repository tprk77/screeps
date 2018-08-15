// Copyright (c) 2018 Tim Perkins

import {Claim} from "./tasks/claim";
import {MoveToFlagRoom} from "./tasks/movetoflag";
import {Return} from "./tasks/return";
import * as Utils from "./utils";

export class Claimer {
  public static run(creep: Creep): void {
    const flag = Game.flags[creep.memory.claimFlagName];
    Utils.runTasks(creep, [
      MoveToFlagRoom.forFlag(flag),
      Claim,
      Return,
    ]);
  }
}
