// Copyright (c) 2018 Tim Perkins

export class Attacker {

  public static readonly ROLE_NAME = "attacker";
  public static readonly PART_TEMPLATE = [TOUGH, ATTACK, MOVE];
  private static readonly _PG_C = [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE];
  private static readonly _PG_B = [ATTACK, ATTACK, MOVE, MOVE];
  private static readonly _PG_A = [ATTACK, MOVE];
  public static readonly PART_GROUPS = [Attacker._PG_C, Attacker._PG_B, Attacker._PG_A];
  public static readonly REPEAT_PARTS = false;

  public static readonly NEARBY_ATTACK_RANGE = 5;

  public static run(creep: Creep): void {
    const flag = Game.flags[creep.memory.attackFlagName];
    // Always attack nearby hostiles
    const closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile && creep.pos.inRangeTo(closestHostile, Attacker.NEARBY_ATTACK_RANGE)) {
      if (creep.attack(closestHostile) === ERR_NOT_IN_RANGE) {
        creep.moveTo(closestHostile);
      }
    } else if (flag) {
      if (creep.room === flag.room) {
        // Attack creeps in the room
        const closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
          if (creep.attack(closestHostile) === ERR_NOT_IN_RANGE) {
            creep.moveTo(closestHostile);
          }
        } else {
          const closestStructure = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
            filter: (structure) => structure.structureType !== STRUCTURE_CONTROLLER,
          });
          if (closestStructure) {
            if (creep.attack(closestStructure) === ERR_NOT_IN_RANGE) {
              creep.moveTo(closestStructure);
            }
          } else {
            // Move to the flag if the room is clear
            creep.moveTo(flag);
          }
        }
      } else {
        // Move to the room
        creep.moveTo(flag);
      }
    }
  }
}
