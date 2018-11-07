// Copyright (c) 2018 Tim Perkins

import {Upgrade} from "creeps/tasks/upgrade";

import {Attacker} from "../creeps/attacker";
import {Builder} from "../creeps/builder";
import {Claimer} from "../creeps/claimer";
import {Harvester} from "../creeps/harvester";
import {Miner} from "../creeps/miner";
import {Upgrader} from "../creeps/upgrader";
import {Role} from "../creeps/utils";
import {Waller} from "../creeps/waller";
import {Tower} from "../towers/tower";

import * as Utils from "./utils";

/*
 * Quick logging utilitly to show the colony room.
 */
function C(room: Room): string {
  return "[" + room.name + "] ";
}

/**
 * A Colony of creeps.
 */
export class Colony {

  private static readonly _SPAWN_ORDER: string[] = [
    Harvester.ROLE_NAME,
    Miner.ROLE_NAME,
    Builder.ROLE_NAME,
    Upgrader.ROLE_NAME,
    Waller.ROLE_NAME,
    Attacker.ROLE_NAME,
    Claimer.ROLE_NAME,
  ];

  private static readonly _ENERGY_CAPS: {[roleName: string]: number} = {
    [Harvester.ROLE_NAME]: 1000,
    [Builder.ROLE_NAME]: 1000,
    [Upgrader.ROLE_NAME]: 1000,
    [Waller.ROLE_NAME]: 1000,
  };

  /**
   * Run the colony.
   *
   * @param room The claimed room of the colony.
   */
  public static run(room: Room): void {
    // Check to initialize colony memory
    if (Colony.memoryNeedsInitialization(room)) {
      Colony.initializeMemory(room);
    }
    // Get the spawns in the main colony room
    const spawns = room.find(FIND_MY_STRUCTURES, {
      filter: (structure) => structure.structureType === STRUCTURE_SPAWN,
    }) as StructureSpawn[];
    // Get the towers in the main colony room
    const towers = room.find(FIND_MY_STRUCTURES, {
      filter: (structure) => structure.structureType === STRUCTURE_TOWER,
    }) as StructureTower[];
    // Get the creeps spawned from this colony, no matter the current room
    const creeps = _.transform(room.memory.creepNames, (creeps, creepName) => {
      const creep = Game.creeps[creepName];
      if (creep) {
        creeps.push(creep);
      } else {
        console.log(C(room) + "Creep has died: " + creepName);
      }
    }) as Creep[];
    // Remove dead creeps from the colony memory
    room.memory.creepNames = creeps.map((creep) => creep.name);
    // Run everything in the colony!
    Colony.runSpawns(room, spawns, creeps);
    Colony.runTowers(room, towers);
    Colony.runCreeps(room, creeps);
  }

  /**
   * Determines if the colony needs its memory initialized.
   *
   * @param room The colony room, providing memory access.
   */
  private static memoryNeedsInitialization(room: Room): boolean {
    return (room.memory.creepNames == null || room.memory.sourceIds == null
            || room.memory.minerNameForSourceId == null || room.memory.towers == null);
  }

  /**
   * Initializes the colony's memory.
   *
   * @param room The colony room, providing memory access.
   * @param override Reset the colony's memory.
   */
  private static initializeMemory(room: Room, override: boolean = false): void {
    console.log(C(room) + "Initializing colony memory!");
    if (override || room.memory.creepNames == null) {
      room.memory.creepNames = [];
    }
    if (override || room.memory.sourceIds == null) {
      const sources = room.find(FIND_SOURCES);
      room.memory.sourceIds = _.map(sources, (source) => source.id);
    }
    if (override || room.memory.minerNameForSourceId == null) {
      room.memory.minerNameForSourceId = {};
      for (const sourceId of room.memory.sourceIds) {
        room.memory.minerNameForSourceId[sourceId] = null;
      }
    }
    if (override || room.memory.towers == null) {
      room.memory.towers = {};
    }
  }

