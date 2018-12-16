// Copyright (c) 2018 Tim Perkins

import {AttackCreeps, AttackNearbyCreeps, AttackStructures} from "./tasks/attack";
import {MoveToFlag, MoveToFlagRoom} from "./tasks/movetoflag";
import * as Utils from "./utils";

export class Attacker {

  public static readonly ROLE_NAME = "attacker";
  public static readonly PART_TEMPLATE = [TOUGH, ATTACK, MOVE];
  private static readonly _PG_E = [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE];
  private static readonly _PG_D = [ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
  private static readonly _PG_C = [TOUGH, TOUGH, MOVE, MOVE];
  private static readonly _PG_B = [ATTACK, ATTACK, MOVE, MOVE];
  private static readonly _PG_A = [ATTACK, MOVE];
  public static readonly PART_GROUPS = [
    Attacker._PG_B, Attacker._PG_B, Attacker._PG_E, Attacker._PG_D, Attacker._PG_C, Attacker._PG_B,
    Attacker._PG_A
  ];
  public static readonly REPEAT_PARTS = false;

  private static readonly _WithFlag: Utils.WithFlagTask = Utils.makeWithFlagTask((creep) => {
    const flagName = creep.memory.attackFlagName;
    return flagName ? Game.flags[flagName] : null;
  });

  public static run(creep: Creep): void {
    Utils.runTasks(creep, [
      AttackNearbyCreeps,
      Attacker._WithFlag((flag) => MoveToFlagRoom.forFlag(flag)),
      AttackCreeps,
      AttackStructures,
      Attacker._WithFlag((flag) => MoveToFlag.forFlag(flag)),
    ]);
  }
}
