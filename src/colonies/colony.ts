// Copyright (c) 2018 Tim Perkins

import {Upgrade} from "creeps/tasks/upgrade";

import {Attacker} from "../creeps/attacker";
import {Builder} from "../creeps/builder";
import {Claimer} from "../creeps/claimer";
import {Harvester} from "../creeps/harvester";
import {Miner} from "../creeps/miner";
import {Upgrader} from "../creeps/upgrader";
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

  private static readonly _ROLES_BY_NAME: {[roleName: string]: Utils.Role} = {
    [Harvester.ROLE_NAME]: Harvester,
    [Miner.ROLE_NAME]: Miner,
    [Builder.ROLE_NAME]: Builder,
    [Upgrader.ROLE_NAME]: Upgrader,
    [Waller.ROLE_NAME]: Waller,
    [Attacker.ROLE_NAME]: Attacker,
    [Claimer.ROLE_NAME]: Claimer,
  };

  private static readonly _SPAWN_ORDER: string[] = [
    Harvester.ROLE_NAME,
    Miner.ROLE_NAME,
    Builder.ROLE_NAME,
    Upgrader.ROLE_NAME,
    Waller.ROLE_NAME,
    Attacker.ROLE_NAME,
    Claimer.ROLE_NAME,
  ];

  private static readonly _DEFAULT_POPULATIONS: Utils.RolePopulations = {
    [Harvester.ROLE_NAME]: {population: 4},
    // Miner population is overwritten per colony
    [Miner.ROLE_NAME]: {population: 0, atLevel: 2},
    [Builder.ROLE_NAME]: {population: 2},
    [Upgrader.ROLE_NAME]: {population: 1},
    [Waller.ROLE_NAME]: {population: 2},
    [Attacker.ROLE_NAME]: {population: 4},
    [Claimer.ROLE_NAME]: {population: 1, atLevel: 3},
  };

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
    // Copy the default, but adjust to make a miner per source
    const targetPopulations = _.merge({}, Colony._DEFAULT_POPULATIONS) as Utils.RolePopulations;
    const targetMinerPopulation = room.memory.sourceIds.length;
    targetPopulations[Miner.ROLE_NAME].population = targetMinerPopulation;
    // TODO HACK Only spawn claimer in my main room
    if (room.name !== "E52S56") {
      targetPopulations[Claimer.ROLE_NAME].population = 0;
    }
    // Get the actual population for each role
    const actualPopulations = (() => {
      const creepsByRole = _.groupBy(creeps, (creep) => creep.memory.role);
      return _.mapValues(Colony._ROLES_BY_NAME, (_, roleName) => {
        return (creepsByRole[roleName as string] || []).length;
      });
    })();
    // Determine what to spawn
    for (const roleName of Colony._SPAWN_ORDER) {
      const targetPopulation = targetPopulations[roleName];
      const actualPopulation = actualPopulations[roleName];
      if ((targetPopulation.atLevel == null || controller.level >= targetPopulation.atLevel)
          && actualPopulation < targetPopulation.population) {
        const role = Colony._ROLES_BY_NAME[roleName];
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
        let postSpawnHook: (() => void)|null = null;
        if (role === Miner) {
          // Find which source this miner should use
          const vacantSourceId = _.find(room.memory.sourceIds, (sourceId) => {
            const minerName = room.memory.minerNameForSourceId[sourceId];
            return !minerName || !Game.creeps[minerName];
          });
          if (vacantSourceId) {
            memory.sourceId = vacantSourceId;
            postSpawnHook = () => {
              // Assign the source to the miner
              room.memory.minerNameForSourceId[vacantSourceId] = name;
            };
          } else {
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
          if (postSpawnHook) {
            postSpawnHook();
          }
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
      if (!creep.spawning) {
        const role = Colony._ROLES_BY_NAME[creep.memory.role];
        role.run(creep);
      }
    }
  }
}
