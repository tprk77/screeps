// Copyright (c) 2018 Tim Perkins

declare interface CreepMemory {
  // General memory
  role: string;
  sourceIndex?: number;

  // Harvester memory
  harvesting: boolean;

  // Upgrader memory
  upgrading: boolean;

  // Builder memory
  building: boolean;

  // Waller memory
  walling: boolean;

  // Attacker memory
  attackFlagName: string;

  // Claimer memory
  claimFlagName: string;
}
