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

export const loop = () => {
  console.log("Current game tick is " + Game.time);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  const towers =
    (_.filter(Game.structures, (structure) => {structure.structureType === STRUCTURE_TOWER) as
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

  if (harvesters.length < 4) {
    const newName = "Harvester" + Game.time;
    console.log("Spawning new harvester: " + newName);
    spawn.spawnCreep([CARRY, CARRY, WORK, WORK, MOVE, MOVE], newName,
                     {memory: {role: "harvester"} as CreepMemory});
  } else if (builders.length < 4) {
    const newName = "Builder" + Game.time;
    console.log("Spawning new builder: " + newName);
    spawn.spawnCreep([CARRY, CARRY, WORK, WORK, MOVE, MOVE], newName,
                     {memory: {role: "builder"} as CreepMemory});
  } else if (upgraders.length < 6) {
    const newName = "Upgrader" + Game.time;
    console.log("Spawning new upgrader: " + newName);
    spawn.spawnCreep([CARRY, CARRY, WORK, WORK, MOVE, MOVE], newName,
                     {memory: {role: "upgrader"} as CreepMemory});
  } else if (wallers.length < 2) {
    const newName = "Waller" + Game.time;
    console.log("Spawning new waller: " + newName);
    spawn.spawnCreep([CARRY, CARRY, WORK, WORK, MOVE, MOVE], newName,
                     {memory: {role: "waller"} as CreepMemory});
  } else if (attackers.length < 6) {
    const newName = "Attacker" + Game.time;
    console.log("Spawning new attacker: " + newName);
    spawn.spawnCreep([ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE], newName,
                     {memory: {role: "attacker", flagId: "AttackFlag"} as CreepMemory});
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
};
