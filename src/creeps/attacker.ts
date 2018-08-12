// Copyright (c) 2018 Tim Perkins

export class Attacker {
  public static NEARBY_ATTACK_RANGE = 5;

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
          const closestStructure = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
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