  /**
   * Run the colony's spawns.
   *
   * @param room The colony room, providing memory access.
   * @param spawns The spawns of the colony.
   * @param creeps The creeps of the colony, mostly to count existing creeps.
   */
  private static runSpawns(room: Room, spawns: StructureSpawn[], creeps: Creep[]): void {
    const controller = room.controller as StructureController;
    // TODO Mutli-spawn support
    if (!spawns.length) {
      return;
    }
    const spawn = spawns[0];
    // Description of what the colony's creeps should be
    interface RoleDescriptions {
      [roleName: string]: {role: Role, population: number, atLevel?: number};
    }
    // Make a miner per source
    const minerPopulation = room.memory.sourceIds.length;
    const roleDescriptions: RoleDescriptions = {
      [Harvester.ROLE_NAME]: {role: Harvester, population: 4},
      [Miner.ROLE_NAME]: {role: Miner, population: minerPopulation, atLevel: 2},
      [Builder.ROLE_NAME]: {role: Builder, population: 2},
      [Upgrader.ROLE_NAME]: {role: Upgrader, population: 4},
      [Waller.ROLE_NAME]: {role: Waller, population: 2},
      [Attacker.ROLE_NAME]: {role: Attacker, population: 6},
      [Claimer.ROLE_NAME]: {role: Claimer, population: 1, atLevel: 3},
    } as RoleDescriptions;
    // Get the actual population for each role
    const rolePopulations = _.mapValues(roleDescriptions, (description) => {
      return _.filter(creeps, (creep) => Utils.hasRole(description.role, creep)).length;
    });
    // Determine what to spawn
    for (const roleName of Colony._SPAWN_ORDER) {
      const roleDescription = roleDescriptions[roleName];
      const rolePopulation = rolePopulations[roleName];
      if ((roleDescription.atLevel == null || controller.level >= roleDescription.atLevel)
          && rolePopulation < roleDescription.population) {
        const role = roleDescription.role;
        const name = Utils.generateCreepName(role, Game.time);
        const memory = Utils.generateMemory(role);
        // Check for an energy cap on this role
        const energyCap = Colony._ENERGY_CAPS[roleName];
        const partEnergy =
            energyCap ? Math.min(energyCap, room.energyAvailable) : room.energyAvailable;
        const parts = Utils.getBestPartsForEnergy(
            partEnergy,
            role.PART_TEMPLATE,
            role.PART_GROUPS,
            role.REPEAT_PARTS,
        );
        // TODO HACKS Adjust as necessary...
        if (role === Miner) {
          // Find which source this miner should use
          for (const sourceId of room.memory.sourceIds) {
            const minerName = room.memory.minerNameForSourceId[sourceId];
            const minerCreep = minerName && Game.creeps[minerName];
            if (!minerCreep) {
              // Assign the source to the miner
              room.memory.minerNameForSourceId[sourceId] = name;
              memory.sourceId = sourceId;
              break;
            }
          }
          // Ensure that we actually set a source ID
          if (!memory.sourceId) {
            continue;
          }
        } else if (role === Attacker) {
          memory.attackFlagName = "AttackFlag";
        } else if (role === Claimer) {
          memory.attackFlagName = "ClaimerFlag";
        }
        // Actually try to spawn the creep
        console.log(C(room) + "Wants to spawn: " + name);
        if (spawn.spawnCreep(parts, name, {memory}) === OK) {
          console.log(C(room) + "Spawning new creep: " + name);
          room.memory.creepNames.push(name);
        }
        break;
      }
    }
  }

  /**
   * Run the colony's towers.
   *
   * @param room The colony room, providing memory access.
   * @param towers The towers of the colony.
   */
  private static runTowers(room: Room, towers: StructureTower[]): void {
    for (const tower of towers) {
      Tower.run(tower);
    }
  }

  /**
   * Run the colony's creeps.
   *
   * @param room The colony room, providing memory access.
   * @param creeps The creeps of the colony.
   */
  private static runCreeps(room: Room, creeps: Creep[]): void {
    for (const creep of creeps) {
      if (creep.spawning) {
        // Do nothing, skip this creep
      } else if (creep.memory.role === "harvester") {
        Harvester.run(creep);
      } else if (creep.memory.role === "miner") {
        Miner.run(creep);
      } else if (creep.memory.role === "builder") {
        Builder.run(creep);
      } else if (creep.memory.role === "upgrader") {
        Upgrader.run(creep);
      } else if (creep.memory.role === "waller") {
        Waller.run(creep);
      } else if (creep.memory.role === "attacker") {
        Attacker.run(creep);
      } else if (creep.memory.role === "claimer") {
        Claimer.run(creep);
      }
    }
  }
}
