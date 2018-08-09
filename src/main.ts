// Copyright (c) 2018 Tim Perkins

import {Attacker} from "./roles/attacker";
import {Builder} from "./roles/builder";
import {Harvester} from "./roles/harvester";
import {Tower} from "./roles/tower";
import {Upgrader} from "./roles/upgrader";
import {Waller} from "./roles/waller";

declare global {
  interface CreepMemory {
    role: string;
  }
}

/**
 * Get the total cost of some parts.
 * @param parts The parts to get the cost of.
 * @return The cost of all the parts.
 */
export function getPartsCost(parts: BodyPartConstant[]): number {
  return _.sum(parts, (part) => BODYPART_COST[part]);
}

/**
 * Find a collection of parts below a certain energy budget.
 * @param energy The energy budget. The cost of all parts shall not exceed this number.
 * @param partGroups Any number of part groups to collect into the result. Each group is added to
 * the result as a single unit. The groups are added in reverse order. The first group may be
 * repeated in the result, according to the option.
 * @param repeatGroup If true, repeat the first group if possible. True by default.
 * @param minGroup If true, always return at least the last group, even if the cost of this group is
 * greater than the energy budget. (Don't return an empty result.) True by default.
 * @return The array of parts.
 *
 * **Example**
 *
 * Calling the following function:
 *
 *     getPartsForEnergy(X, [G, F], [E, D], [C, B, A])
 *
 * Could produce any of the following results:
 *
 *     [G, F, ..., G, F, E, D, C, B, A] // repeatGroup = true
 *     [G, F, E, D, C, B, A]
 *     [E, D, C, B, A]
 *     [C, B, A]
 *     [] // minGroup = false, Energy is below minimum cost!
 */
export function getPartsForEnergy(energy: number, partGroups: BodyPartConstant[][],
                                  repeatGroup: boolean = true,
                                  minGroup = true): BodyPartConstant[] {
  const parts: BodyPartConstant[] = [];
  let cost: number = 0;
  let partGroup: BodyPartConstant[]|null = null;
  let partGroupCost: number|null = null;
  // Loop trough all part groups in reverse
  for (let pgIndex = partGroups.length - 1; pgIndex >= 0; pgIndex--) {
    const maybePartGroup = partGroups[pgIndex];
    // Check for empty groups and stop early
    if (maybePartGroup.length) {
      partGroup = maybePartGroup;
      partGroupCost = getPartsCost(partGroup);
    } else {
      partGroup = null;
      partGroupCost = null;
      break;
    }
    // Check the cost against the budget
    if (cost + partGroupCost <= energy) {
      cost += partGroupCost;
      parts.push(...partGroup);
    } else {
      break;
    }
  }
  // Maybe add some more groups
  if (partGroup && partGroupCost) {
    if (minGroup && !parts.length) {
      // Add the min group if necessary
      parts.push(...partGroup);
    } else if (repeatGroup) {
      // Try to repeat the last part group
      while (cost + partGroupCost <= energy) {
        cost += partGroupCost;
        parts.push(...partGroup);
      }
    }
  }
  return parts;
}

/**
 * Arrange parts according to a template.
 * @param partTemplate The array of unique parts, determining the order of the result.
 * @param jumbledParts The parts to reorder according to the template.
 * @return The reordered parts.
 */
export function arrangeParts(partTemplate: BodyPartConstant[],
                             jumbledParts: BodyPartConstant[]): BodyPartConstant[] {
  const parts: BodyPartConstant[] = [];
  const partGroupings = _.groupBy(jumbledParts, _.identity);
  // Add the parts in the template
  for (const part of partTemplate) {
    parts.push(...partGroupings[part]);
    delete partGroupings[part];
  }
  // Add the parts not in the template
  const preParts: BodyPartConstant[] = [];
  for (const part in partGroupings) {
    preParts.push(...partGroupings[part]);
  }
  return preParts.concat(parts);
}

/**
 * Finds the best body possible for the given cost.
 * @param energy The energy budget. The cost of all parts shall not exceed this number.
 * @param partTemplate The array of unique parts, determining the order of the result.
 * @param partGroups Any number of part groups to collect into the result. Each group is added to
 * the result as a single unit. The groups are added in reverse order. The first group may be
 * repeated in the result, according to the option.
 * @param repeatGroup If true, repeat the first group if possible. True by default.
 * @param minGroup If true, always return at least the last group, even if the cost of this group is
 * greater than the energy budget. (Don't return an empty result.) True by default.
 * @return The array of parts.
 */
