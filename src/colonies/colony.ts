// Copyright (c) 2018 Tim Perkins

import {Attacker} from "../creeps/attacker";
import {Builder} from "../creeps/builder";
import {Claimer} from "../creeps/claimer";
import {Harvester} from "../creeps/harvester";
import {Miner} from "../creeps/miner";
import {Upgrader} from "../creeps/upgrader";
import {Waller} from "../creeps/waller";
import {Tower} from "../towers/tower";
import * as Utils from "./utils";

/**
 * A Colony of creeps.
 */
export class Colony {

  /**
   * Run the colony.
   *
   * @param room The claimed room of the colony.
   */
  public static run(room: Room): void {
    // TODO REMOVE!
    if (room.memory.creepIds) {
      console.log("CLEARING MEMORY!");
      delete room.memory.creepIds;
      delete room.memory;
    }
    // Check to initialize colony memory
    if (!room.memory) {
      Colony.initializeColonyMemory(room);
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
    const existingCreeps = _.transform(room.memory.creepNames, (creeps, creepName) => {
      const creep = Game.creeps[creepName];
      if (creep) {
        creeps.push(creep);
      }
    }) as Creep[];
    // Get newly spawned creeps
    const newCreeps = room.find(FIND_MY_CREEPS, {
      // TODO WARNING SLOW!
      filter: (creep) => !_.includes(existingCreeps, creep),
    });
    // Combine new and existing creeps
    const creeps = newCreeps.concat(existingCreeps);
    // Remove dead creeps from the colony memory
    room.memory.creepNames = creeps.map((creep) => creep.name);
    // Run everything in the colony!
    Colony.runSpawns(room, spawns, creeps);
    Colony.runTowers(room, towers);
    Colony.runCreeps(room, creeps);
  }

  /**
   * Initializes the colony's memory.
   *
   * @param room The colony room, providing memory access.
   * @param override Reset the colony's memory.
   */
  private static initializeColonyMemory(room: Room, override: boolean = false): void {
    console.log("Initializing colony memory!");
    if (room.memory.creepNames == null) {
      room.memory.creepNames = [];
      // TODO REMOVE! JANK CODE!
      // Using this to transfer all creeps to the only room I have at the moment!
      room.memory.creepNames = _.map(Game.creeps, (creep) => creep.name);
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
    // TODO Mutli-spawn support
    if (!spawns.length) {
      return;
    }
    const spawn = spawns[0];
    // Figure out the best parts for potenital new creeps
    const bestWorkerParts = Utils.getBestPartsForEnergy(
        room.energyAvailable,
        [CARRY, WORK, MOVE],
        [[CARRY, WORK, MOVE]],
    );
    const bestMinerParts = Utils.getBestPartsForEnergy(
        Math.max(room.energyAvailable, 0.75 * room.energyCapacityAvailable),
        [WORK, CARRY, MOVE],
        [[WORK], [WORK, CARRY, MOVE]],
    );
    const bestAttackerParts = Utils.getBestPartsForEnergy(
        room.energyAvailable,
        [TOUGH, ATTACK, MOVE],
        [
          [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE],
          [ATTACK, ATTACK, MOVE, MOVE],
          [ATTACK, MOVE],
        ],
        false,
    );
    const bestClaimerParts = Utils.getBestPartsForEnergy(
        room.energyAvailable,
        [CLAIM, MOVE],
        [[CLAIM, MOVE]],
    );
    // Count all the different creeps
    const numHarvesters = _.filter(creeps, (creep) => creep.memory.role === "harvester").length;
    const numMiners = _.filter(creeps, (creep) => creep.memory.role === "miner").length;
    const numBuilders = _.filter(creeps, (creep) => creep.memory.role === "builder").length;
    const numUpgraders = _.filter(creeps, (creep) => creep.memory.role === "upgrader").length;
    const numWallers = _.filter(creeps, (creep) => creep.memory.role === "waller").length;
    const numAttackers = _.filter(creeps, (creep) => creep.memory.role === "attacker").length;
    const numClaimers = _.filter(creeps, (creep) => creep.memory.role === "claimer").length;
    // Determine what to spawn
    interface SpawnInfo {
      memory: CreepMemory;
      name: string;
      parts: BodyPartConstant[];
    }
    let spawnInfo: SpawnInfo|null = null;
    if (spawn.spawning) {
      // Do nothing, wait for the spawn to complete
    } else if (numHarvesters < 4) {
      spawnInfo = {
        memory: {role: "harvester"} as CreepMemory,
        name: "Harvester" + Game.time,
        parts: bestWorkerParts,
      };
    } else if ((room.controller as StructureController).level >= 3 && numMiners < 2) {
      // TODO Replace this code with better creep management
      const minerOneName = "MinerOne_" + room.name;
      const minerTwoName = "MinerTwo_" + room.name;
      const minerOne = Game.creeps[minerOneName];
      const minerTwo = Game.creeps[minerTwoName];
      if (!minerOne) {
        spawnInfo = {
          memory: {role: "miner", sourceIndex: 0} as CreepMemory,
          name: minerOneName,
          parts: bestMinerParts,
        };
      } else if (!minerTwo) {
        spawnInfo = {
          memory: {role: "miner", sourceIndex: 1} as CreepMemory,
          name: minerTwoName,
          parts: bestMinerParts,
        };
      }
    } else if (numBuilders < 2) {
      spawnInfo = {
        memory: {role: "builder"} as CreepMemory,
        name: "Builder" + Game.time,
        parts: bestWorkerParts,
      };
    } else if (numUpgraders < 4) {
      spawnInfo = {
        memory: {role: "upgrader"} as CreepMemory,
        name: "Upgrader" + Game.time,
        parts: bestWorkerParts,
      };
    } else if (numWallers < 2) {
      spawnInfo = {
        memory: {role: "waller"} as CreepMemory,
        name: "Waller" + Game.time,
        parts: bestWorkerParts,
      };
    } else if (numAttackers < 6) {
      spawnInfo = {
        memory: {role: "attacker", attackFlagName: "AttackFlag"} as CreepMemory,
        name: "Attacker" + Game.time,
        parts: bestAttackerParts,
      };
    } else if (numClaimers < 1) {
      spawnInfo = {
        memory: {role: "claimer", claimFlagName: "ClaimFlag"} as CreepMemory,
        name: "Claimer" + Game.time,
        parts: bestClaimerParts,
      };
    }
    // Try to spawn a creep
    if (spawnInfo) {
      console.log("Spawning new creep: " + spawnInfo.name);
      spawn.spawnCreep(spawnInfo.parts, spawnInfo.name, {memory: spawnInfo.memory});
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
