// Copyright (c) 2018 Tim Perkins

export class AttackNearbyCreeps {

  public static readonly NEARBY_ATTACK_RANGE = 5;

  public static run(creep: Creep): boolean {
    const closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
      filter: (hostile) => creep.pos.inRangeTo(hostile, AttackNearbyCreeps.NEARBY_ATTACK_RANGE),
    });
    if (closestHostile) {
      if (creep.attack(closestHostile) === ERR_NOT_IN_RANGE) {
        creep.moveTo(closestHostile);
      }
      return true;
    } else {
      return false;
    }
  }
}

export class AttackCreeps {

  public static run(creep: Creep): boolean {
    const closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      if (creep.attack(closestHostile) === ERR_NOT_IN_RANGE) {
        creep.moveTo(closestHostile);
      }
      return true;
    } else {
      return false;
    }
  }
}

export class AttackStructures {

  public static run(creep: Creep): boolean {
    const closestStructure = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
      filter: (structure) => structure.structureType !== STRUCTURE_CONTROLLER,
    });
    if (closestStructure) {
      if (creep.attack(closestStructure) === ERR_NOT_IN_RANGE) {
        creep.moveTo(closestStructure);
      }
      return true;
    } else {
      return false;
    }
  }
}