export function getBestPartsForEnergy(energy: number, partTemplate: BodyPartConstant[],
                                      partGroups: BodyPartConstant[][], repeatGroup: boolean = true,
                                      minGroup = true): BodyPartConstant[] {
  return arrangeParts(partTemplate, getPartsForEnergy(energy, partGroups, repeatGroup, minGroup));
}

/**
 * Stores the energy and energy capacity for spawning.
 */
interface SpawnEnergy {
  energy: number;
  energyCapacity: number;
}

/**
 * Get the room's energy and energy capacity for spawning.
 * @param room The room to get the energy of.
 * @return The spawning energy.
 */
export function getSpawnEnergy(room: Room): SpawnEnergy {
  const spawnEnergy: SpawnEnergy = {energy: 0, energyCapacity: 0};
  const spawningStructures = room.find(FIND_STRUCTURES, {
    filter: (structure) => ((structure.structureType === STRUCTURE_SPAWN
                             || structure.structureType === STRUCTURE_EXTENSION)
                            && structure.isActive()),
  });
  for (const spawningStructure of spawningStructures) {
    // Force the type to have energy and energyCapacity
    const spawnStructure = spawningStructure as StructureSpawn;
    spawnEnergy.energy += spawnStructure.energy;
    spawnEnergy.energyCapacity += spawnStructure.energyCapacity;
  }
  return spawnEnergy;
}

/**
 * The main loop!
 */
export function loop() {
  console.log("Current game tick is " + Game.time);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  const towers =
      (_.filter(Game.structures, (structure) => structure.structureType === STRUCTURE_TOWER) as
       StructureTower[]);

  for (const tower of towers) {
    Tower.run(tower);
  }

  const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === "harvester");
  const builders = _.filter(Game.creeps, (creep) => creep.memory.role === "builder");
  const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === "upgrader");
  const wallers = _.filter(Game.creeps, (creep) => creep.memory.role === "waller");
  const attackers = _.filter(Game.creeps, (creep) => creep.memory.role === "attacker");

  const spawn = Game.spawns.Spawn1;
  const spawnEnergy = getSpawnEnergy(spawn.room);

  const bestWorkerParts = getBestPartsForEnergy(
      spawnEnergy.energy,
      [CARRY, WORK, MOVE],
      [[CARRY, WORK, MOVE]],
  );

  const bestAttackerParts = getBestPartsForEnergy(
      spawnEnergy.energy,
      [TOUGH, ATTACK, MOVE],
      [[TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE], [ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE]],
      false,
  );

  if (harvesters.length < 4) {
    const newName = "Harvester" + Game.time;
    console.log("Spawning new harvester: " + newName);
    spawn.spawnCreep(bestWorkerParts, newName, {memory: {role: "harvester"} as CreepMemory});
  } else if (builders.length < 4) {
    const newName = "Builder" + Game.time;
    console.log("Spawning new builder: " + newName);
    spawn.spawnCreep(bestWorkerParts, newName, {memory: {role: "builder"} as CreepMemory});
  } else if (upgraders.length < 6) {
    const newName = "Upgrader" + Game.time;
    console.log("Spawning new upgrader: " + newName);
    spawn.spawnCreep(bestWorkerParts, newName, {memory: {role: "upgrader"} as CreepMemory});
  } else if (wallers.length < 2) {
    const newName = "Waller" + Game.time;
    console.log("Spawning new waller: " + newName);
    spawn.spawnCreep(bestWorkerParts, newName, {memory: {role: "waller"} as CreepMemory});
  } else if (attackers.length < 6) {
    const newName = "Attacker" + Game.time;
    console.log("Spawning new attacker: " + newName);
    const creepOptions = {memory: {role: "attacker", flagId: "AttackFlag"} as CreepMemory};
    spawn.spawnCreep(bestAttackerParts, newName, creepOptions);
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role === "harvester") {
      Harvester.run(creep);
    } else if (creep.memory.role === "builder") {
      Builder.run(creep);
    } else if (creep.memory.role === "upgrader") {
      Upgrader.run(creep);
    } else if (creep.memory.role === "waller") {
      Waller.run(creep);
    } else if (creep.memory.role === "attacker") {
      Attacker.run(creep);
    }
  }
}
