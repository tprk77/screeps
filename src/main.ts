// Copyright (c) 2018 Tim Perkins

import { Harvester } from "./roles/harvester";

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

  if (harvesters.length < 4) {
    const newName = "Harvester" + Game.time;
    console.log("Spawning new harvester: " + newName);
    Game.spawns.Spawn1.spawnCreep(
      [CARRY, CARRY, WORK, WORK, MOVE, MOVE],
      newName, {memory: {role: "harvester"} as CreepMemory});
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role === "harvester") {
      Harvester.run(creep);
    }
  }
};
