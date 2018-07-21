// Copyright (c) 2018 Tim Perkins

import { Builder } from "./roles/builder";
import { Harvester } from "./roles/harvester";
import { Upgrader } from "./roles/upgrader";

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

  const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === "harvester");
  const builders = _.filter(Game.creeps, (creep) => creep.memory.role === "builder");
  const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === "upgrader");

  if (harvesters.length < 4) {
    const newName = "Harvester" + Game.time;
    console.log("Spawning new harvester: " + newName);
    Game.spawns.Spawn1.spawnCreep(
      [CARRY, CARRY, WORK, WORK, MOVE, MOVE],
      newName, {memory: {role: "harvester"} as CreepMemory});
  } else if (builders.length < 4) {
    const newName = "Builder" + Game.time;
    console.log("Spawning new builder: " + newName);
    Game.spawns.Spawn1.spawnCreep(
      [CARRY, CARRY, WORK, WORK, MOVE, MOVE],
      newName, {memory: {role: "builder"} as CreepMemory});
  } else if (upgraders.length < 6) {
    const newName = "Upgrader" + Game.time;
    console.log("Spawning new upgrader: " + newName);
    Game.spawns.Spawn1.spawnCreep(
      [CARRY, CARRY, WORK, WORK, MOVE, MOVE],
      newName, {memory: {role: "upgrader"} as CreepMemory});
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role === "harvester") {
      Harvester.run(creep);
    } else if (creep.memory.role === "builder") {
      Builder.run(creep);
    } else if (creep.memory.role === "upgrader") {
      Upgrader.run(creep);
    }
  }
};
